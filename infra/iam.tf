resource "google_service_account" "app" {
  account_id   = "student-progress-app-sa"
  display_name = "Student Progress App"
}

resource "google_project_iam_member" "app_roles" {
  for_each = toset([
    "roles/cloudsql.client",
    "roles/cloudsql.instanceUser",
  ])

  project = var.project_id
  role    = each.value

  member = "serviceAccount:${google_service_account.app.email}"
}
