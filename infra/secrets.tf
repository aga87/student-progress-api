resource "google_secret_manager_secret" "secrets" {
  for_each = toset([
    "db-admin-password",
  ])

  secret_id = "${var.environment}-${each.value}"

  replication {
    auto {}
  }

  depends_on = [
    google_project_service.apis
  ]
}
