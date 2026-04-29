resource "google_sql_database_instance" "mysql" {
  name             = "${var.db_instance_name_prefix}-${var.environment}"
  database_version = "MYSQL_8_0"
  region           = var.region

  settings {
    tier = "db-f1-micro"

    database_flags {
      name  = "cloudsql_iam_authentication"
      value = "on"
    }
  }

  deletion_protection = false

  depends_on = [
    google_project_service.apis
  ]
}

resource "google_sql_database" "app_db" {
  name     = var.db_name
  instance = google_sql_database_instance.mysql.name
}

resource "google_sql_user" "app_iam_user" {
  name     = google_service_account.app.email
  instance = google_sql_database_instance.mysql.name
  type     = "CLOUD_IAM_SERVICE_ACCOUNT"
}
