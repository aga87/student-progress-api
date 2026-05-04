resource "google_redis_instance" "cache" {
  name           = "student-progress-redis"
  tier           = "BASIC"
  memory_size_gb = 1
  region         = var.region
  redis_version  = "REDIS_7_0"

  depends_on = [
    google_project_service.apis
  ]
}
