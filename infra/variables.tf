variable "project_id" {
  type        = string
  description = "GCP project ID"
}

variable "region" {
  type        = string
  description = "GCP region"
  default     = "europe-west3"
}

variable "environment" {
  type        = string
  description = "Deployment environment (e.g. staging, prod)"
}
variable "db_instance_name_prefix" {
  type        = string
  description = "Prefix for Cloud SQL instance name"
  default     = "student-progress-mysql"
}

variable "db_name" {
  type        = string
  description = "Application database name"
  default     = "student_progress"
}

variable "github_org" {
  type    = string
  default = "aga87"
}

variable "github_repo" {
  type    = string
  default = "student-progress-api"
}
