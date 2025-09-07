import requests


def test_example_search_uses_mock(mock_mealdb):
    """Simple smoke test that demonstrates the deterministic mock is used.

    It calls TheMealDB search endpoint but receives the sample fixture payload
    instead of making a network request.
    """
    url = "https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata"
    resp = requests.get(url)
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, dict)
    assert "meals" in data
    assert data["meals"][0]["strMeal"] == "Spicy Arrabiata Penne"
