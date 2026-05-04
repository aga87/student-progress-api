resource "google_artifact_registry_repository" "api" {
  project       = var.project_id
  location      = var.region
  repository_id = "student-progress-api"
  description   = "Docker repository for Student Progress API"
  format        = "DOCKER"

  depends_on = [
    google_project_service.apis
  ]
}
