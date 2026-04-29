resource "google_project_service" "apis" {
  for_each = toset([
    "secretmanager.googleapis.com",
    "sqladmin.googleapis.com"
  ])

  project = var.project_id
  service = each.value

  disable_on_destroy = false
}
