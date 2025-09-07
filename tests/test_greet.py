import hello


def test_greet_default():
    assert hello.greet() == "Hello, World!"


def test_greet_with_name():
    assert hello.greet("Alice") == "Hello, Alice!"
