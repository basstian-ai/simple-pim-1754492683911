#!/usr/bin/env bash

# Build the repository Dockerfile and run pytest inside the container.
# Streams container logs to stdout/stderr and returns the pytest exit code.
# Usage:
#   ./scripts/run_in_docker.sh            # runs `pytest` with no extra args
#   ./scripts/run_in_docker.sh -q -k test_thing
# The script will build the image tagged by IMAGE_NAME (env var, default: recipefinder-tests).

set -u

IMAGE_NAME="${IMAGE_NAME:-recipefinder-tests}"
CONTAINER_NAME="run_tests_$(date +%s%N)"

# Cleanup function to remove container on exit
cleanup() {
  if command -v docker >/dev/null 2>&1; then
    # ensure container is removed if it exists
    if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
      docker rm -f "${CONTAINER_NAME}" >/dev/null 2>&1 || true
    fi
  fi
}
trap cleanup EXIT

# Basic checks
if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker is not installed or not on PATH." >&2
  exit 66
fi

# Build image
echo "[run_in_docker] Building Docker image '${IMAGE_NAME}' from ./Dockerfile..."
if ! docker build -t "${IMAGE_NAME}" .; then
  echo "[run_in_docker] Docker build failed." >&2
  exit 1
fi

# Compose pytest command from provided args (if any)
PYTEST_CMD=(pytest)
if [[ $# -gt 0 ]]; then
  PYTEST_CMD=(pytest "$@")
fi

# Create container so we can collect exit code and logs
CID=$(docker create --name "${CONTAINER_NAME}" "${IMAGE_NAME}" ${PYTEST_CMD[@]}) || {
  echo "[run_in_docker] docker create failed." >&2
  exit 2
}

# Start container
docker start "${CID}" >/dev/null || {
  echo "[run_in_docker] docker start failed." >&2
  docker rm -f "${CID}" >/dev/null 2>&1 || true
  exit 3
}

# Stream logs (follow). This will exit when the container stops.
echo "[run_in_docker] Streaming test output from container (${CONTAINER_NAME})..."
docker logs -f "${CID}" &
LOG_PID=$!

# Wait for container to finish; docker wait prints the container exit code
EXIT_CODE=$(docker wait "${CID}")

# Wait for the logs follower to finish flushing output
wait "${LOG_PID}" 2>/dev/null || true

# Echo exit code summary and full logs for easier reproduction
echo "[run_in_docker] Container exited with code: ${EXIT_CODE}"
echo "[run_in_docker] ===== Full container logs (end) ====="
docker logs "${CID}" || true

# Remove the finished container (image is kept to speed up subsequent runs)
docker rm "${CID}" >/dev/null 2>&1 || true

exit "${EXIT_CODE}"
