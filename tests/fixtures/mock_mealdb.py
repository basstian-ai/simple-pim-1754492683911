import json
from requests.models import Response

# Minimal deterministic sample response taken from TheMealDB-style schema.
# Tests should rely on this data so they can run offline and deterministically.
SAMPLE_MEAL_JSON = {
    "meals": [
        {
            "idMeal": "52771",
            "strMeal": "Spicy Arrabiata Penne",
            "strCategory": "Vegetarian",
            "strArea": "Italian",
            "strInstructions": "Bring a large pot of water to a boil. Add salt and penne. Cook until al dente. In a pan, heat oil, add garlic, chili, tomatoes. Simmer. Toss with pasta.",
            "strMealThumb": "https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg",
            "strTags": "Pasta,Curry",
            "strYoutube": "https://www.youtube.com/watch?v=1IszT_guI08",
            "strIngredient1": "penne rigate",
            "strIngredient2": "olive oil",
            "strIngredient3": "garlic",
            "strMeasure1": "1 pound",
            "strMeasure2": "2 tbsp",
            "strMeasure3": "2 cloves"
        }
    ]
}


def build_response(url: str, data: dict) -> Response:
    """Build a requests.Response object with JSON content.

    This keeps tests independent of external packages (responses/requests-mock)
    and avoids network access by returning a real Response object that
    requests.get-compatible call sites can use.
    """
    r = Response()
    r.status_code = 200
    r._content = json.dumps(data).encode("utf-8")
    r.headers["Content-Type"] = "application/json"
    r.url = url
    return r
