FROM node:20-slim

ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /app

# Install Python + pip and some build tools (so pytest and native builds work)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       python3 python3-pip build-essential ca-certificates git \
    && rm -rf /var/lib/apt/lists/*

# Copy project into container
COPY . .

# Install Node dependencies (prefer lockfile CI if present). Try to be tolerant if package files are absent.
RUN set -e; \
    if [ -f package-lock.json ]; then \
      npm ci --prefer-offline --no-audit --progress=false || npm install --prefer-offline --no-audit --progress=false; \
    else \
      # fallback to npm install (works for projects without lockfile)
      npm install --prefer-offline --no-audit --progress=false || true; \
    fi

# Ensure pytest is available. If a Python dev requirements file exists, install it; otherwise install pytest alone.
RUN if [ -f requirements-dev.txt ]; then \
      pip3 install --no-cache-dir -r requirements-dev.txt || pip3 install --no-cache-dir pytest; \
    else \
      pip3 install --no-cache-dir pytest; \
    fi

# Default command: run pytest. CI or local contributors can override this to run other commands.
CMD ["pytest", "-q"]
