#!/usr/bin/env python3
"""
Sanity-check packaging metadata for the repository.

Checks that either pyproject.toml or setup.cfg exists and contains the required
fields: name, version, description, dependencies.

Exit codes:
 - 0: all required metadata present
 - 1: missing files or required fields
 - 2: fatal error (e.g. missing toml parser when needed)

Usage:
  python scripts/check_packaging_metadata.py

This script prefers PEP 621 style metadata (pyproject.toml [project]) but also
understands the common Poetry layout ([tool.poetry]) and legacy setup.cfg.
"""
from __future__ import annotations

import configparser
import json
import os
import sys
from typing import Any, Dict, List, Optional, Tuple

try:
    # Python 3.11+: tomllib is available in stdlib
    import tomllib as toml  # type: ignore
except Exception:
    # Fall back to the third-party toml package (pip install toml)
    try:
        import toml  # type: ignore
    except Exception:
        toml = None  # type: ignore


REQUIRED_FIELDS = ("name", "version", "description", "dependencies")


def read_pyproject(path: str) -> Dict[str, Any]:
    if toml is None:
        print("ERROR: No TOML parser available. Install Python 3.11+ or 'toml' package.")
        sys.exit(2)

    with open(path, "rb") as f:
        try:
            data = toml.load(f)
        except Exception as exc:  # tomllib or toml exceptions
            print(f"ERROR: Failed to parse {path}: {exc}")
            sys.exit(2)
    return data


def extract_from_pyproject(data: Dict[str, Any]) -> Dict[str, Any]:
    """Try multiple common layouts for packaging metadata in pyproject.toml.

    Supports:
      - PEP 621: [project]
      - Poetry: [tool.poetry]
      - Flit: [tool.flit.metadata]
    """
    result: Dict[str, Any] = {}

    # PEP 621
    project = data.get("project")
    if isinstance(project, dict):
        result.update(project)

    # Poetry
    tool = data.get("tool") or {}
    poetry = None
    if isinstance(tool, dict):
        poetry = tool.get("poetry")
    if isinstance(poetry, dict):
        # poetry uses 'name', 'version', 'description', 'dependencies'
        # dependencies may be a table/dict
        for key in ("name", "version", "description", "dependencies"):
            if key in poetry:
                result.setdefault(key, poetry[key])

    # Flit
    flit = None
    if isinstance(tool, dict):
        flit = tool.get("flit")
    if isinstance(flit, dict):
        metadata = flit.get("metadata")
        if isinstance(metadata, dict):
            for key in ("name", "version", "description"):
                if key in metadata:
                    result.setdefault(key, metadata[key])
            # flit may list requires as 'requires'
            if "requires" in metadata and "dependencies" not in result:
                result["dependencies"] = metadata["requires"]

    return result


def read_setup_cfg(path: str) -> Dict[str, Any]:
    config = configparser.ConfigParser()
    try:
        config.read(path, encoding="utf-8")
    except Exception as exc:
        print(f"ERROR: Failed to parse {path}: {exc}")
        sys.exit(2)

    result: Dict[str, Any] = {}
    if config.has_section("metadata"):
        for key in ("name", "version", "description"):
            if config.has_option("metadata", key):
                result[key] = config.get("metadata", key)

    # dependencies are commonly stored under [options] install_requires
    if config.has_section("options"):
        if config.has_option("options", "install_requires"):
            val = config.get("options", "install_requires")
            # install_requires in setup.cfg may be multiline
            deps = [line.strip() for line in val.splitlines() if line.strip()]
            result.setdefault("dependencies", deps)

    return result


def present(field_val: Any) -> bool:
    if field_val is None:
        return False
    if isinstance(field_val, str):
        return bool(field_val.strip())
    if isinstance(field_val, (list, dict, tuple, set)):
        return len(field_val) > 0
    return True


def check_metadata(metadata: Dict[str, Any]) -> Tuple[bool, List[str]]:
    missing: List[str] = []
    for field in REQUIRED_FIELDS:
        if field not in metadata or not present(metadata[field]):
            missing.append(field)
    return (len(missing) == 0, missing)


def pretty_print_metadata(metadata: Dict[str, Any]) -> None:
    # Only print a small summary, not full dependencies content
    summary = {}
    for k in ("name", "version", "description"):
        if k in metadata:
            summary[k] = metadata[k]
    if "dependencies" in metadata:
        deps = metadata["dependencies"]
        try:
            length = len(deps)
        except Exception:
            length = "?"
        summary["dependencies_count"] = length
    print("Detected metadata summary:")
    print(json.dumps(summary, indent=2, ensure_ascii=False))


def main() -> None:
    cwd = os.getcwd()
    pyproject_path = os.path.join(cwd, "pyproject.toml")
    setup_cfg_path = os.path.join(cwd, "setup.cfg")

    found_any = False
    overall_missing: List[str] = []
    parsed_metadata: Dict[str, Any] = {}

    if os.path.isfile(pyproject_path):
        print(f"Found pyproject.toml at: {pyproject_path}")
        found_any = True
        data = read_pyproject(pyproject_path)
        metadata = extract_from_pyproject(data)
        if metadata:
            parsed_metadata.update(metadata)
        else:
            print("WARNING: pyproject.toml found but no recognized packaging metadata was extracted.")

    if os.path.isfile(setup_cfg_path):
        print(f"Found setup.cfg at: {setup_cfg_path}")
        found_any = True
        metadata = read_setup_cfg(setup_cfg_path)
        if metadata:
            # setup.cfg should not override pyproject values; fill missing
            for k, v in metadata.items():
                parsed_metadata.setdefault(k, v)
        else:
            print("WARNING: setup.cfg found but no packaging metadata was extracted.")

    if not found_any:
        print("ERROR: No pyproject.toml or setup.cfg found in repository root.")
        print("Please add one of these files with project metadata (name, version, description, dependencies).")
        sys.exit(1)

    pretty_print_metadata(parsed_metadata)
    ok, missing = check_metadata(parsed_metadata)
    if ok:
        print("OK: Required packaging metadata present: {}".format(", ".join(REQUIRED_FIELDS)))
        sys.exit(0)
    else:
        print("ERROR: Missing required packaging metadata fields:")
        for f in missing:
            print(f"  - {f}")

        # Helpful hints
        print("\nHints to fix:")
        print(" - For pyproject.toml (PEP 621): add a [project] table with 'name', 'version', 'description' and 'dependencies'.")
        print(" - For Poetry managed projects: ensure [tool.poetry] has the same fields; dependencies can be a table.")
        print(" - For setup.cfg: add under [metadata] -> name, version, description and under [options] -> install_requires for dependencies.")
        sys.exit(1)


if __name__ == "__main__":
    main()
