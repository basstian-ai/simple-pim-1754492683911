def greet(name: str = "World") -> str:
    """Return a friendly greeting for name (defaults to "World").

    Kept intentionally tiny for CI/test workflow validation.
    """
    return f"Hello, {name}!"


if __name__ == "__main__":
    # Simple CLI entry for manual smoke testing
    print(greet())
