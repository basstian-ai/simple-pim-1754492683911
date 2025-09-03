"""Minimal example module for the project CI/dev workflow.

This tiny module is intentionally small so it's easy to run and validate
that the repository's test tooling is working.
"""

from typing import Optional


def greet(name: Optional[str] = "world") -> str:
    """Return a friendly greeting.

    Examples:
    >>> greet("Alice")
    'Hello, Alice!'
    >>> greet()
    'Hello, world!'
    """
    return f"Hello, {name}!"
