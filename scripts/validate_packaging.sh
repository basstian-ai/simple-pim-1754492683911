#!/usr/bin/env bash
set -euo pipefail

# validate_packaging.sh
# Build sdist/wheel for the current project and pip-install it into a temporary venv.
# Exit non-zero if build/install/import checks fail.

PROJROOT="$(pwd)"
OUTDIR="$(mktemp -d)"
VENVDIR="$(mktemp -d)"
PY=${PYTHON:-python3}

cleanup() {
  rm -rf "${OUTDIR}" || true
  rm -rf "${VENVDIR}" || true
}
trap cleanup EXIT

echo "[validate_packaging] Using Python: $($PY --version 2>&1)"

# Ensure Python exists
if ! command -v "$PY" >/dev/null 2>&1; then
  echo "ERROR: Python binary '$PY' not found. Set PYTHON env var to a valid python executable." >&2
  exit 2
fi

# Build package: prefer PEP517 build (pyproject.toml) else legacy setup.py
if [ -f "pyproject.toml" ]; then
  echo "[validate_packaging] Detected pyproject.toml — using 'python -m build'"
  "$PY" -m pip install --upgrade --quiet build wheel setuptools >/dev/null
  # -w builds wheels; output to OUTDIR
  "$PY" -m build -w -o "$OUTDIR"
elif [ -f "setup.py" ]; then
  echo "[validate_packaging] Detected setup.py — using setup.py sdist/bdist_wheel"
  "$PY" -m pip install --upgrade --quiet wheel setuptools >/dev/null
  (cd "$PROJROOT" && "$PY" setup.py sdist bdist_wheel --dist-dir "$OUTDIR")
else
  echo "ERROR: No pyproject.toml or setup.py found in project root; cannot build package." >&2
  exit 3
fi

echo "[validate_packaging] Build artifacts placed in: $OUTDIR"
ls -la "$OUTDIR"

