from app.core.security import hash_password, verify_password, create_access_token


def test_password_hashing_roundtrip():
    hashed = hash_password('SuperSecret123!')
    assert verify_password('SuperSecret123!', hashed)


def test_access_token_creation():
    token = create_access_token('1')
    assert isinstance(token, str)
    assert token.count('.') == 2
