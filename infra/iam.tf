# Runtime service account used by the application (Cloud Run runtime identity for Cloud SQL, Secret Manager, etc.)
resource "google_service_account" "app" {
  account_id   = "student-progress-app-sa"
  display_name = "Student Progress App"
}

resource "google_project_iam_member" "app_roles" {
  for_each = toset([
    "roles/cloudsql.client",
    "roles/cloudsql.instanceUser",
    "roles/secretmanager.secretAccessor"
  ])

  project = var.project_id
  role    = each.value

  member = "serviceAccount:${google_service_account.app.email}"
}


# GitHub Actions deployer service account
resource "google_service_account" "github_deployer" {
  account_id   = "github-deployer-sa"
  display_name = "GitHub Actions Deployer"
}

# Permissions for deploying to Cloud Run
resource "google_project_iam_member" "github_deployer_roles" {

  for_each = toset([
    "roles/run.admin",
    "roles/artifactregistry.writer",
    "roles/iam.serviceAccountUser"
  ])

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.github_deployer.email}"
}

# Workload Identity Pool used for GitHub Actions authentication
resource "google_iam_workload_identity_pool" "github_actions" {
  workload_identity_pool_id = "github-pool"

  display_name = "GitHub Actions Pool"
  description  = "Workload Identity Pool for GitHub Actions"
}

# GitHub OIDC provider used to authenticate GitHub Actions to GCP
resource "google_iam_workload_identity_pool_provider" "github_provider" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.github_actions.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-provider"

  display_name = "GitHub Provider"

  attribute_mapping = {
    "google.subject"             = "assertion.sub"
    "attribute.actor"            = "assertion.actor"
    "attribute.repository"       = "assertion.repository"
    "attribute.repository_owner" = "assertion.repository_owner"
    "attribute.ref"              = "assertion.ref"
  }

  # Allow authentication only from this repository and the dev/main deployment branches
  attribute_condition = "assertion.repository == '${var.github_org}/${var.github_repo}' && (assertion.ref == 'refs/heads/dev' || assertion.ref == 'refs/heads/main')"

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

# Allow GitHub Actions identities from this repository to impersonate the deployer service account
resource "google_service_account_iam_member" "github_actions_workload_identity" {
  service_account_id = google_service_account.github_deployer.name

  role = "roles/iam.workloadIdentityUser"

  member = "principalSet://iam.googleapis.com/projects/${data.google_project.current.number}/locations/global/workloadIdentityPools/${google_iam_workload_identity_pool.github_actions.workload_identity_pool_id}/attribute.repository/${var.github_org}/${var.github_repo}"
}

# Current GCP project metadata used for IAM bindings and resource references
data "google_project" "current" {
  project_id = var.project_id
}
