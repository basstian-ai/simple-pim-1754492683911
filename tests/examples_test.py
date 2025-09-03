import examples.usage as usage


def test_search_and_lookup():
    # Perform a real API call to TheMealDB. CI must allow outbound network access.
    results = usage.search_meals("chicken")
    assert isinstance(results, list)
    assert len(results) > 0, "Expected at least one meal for 'chicken'"

    sample = results[0]
    # Basic shape checks
    assert "idMeal" in sample
    assert "strMeal" in sample
    assert "strInstructions" in sample

    # Lookup by id and verify the id matches
    meal_id = sample["idMeal"]
    details = usage.get_meal_by_id(meal_id)
    assert details is not None
    assert details.get("idMeal") == meal_id
