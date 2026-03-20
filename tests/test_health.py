from fastapi.testclient import TestClient
import pytest

# Import the FastAPI app from server.main
try:
    from server.main import app
except Exception:
    # Fallback: try top-level import
    from main import app

client = TestClient(app)

def test_health_endpoint_returns_200_and_keys():
    response = client.get('/health')
    assert response.status_code == 200
    data = response.json()
    assert 'status' in data
    assert 'supabase_connected' in data
    assert 'timestamp' in data


@pytest.mark.parametrize('path', ['/','/api/metrics'])
def test_additional_endpoints(path):
    resp = client.get(path)
    assert resp.status_code == 200
