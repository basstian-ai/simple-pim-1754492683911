FROM python:3.11-slim

# Small image to run pytest in a controlled environment for CI/local docker-test
WORKDIR /app
COPY . /app

# Ensure pytest is available inside the image
RUN pip install --no-cache-dir pytest

# Default command runs the test suite
ENTRYPOINT ["pytest"]
