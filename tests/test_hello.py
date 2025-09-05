import hello


def test_greet_with_name():
    assert hello.greet("Alice") == "Hello, Alice!"


def test_greet_default():
    # The default greeting should capitalize the world name.
    assert hello.greet() == "Hello, World!"
