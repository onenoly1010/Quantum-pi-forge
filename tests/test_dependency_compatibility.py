"""
Test to verify that all required dependencies can be imported together
without version conflicts, specifically the FastAPI and Gradio compatibility issue.
"""
import pytest
from packaging import version


def test_fastapi_gradio_compatibility():
    """Test that FastAPI and Gradio can be imported together without conflicts."""
    try:
        import fastapi
        import gradio
        
        # Verify FastAPI version meets Gradio's requirements (>=0.115.2)
        fastapi_version = fastapi.__version__
        
        # Use packaging.version for robust version comparison
        current_version = version.parse(fastapi_version)
        min_required = version.parse("0.115.2")
        
        assert current_version >= min_required, \
            f"FastAPI version should be >=0.115.2, got {fastapi_version}"
        
        print(f"✅ FastAPI version {fastapi_version} is compatible with Gradio")
        print(f"✅ Gradio version {gradio.__version__} imported successfully")
        
    except ImportError as e:
        pytest.fail(f"Failed to import dependencies: {e}")


def test_all_main_dependencies():
    """Test that all main dependencies can be imported."""
    dependencies = [
        'fastapi',
        'uvicorn',
        'supabase',
        'websockets',
        'pydantic',
        'httpx',
        'flask',
        'flask_cors',
        'gradio',
        'dotenv',  # Import name for python-dotenv package
        'aiohttp',
        'schedule',
        'psutil',
        'pytest',
        'pandas',
        'numpy',
    ]
    
    failed_imports = []
    for dep in dependencies:
        try:
            __import__(dep)
        except ImportError as e:
            failed_imports.append((dep, str(e)))
    
    if failed_imports:
        error_msg = "Failed to import the following dependencies:\n"
        for dep, error in failed_imports:
            error_msg += f"  - {dep}: {error}\n"
        pytest.fail(error_msg)
    
    print(f"✅ All {len(dependencies)} main dependencies imported successfully")


def test_fastapi_version_range():
    """Test that FastAPI version is within the acceptable range."""
    import fastapi
    
    current_version = version.parse(fastapi.__version__)
    min_version = version.parse("0.115.2")
    max_version = version.parse("0.125.0")
    
    # Should be >= 0.115.2 and < 0.125
    assert current_version >= min_version, \
        f"FastAPI version should be >= 0.115.2, got {fastapi.__version__}"
    assert current_version < max_version, \
        f"FastAPI version should be < 0.125, got {fastapi.__version__}"
    
    print(f"✅ FastAPI version {fastapi.__version__} is within acceptable range (>=0.115.2, <0.125)")


def test_gradio_version_range():
    """Test that Gradio version is within the acceptable range."""
    import gradio
    
    current_version = version.parse(gradio.__version__)
    min_version = version.parse("5.24.0")
    max_version = version.parse("5.32.0")
    
    # Should be >= 5.24.0 and < 5.32
    assert current_version >= min_version, \
        f"Gradio version should be >= 5.24.0, got {gradio.__version__}"
    assert current_version < max_version, \
        f"Gradio version should be < 5.32, got {gradio.__version__}"
    
    print(f"✅ Gradio version {gradio.__version__} is within acceptable range (>=5.24.0, <5.32)")
