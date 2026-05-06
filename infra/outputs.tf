output "redis_host" {
  value = google_redis_instance.cache.host
}

output "redis_port" {
  value = google_redis_instance.cache.port
}


# GitHub deployer service account email used by GitHub Actions authentication
output "github_deployer_service_account_email" {
  value = google_service_account.github_deployer.email
}

# Workload Identity Provider resource name used by GitHub Actions authentication
output "github_workload_identity_provider_name" {
  value = google_iam_workload_identity_pool_provider.github_provider.name
}
