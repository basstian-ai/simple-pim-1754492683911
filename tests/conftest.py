import os
import sys
import requests
import pytest

# Ensure tests/fixtures is importable regardless of how pytest was invoked.
TESTS_DIR = os.path.abspath(os.path.dirname(__file__))
if TESTS_DIR not in sys.path:
    sys.path.insert(0, TESTS_DIR)

# Import the deterministic fixture data and helper
try:
    from fixtures.mock_mealdb import SAMPLE_MEAL_JSON, build_response
except Exception:  # pragma: no cover - fallback for surprising import environments
    # If import as package works instead
    from tests.fixtures.mock_mealdb import SAMPLE_MEAL_JSON, build_response


@pytest.fixture
def mock_mealdb(monkeypatch):
    """A pytest fixture that intercepts requests.get calls to TheMealDB and
    returns a deterministic, local JSON response.

    Usage:
      def test_foo(mock_mealdb):
          resp = requests.get("https://www.themealdb.com/api/...")
          assert resp.json() == SAMPLE_MEAL_JSON
    """
    original_get = requests.get

    def _fake_get(url, *args, **kwargs):
        # Only intercept calls targeting TheMealDB so other network calls still work
        if isinstance(url, str) and "themealdb.com" in url:
            return build_response(url, SAMPLE_MEAL_JSON)
        return original_get(url, *args, **kwargs)

    monkeypatch.setattr(requests, "get", _fake_get)
    yield
    # monkeypatch fixture automatically restores attributes after yield
