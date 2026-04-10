# Student Progress API

Backend service for managing student results using MySQL on Google Cloud SQL.

This project demonstrates:

- MySQL schema design
- raw SQL migrations (no ORM)
- Cloud SQL setup on GCP
- secure local development via Auth Proxy
- TypeScript backend with clear layering

## Tech Stack

- Node.js – runtime environment
- TypeScript – type-safe language
- Express – REST API layer
- Google Cloud SQL - Database
- Cloud SQL Auth Proxy

## Project structure 

```
src/          → application code
scripts/      → dev/ops scripts (migrations, seed, db test)
sql/          → raw SQL (schema + seed)
```



## One-off Infrastructure Setup (GCP)

Run once per environment.

1. Enable API


```shell
gcloud services enable sqladmin.googleapis.com
```


2. Create Cloud SQL instance

```shell
gcloud sql instances create school-mysql-dev \
  --database-version=MYSQL_8_0 \
  --tier=db-f1-micro \
  --region=europe-west3
```

3. Create database

```shell
gcloud sql databases create school --instance=school-mysql-dev
```

4. Configure users

Set admin password

```shell
gcloud sql users set-password root \
  --host=% \
  --instance=school-mysql-dev \
  --password='STRONG_ADMIN_PASSWORD'
```

Create app user

```shell
gcloud sql users create app-user \
  --instance=school-mysql-dev \
  --password='STRONG_APP_PASSWORD'
```


## Local Development Setup

1. Authenticate to GCP

2. Install and run Auth Proxy

```shell
brew install cloud-sql-proxy
```

Get connection name:

```
gcloud sql instances describe school-mysql-dev \
  --format='value(connectionName)'
```

Run proxy:

```shell
cloud-sql-proxy <CONNECTION_NAME> --port 3306
```


## Database Workflow


Schema is managed via raw SQL migrations:

```
npm run db:migrate
```

Populate database with sample data:

```
npm run db:seed
```