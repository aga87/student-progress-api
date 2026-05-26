[![CI](https://github.com/aga87/student-progress-api/actions/workflows/ci.yml/badge.svg)](https://github.com/aga87/student-progress-api/actions)

# Student Progress API

Backend service for managing student results, built with MySQL on Google Cloud SQL and Redis for caching. Infrastructure is provisioned using Terraform.

Implements a cache-aside strategy with explicit cache invalidation on writes and graceful degradation on cache failures, allowing the API to fall back to the database while accepting bounded staleness.

## This project demonstrates

- MySQL schema design
- raw SQL migrations (no ORM)
- Redis cache-aside strategy with cache invalidation
- Cloud SQL setup on GCP
- Cloud Run deployment (serverless container runtime)
- secure local development via Auth Proxy
- TypeScript backend with clear layering
- Infrastructure as Code (Terraform)

## Tech Stack

- Node.js – runtime environment
- TypeScript – type-safe language
- Express – REST API layer
- Google Cloud SQL - Database
- Google Cloud Run – serverless container platform
- Redis – caching layer
- Docker – local containerised Redis development
- Terraform – infrastructure provisioning

## Architecture

The API is a Node.js/Express service with a MySQL database on Google Cloud SQL and Redis as a cache layer.

The application uses a cache-aside strategy:

1. Read requests first check Redis.
2. On a cache hit, the cached response is returned.
3. On a cache miss, the API reads from MySQL and stores the result in Redis with a TTL.
4. Write operations update MySQL and explicitly invalidate affected cache keys.
5. If Redis is unavailable, the API falls back to MySQL and logs the cache failure.

**Redis (Memorystore)** is deployed with a private IP inside a VPC network.
Cloud Run accesses Redis using Direct VPC egress (`private-ranges-only`).

**Cloud SQL connectivity** differs between environments:

- Local development uses the Cloud SQL Auth Proxy with IAM authentication over TCP
- Production uses the Cloud SQL Node.js Connector with IAM database authentication
- No database passwords are stored or used in the application

Local:

```
Client → Node.js app (Express)
              ↓
          Redis (local Docker)
          ↙         ↘
     (hit) return   (miss)
                      ↓
        Cloud SQL Auth Proxy
                      ↓
             Cloud SQL (MySQL)
                      ↓
                   return
```

Production:

```
Client → Cloud Run
           ↓
        Redis (cache)
           ↓ (miss)
     MySQL (source of truth)
```

**Database access** uses IAM database authentication:

```txt
Local dev      → individual IAM DB user
Cloud Run app  → service account IAM DB user
Admin tasks    → separate admin user / controlled IAM access
```

**The API runs on Cloud Run and connects to private resources via Direct VPC egress.**

```txt
Client
   ↓
Cloud Run service
   ↓
Direct VPC egress
   ↓
VPC Network
   ↓
Private resources (Cloud SQL / Redis)
```

### API Scope

This project intentionally implements a small set of representative endpoints rather than a complete CRUD API.
The goal is to demonstrate backend architecture and infrastructure patterns.

### Authentication

Authentication is intentionally not implemented.

In a production system, authentication would be introduced at the HTTP boundary via Express middleware. Typical approaches include:

- JWT-based authentication (access + refresh tokens, stateless verification, token rotation)
- External identity providers using OAuth2 / OpenID Connect

For GCP-based deployments, this service is designed to integrate with platform-native solutions such as:

- Cloud Run IAM authentication for service-to-service communication
- Identity-Aware Proxy (IAP) for user-level access control without embedding auth logic in the application

## Project structure

```
src/          → application code
scripts/      → dev/ops scripts (migrations, seed, db test)
sql/          → raw SQL (schema + seed)
infra/        → Terraform infrastructure configuration
```

## Prerequisites

- Node.js (see `.nvmrc` or `mise.toml` for the required version)

## Infrastructure (Terraform)

Infrastructure is provisioned using Terraform.

### Prerequisites

1. [Install Terraform](https://developer.hashicorp.com/terraform/install)

2. [Install TFLint](https://github.com/terraform-linters/tflint?utm_source=chatgpt.com)

3. [Install TFSec](https://aquasecurity.github.io/tfsec/v0.63.1/getting-started/installation/)

### Configuration

Terraform non-secret environment configuration lives in:

```text
infra/staging.tfvars
infra/prod.tfvars
```

### Workflow

Terraform workflow commands are defined in `infra/Makefile`, including formatting, validation, linting, planning, and applying changes.

```bash
cd infra

terraform init # one-off

make plan
make apply
make destroy
```

Commands default to the staging environment. In prod:

```bash
make apply ENV=prod
```

## One-off Infrastructure Setup (GCP)

Run once per environment.

The Cloud SQL instance, database, Secret Manager containers, and IAM-based application user are provisioned via Terraform.  
Credential values (such as the admin/root password) are configured separately to avoid storing secrets in Terraform state.

### 1. **Create a new database admin user**

The ‘root’@’%’ user is the default and most popular super user and therefore is often targeted by hackers. Creating a new admin user is the best security practice.

1. Store password in Secret Manager first:

```bash
printf "STRONG_ADMIN_PASSWORD" | gcloud secrets versions add staging-db-admin-password --data-file=-
```

2. Create the admin user:

```shell
gcloud sql users create admin-user \
  --host=% \
  --instance=student-progress-mysql-staging \
  --password="$(gcloud secrets versions access latest --secret=staging-db-admin-password)"
```

3. Delete the default root user:

```shell
gcloud sql users delete root \
  --host=% \
  --instance=student-progress-mysql-staging
```

### 2. **Grant Database Privileges to Application IAM User**

1. Get connection name:

```shell
gcloud sql instances describe student-progress-mysql-staging \
  --format='value(connectionName)'
```

2. Run proxy **without** IAM auth

```shell
cloud-sql-proxy student-progress-staging:europe-west3:student-progress-mysql-staging --port 3306
```

3. Connect as admin user:

```shell
mysql -h 127.0.0.1 -P 3306 -u admin-user \
  -p"$(gcloud secrets versions access latest --secret=staging-db-admin-password)"
```

4. Grant privileges:

```sql
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, INDEX, REFERENCES
ON student_progress.*
TO 'student-progress-app-sa'@'%';
```

5. Reconnect as IAM user to test database privileges and the production service account identity locally.

Allow a developer (or CI) to impersonate the application service account:

```bash
gcloud iam service-accounts add-iam-policy-binding \
  student-progress-app-sa@student-progress-staging.iam.gserviceaccount.com \
  --member="user:<YOUR_EMAIL>" \
  --role="roles/iam.serviceAccountTokenCreator"
```

Run the proxy while impersonating the service account:

```bash
cloud-sql-proxy \
  --auto-iam-authn \
  --impersonate-service-account student-progress-app-sa@student-progress-staging.iam.gserviceaccount.com \
  student-progress-staging:europe-west3:student-progress-mysql-staging \
  --port 3306
```

Connect as **IAM DB user**

```
mysql -h 127.0.0.1 -P 3306 -u student-progress-app-sa
```

Try to access the DB:

```
USE student_progress;
SHOW TABLES;
```

### 3. GitHub Actions Authentication (OIDC)

Deployments are handled automatically via GitHub Actions.

GitHub Actions authenticates to GCP using Workload Identity Federation (OIDC) instead of long-lived JSON service account keys.

Terraform provisions:

- a dedicated GitHub Actions deployer service account
- a Workload Identity Pool
- a GitHub OIDC provider
- IAM bindings allowing the repository to impersonate the deployer service account

Apply the Terraform configuration.

Add these Terraform outputs as GitHub Actions repository secrets:

| **Secret**                     | **Terraform output**                   |
| ------------------------------ | -------------------------------------- |
| GCP_WORKLOAD_IDENTITY_PROVIDER | github_workload_identity_provider_name |
| GCP_SERVICE_ACCOUNT            | github_deployer_service_account_email  |

## Deployment

Deployments are handled automatically via GitHub Actions.

Push to the `dev` branch to deploy to staging.

Push to the `main` branch to deploy to production.

## One-off Local Development Setup

### 1. **Install Auth Proxy & update dev script**

```shell
brew install cloud-sql-proxy
```

Ensure the Cloud SQL connection name in `package.json`- `"dev:proxy"` script is correct for your environment.

### 2. **Provision IAM Database User for Local Development**

Do this for **local dev as yourself**.

1. Create user:

```bash
gcloud sql users create <YOUR_EMAIL> \
  --instance=student-progress-mysql-staging \
  --type=cloud_iam_user
```

2. Grant your Google user Cloud SQL IAM roles:

```bash
gcloud projects add-iam-policy-binding student-progress-staging \
  --member="user:<YOUR_EMAIL>" \
  --role="roles/cloudsql.client"
```

```shell
gcloud projects add-iam-policy-binding student-progress-staging \
  --member="user:<YOUR_EMAIL>" \
  --role="roles/cloudsql.instanceUser"
```

`roles/cloudsql.client` is needed for the Auth Proxy, and `roles/cloudsql.instanceUser` is needed for IAM DB login.  

3. **Connect as admin/root & grant privileges** (as above)

Note: For Cloud SQL MySQL IAM users, the MySQL username is shortened.

Example:

```txt
IAM email:    dev-user@example.com
MySQL user:   dev-user
```

4. Update `DB_USER` env var - also shorthand.

5. Authenticate locally

```bash
gcloud auth application-default login
```

6. Start proxy\*

```shell
npm run dev:proxy
```

7. Test db connection

```bash
npm run db:test
```

### 3. **Init Redis container**

```shell
docker run --name student-progress-redis -p 6379:6379 -d redis
```

Stop Redis after startup

```shell
docker stop student-progress-redis
```

Future development startup will restart Redis automatically via the dev script.

## Local Development

```shell
npm run dev
```

This will:

- start the Redis Docker container
- start the Cloud SQL Auth Proxy
- start the application in watch mode

## Database Workflow

Local database setup is fully script-driven.

Start the Cloud SQL Auth Proxy:

```bash
npm run dev:proxy
```

Reset the database (drop existing tables):

```bash
npm run db:reset
```

Apply schema migrations:

```bash
npm run db:migrate
```

Populate the database with sample data:

```bash
npm run db:seed
```

Optional: verify the connection:

```bash
npm run db:test
```