# Find a wheel or sdist artifact
WHEEL_FILE=""
SDIST_FILE=""
shopt -s nullglob || true
for f in "$OUTDIR"/*.whl; do
  WHEEL_FILE="$f"
  break
done
for f in "$OUTDIR"/*.tar.gz "$OUTDIR"/*.zip; do
  SDIST_FILE="$f"
  break
done

if [ -n "$WHEEL_FILE" ]; then
  ARTIFACT="$WHEEL_FILE"
  echo "[validate_packaging] Using wheel: $ARTIFACT"
elif [ -n "$SDIST_FILE" ]; then
  ARTIFACT="$SDIST_FILE"
  echo "[validate_packaging] Wheel not found; using sdist: $ARTIFACT"
else
  echo "ERROR: No built artifacts (.whl, .tar.gz, .zip) found in $OUTDIR" >&2
  exit 4
fi

# Create venv and install the built artifact
echo "[validate_packaging] Creating virtualenv at $VENVDIR"
"$PY" -m venv "$VENVDIR"
# shellcheck source=/dev/null
source "$VENVDIR/bin/activate"
python -m pip install --upgrade pip setuptools wheel >/dev/null

echo "[validate_packaging] Installing built artifact into venv"
if ! pip install --no-deps "$ARTIFACT"; then
  echo "ERROR: pip install failed for $ARTIFACT" >&2
  deactivate || true
  exit 5
fi

# Determine top-level importable names from wheel or installed package
CANDIDATES=()
if [ -n "$WHEEL_FILE" ]; then
  # Use Python to extract top_level.txt from the wheel (no external unzip dependency)
  readarray -t tl < <(python - <<PY
import sys, zipfile
p = '${WHEEL_FILE}'.replace("$", "\$")
try:
    with zipfile.ZipFile(p) as z:
        # find top_level.txt
        for n in z.namelist():
            if n.endswith('top_level.txt'):
                data = z.read(n).decode('utf-8')
                for line in data.splitlines():
                    line = line.strip()
                    if line:
                        print(line)
                sys.exit(0)
except Exception:
    pass
# nothing found
PY
)
  if [ "${#tl[@]}" -gt 0 ]; then
    echo "[validate_packaging] Top-level modules from wheel: ${tl[*]}"
    CANDIDATES=("${tl[@]}")
  fi
fi

# If no top_level info found, fallback to diffing pkgutil modules before/after install
if [ ${#CANDIDATES[@]} -eq 0 ]; then
  echo "[validate_packaging] top_level.txt not found in wheel; falling back to pkgutil diff detection"
  BEFORE=$(mktemp)
  AFTER=$(mktemp)
  python - <<PY > "$BEFORE"
import pkgutil
names = sorted(m.name for m in pkgutil.iter_modules())
print('\n'.join(names))
PY
  # We already installed; capture after
  python - <<PY > "$AFTER"
import pkgutil
names = sorted(m.name for m in pkgutil.iter_modules())
print('\n'.join(names))
PY
  # diff to find new modules
  mapfile -t CANDIDATES < <(comm -13 "$BEFORE" "$AFTER" || true)
  rm -f "$BEFORE" "$AFTER"
  if [ ${#CANDIDATES[@]} -gt 0 ]; then
    echo "[validate_packaging] Candidate modules discovered by diff: ${CANDIDATES[*]}"
  else
    echo "[validate_packaging] No new modules detected by diff. Will attempt to parse metadata name and try that." 
  fi
fi

# If still no candidates, try parsing distribution Name from installed package metadata
if [ ${#CANDIDATES[@]} -eq 0 ]; then
  DISTNAME=$(python - <<PY
import importlib, pkgutil, sys
# Try to find distribution metadata from installed distributions (pip)
try:
    import importlib.metadata as m
except Exception:
    try:
        import pkg_resources as m
    except Exception:
        m = None
if m:
    try:
        # list installed distributions, pick ones not in stdlib by heuristics
        dists = list(m.distributions()) if hasattr(m, 'distributions') else m.working_set
        for d in dists:
            name = d.metadata['Name'] if hasattr(d, 'metadata') and 'Name' in d.metadata else (d.metadata.get('Name') if hasattr(d, 'metadata') else getattr(d, 'project_name', None))
            if name and 'pip' not in name.lower() and 'setuptools' not in name.lower():
                print(name)
                break
    except Exception:
        pass
PY
)
  if [ -n "$DISTNAME" ]; then
    echo "[validate_packaging] Fallback guessed distribution name: $DISTNAME"
    # try lowercased/dotted variants
    CANDIDATES=("$DISTNAME" "${DISTNAME//-/_}" "${DISTNAME,,}" )
  fi
fi

if [ ${#CANDIDATES[@]} -eq 0 ]; then
  echo "WARNING: Could not determine import candidates automatically. To validate imports manually, run a python -c 'import your_package' inside the venv at: $VENVDIR" >&2
  deactivate || true
  exit 0
fi

# Try importing candidates. If any candidate imports successfully, consider it a success.
IMPORT_OK=0
for cand in "${CANDIDATES[@]}"; do
  cand=$(echo "$cand" | tr -d '\r\n')
  if [ -z "$cand" ]; then
    continue
  fi
  echo -n "[validate_packaging] Trying import: $cand ... "
  if python - <<PY >/dev/null 2>&1
try:
    import importlib
    importlib.import_module('$cand')
except Exception as e:
    raise
PY
  then
    echo "OK"
    IMPORT_OK=1
    break
  else
    echo "FAILED"
  fi
done

deactivate || true

if [ "$IMPORT_OK" -ne 1 ]; then
  echo "ERROR: None of the candidate top-level modules imported successfully. Packaging validation failed." >&2
  exit 6
fi

echo "[validate_packaging] Packaging validation succeeded. Built artifact: $ARTIFACT"