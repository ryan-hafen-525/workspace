# Testing

## Prerequisites

Install test dependencies:

```bash
pip install pytest pytest-asyncio
```

## Running Tests

From the `api/` directory:

```bash
# Run all tests with verbose output
python3 -m pytest tests/ -v

# Run a specific test file
python3 -m pytest tests/test_upload.py -v

# Run a specific test class
python3 -m pytest tests/test_upload.py::TestUploadSuccess -v

# Run a specific test
python3 -m pytest tests/test_upload.py::TestUploadSuccess::test_upload_valid_png -v
```

## Test Structure

```
api/
├── tests/
│   ├── conftest.py      # Shared fixtures
│   └── test_upload.py   # Upload endpoint tests
```

## Test Categories

| Category | Description |
|----------|-------------|
| `TestUploadSuccess` | Valid file uploads (PNG, JPEG, PDF) |
| `TestUploadValidation` | File type validation errors |
| `TestUploadSizeValidation` | File size limit enforcement |
| `TestUploadEdgeCases` | Edge cases (empty files, unique IDs) |
