.PHONY: test docker-test package-validate

test:
	@echo "Running pytest..."
	pytest -q

docker-test:
	@echo "Building Docker image for tests..."
	docker build -t recipe-finder-test:latest .
	@echo "Running tests inside Docker container..."
	docker run --rm recipe-finder-test:latest pytest -q

package-validate:
	@echo "Validating packaging..."
	@bash scripts/validate_packaging.sh
