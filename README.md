# Student Progress API

Backend service for managing student results, built with MySQL on Google Cloud SQL and Redis for caching. Infrastructure is provisioned using Terraform.

Implements a cache-aside strategy with explicit cache invalidation on writes and graceful degradation on cache failures, allowing the API to fall back to the database while accepting bounded staleness.

## This project demonstrates:

- MySQL schema design
- raw SQL migrations (no ORM)
- Redis cache-aside strategy with cache invalidation
- Cloud SQL setup on GCP
- secure local development via Auth Proxy
- TypeScript backend with clear layering
- Infrastructure as Code (Terraform)

## Tech Stack

- Node.js – runtime environment
- TypeScript – type-safe language
- Express – REST API layer
- Google Cloud SQL - Database
- Redis – caching layer  
- Docker – local containerised Redis development 
- Terraform – infrastructure provisioning

## Project structure 

```
src/          → application code
scripts/      → dev/ops scripts (migrations, seed, db test)
sql/          → raw SQL (schema + seed)
infra/        → Terraform infrastructure configuration
```

## Architecture

```
Cloud SQL (remote DB)
+
Cloud SQL Auth Proxy
+
MySQL CLI (optional, for debugging)
```


## Infrastructure (Terraform)

Infrastructure is provisioned using Terraform.

Terraform workflow commands are defined in `infra/Makefile`, including formatting, validation, linting, planning, and applying changes.

```bash
cd infra

make plan-staging
make apply-staging
make destroy-staging

make plan-prod
make apply-prod
make destroy-prod
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

## 2. **Grant Database Privileges to Application IAM User**

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
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, INDEX
ON student_progress.*
TO 'student-progress-app-sa'@'%';
```
Then
```sql
FLUSH PRIVILEGES;
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

Connect  an **IAM DB user**

```
mysql -h 127.0.0.1 -P 3306 -u student-progress-app-sa
```

Try to access the DB:

```
USE student_progress;
SHOW TABLES;
```



## One-off Local Development Setup

1. Install Auth Proxy & update dev script

```shell
brew install cloud-sql-proxy
```

Ensure the Cloud SQL connection name in `package.json`- `"dev:proxy"` script is correct for your environment.


2. Init Redis container

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


Schema is managed via raw SQL migrations:

```
npm run db:migrate
```

Populate database with sample data:

```
npm run db:seed
```