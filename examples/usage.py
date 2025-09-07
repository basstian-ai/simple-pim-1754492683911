"""
Minimal usage examples for TheMealDB public API.

This module uses only the Python standard library so it can be imported and run in CI without extra dependencies.

Functions provided:
- search_meals(query, max_results=20) -> list of meal dicts
- get_meal_by_id(meal_id) -> meal dict or None

The tests/examples_test.py imports and exercises these functions to provide a smoke test that the public API is reachable and that the helpers work.
"""

from typing import List, Optional, Dict, Any
import urllib.request
import urllib.parse
import json

BASE = "https://www.themealdb.com/api/json/v1/1"


class FetchError(RuntimeError):
    pass


def _fetch_json(endpoint: str, params: Optional[Dict[str, str]] = None, timeout: int = 10) -> Dict[str, Any]:
    """Helper to perform a GET request and decode JSON.

    Raises FetchError on network or decoding issues.
    """
    if params is None:
        params = {}
    query = urllib.parse.urlencode(params)
    url = f"{BASE}/{endpoint}?{query}" if query else f"{BASE}/{endpoint}"
    try:
        with urllib.request.urlopen(url, timeout=timeout) as res:
            raw = res.read()
            return json.loads(raw.decode("utf-8"))
    except Exception as exc:  # keep generic to surface network/timeouts in CI
        raise FetchError(f"Failed to fetch {url}: {exc}")


def search_meals(query: str, max_results: int = 20) -> List[Dict[str, Any]]:
    """Search meals by name.

    Returns a list of meal dictionaries (may be empty if nothing found).
    """
    if not isinstance(query, str) or not query.strip():
        raise ValueError("query must be a non-empty string")

    data = _fetch_json("search.php", {"s": query.strip()})
    meals = data.get("meals") or []
    # API returns a list of dicts; limit results for convenience
    return meals[:max_results]


def get_meal_by_id(meal_id: str) -> Optional[Dict[str, Any]]:
    """Fetch a single meal by its idMeal.

    meal_id can be a string or number convertible to string.
    Returns the meal dict or None if not found.
    """
    if meal_id is None:
        raise ValueError("meal_id is required")
    meal_id_str = str(meal_id).strip()
    if not meal_id_str:
        raise ValueError("meal_id must be a non-empty value")

    data = _fetch_json("lookup.php", {"i": meal_id_str})
    meals = data.get("meals")
    if not meals:
        return None
    return meals[0]


if __name__ == "__main__":
    # Quick smoke demonstration (prints first result for 'chicken')
    try:
        results = search_meals("chicken")
        print(f"Found {len(results)} meals for 'chicken' (showing first):")
        if results:
            sample = results[0]
            print(json.dumps(sample, indent=2)[:1000])
            meal_id = sample.get("idMeal")
            if meal_id:
                detail = get_meal_by_id(meal_id)
                print("\nDetail fetched for id:", meal_id)
                print(json.dumps(detail, indent=2)[:1000])
    except FetchError as e:
        print("Network or API error:", e)
