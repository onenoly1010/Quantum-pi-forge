"""
Health Endpoint Tests
Tests for the /health and /api/health endpoints across all services.
"""

import pytest
import os


class TestHealthEndpoints:
    """Test health endpoints for all services"""
    
    def test_fastapi_health_endpoint_exists(self):
        """Test that FastAPI health endpoint function exists"""
        try:
            from main import health_endpoint
            assert callable(health_endpoint), "health_endpoint should be callable"
        except ImportError:
            pytest.skip("FastAPI main module not available")
    
    def test_fastapi_root_endpoint_exists(self):
        """Test that FastAPI root endpoint function exists"""
        try:
            from main import health_check
            assert callable(health_check), "health_check should be callable"
        except ImportError:
            pytest.skip("FastAPI main module not available")
    
    def test_flask_health_endpoint_exists(self):
        """Test that Flask health endpoint exists"""
        try:
            from app import health
            assert callable(health), "Flask health function should be callable"
        except ImportError:
            pytest.skip("Flask app module not available")
    
    def test_fastapi_app_loads(self):
        """Test that FastAPI app can be imported"""
        try:
            from main import app
            assert app is not None, "FastAPI app should not be None"
            assert hasattr(app, 'routes'), "FastAPI app should have routes"
        except ImportError as e:
            pytest.skip(f"FastAPI main module not available: {e}")
    
    def test_flask_app_loads(self):
        """Test that Flask app can be imported"""
        try:
            from app import app
            assert app is not None, "Flask app should not be None"
        except ImportError as e:
            pytest.skip(f"Flask app module not available: {e}")


class TestHealthEndpointResponses:
    """Test health endpoint response formats"""
    
    def test_fastapi_health_returns_dict(self):
        """Test that FastAPI health endpoint returns expected format"""
        try:
            import asyncio
            from main import health_endpoint
            
            # Run async function
            result = asyncio.run(health_endpoint())
            
            assert isinstance(result, dict), "Health endpoint should return dict"
            assert 'status' in result, "Response should contain 'status'"
            assert result['status'] == 'healthy', "Status should be 'healthy'"
        except ImportError:
            pytest.skip("FastAPI main module not available")
    
    def test_flask_health_response_format(self):
        """Test that Flask health endpoint returns expected format"""
        try:
            from app import app
            
            with app.test_client() as client:
                response = client.get('/health')
                
                assert response.status_code == 200, "Health check should return 200"
                
                data = response.get_json()
                assert data is not None, "Response should be JSON"
                assert 'status' in data, "Response should contain 'status'"
                assert data['status'] == 'healthy', "Status should be 'healthy'"
        except ImportError:
            pytest.skip("Flask app module not available")


class TestCriticalFiles:
    """Test that critical files exist"""
    
    @pytest.fixture
    def repo_root(self):
        """Get repository root directory"""
        return os.path.dirname(os.path.dirname(__file__))
    
    def test_main_py_exists(self, repo_root):
        """Test that server/main.py exists"""
        path = os.path.join(repo_root, 'server', 'main.py')
        assert os.path.exists(path), f"Critical file missing: {path}"
    
    def test_app_py_exists(self, repo_root):
        """Test that server/app.py exists"""
        path = os.path.join(repo_root, 'server', 'app.py')
        assert os.path.exists(path), f"Critical file missing: {path}"
    
    def test_requirements_exists(self, repo_root):
        """Test that server/requirements.txt exists"""
        path = os.path.join(repo_root, 'server', 'requirements.txt')
        assert os.path.exists(path), f"Critical file missing: {path}"
    
    def test_index_html_exists(self, repo_root):
        """Test that index.html exists"""
        path = os.path.join(repo_root, 'index.html')
        assert os.path.exists(path), f"Critical file missing: {path}"


class TestFileSizes:
    """Test that source files are within size limits"""
    
    MAX_SIZE_BYTES = 1024 * 1024  # 1 MB
    
    @pytest.fixture
    def repo_root(self):
        """Get repository root directory"""
        return os.path.dirname(os.path.dirname(__file__))
    
    def test_python_files_under_limit(self, repo_root):
        """Test that Python files are under 1 MB"""
        server_dir = os.path.join(repo_root, 'server')
        oversized = []
        
        for root, dirs, files in os.walk(server_dir):
            # Skip virtual environments
            dirs[:] = [d for d in dirs if d not in ['.venv', 'venv', '__pycache__']]
            
            for file in files:
                if file.endswith('.py'):
                    filepath = os.path.join(root, file)
                    size = os.path.getsize(filepath)
                    if size > self.MAX_SIZE_BYTES:
                        oversized.append((filepath, size))
        
        assert len(oversized) == 0, f"Oversized Python files: {oversized}"
    
    def test_html_files_under_limit(self, repo_root):
        """Test that HTML files are under 1 MB"""
        oversized = []
        
        for file in ['index.html']:
            filepath = os.path.join(repo_root, file)
            if os.path.exists(filepath):
                size = os.path.getsize(filepath)
                if size > self.MAX_SIZE_BYTES:
                    oversized.append((filepath, size))
        
        assert len(oversized) == 0, f"Oversized HTML files: {oversized}"


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
