fmt:
	terraform fmt -recursive

validate:
	terraform validate

lint:
	tflint
	
plan-staging: fmt validate lint
	terraform plan -var-file=staging.tfvars

apply-staging: fmt validate lint
	terraform apply -var-file=staging.tfvars

plan-prod: fmt validate lint
	terraform plan -var-file=prod.tfvars

apply-prod: fmt validate lint
	terraform apply -var-file=prod.tfvars

destroy-staging: fmt validate lint
	@read -p "Destroy STAGING resources? (yes/no): " confirm && [ "$$confirm" = "yes" ]
	terraform destroy -var-file=staging.tfvars

destroy-prod: fmt validate lint
	@read -p "Destroy PROD resources? (yes/no): " confirm && [ "$$confirm" = "yes" ]
	terraform destroy -var-file=prod.tfvars