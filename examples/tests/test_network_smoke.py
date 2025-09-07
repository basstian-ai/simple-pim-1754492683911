import urllib.request
import json
import pytest

@pytest.mark.integration
def test_themealdb_search_smoke():
    """Smoke test that hits TheMealDB search endpoint.

    This test is marked as an integration test (network). pytest.ini is
    configured to skip integration tests by default so CI can opt-in when
    desired.
    """
    url = "https://www.themealdb.com/api/json/v1/1/search.php?s=chicken"
    with urllib.request.urlopen(url, timeout=10) as resp:
        # urllib returns an HTTPResponse with .status on Python 3.9+
        status = getattr(resp, "status", None)
        if status is None:
            # Fallback for older versions: try to infer success from the reason
            data = resp.read()
            assert data, "No response body received"
        else:
            assert status == 200
            data = json.load(resp)
        assert isinstance(data, dict)
        assert "meals" in data
