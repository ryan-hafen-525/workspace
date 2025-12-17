"""Tests for the receipt upload endpoint."""

import io
import uuid


class TestUploadSuccess:
    """Tests for successful file uploads."""

    def test_upload_valid_png(self, client, sample_png):
        """Test uploading a valid PNG file returns 200."""
        filename, file_obj, content_type = sample_png
        response = client.post(
            "/receipts/upload",
            files={"file": (filename, file_obj, content_type)}
        )
        assert response.status_code == 200
        data = response.json()
        assert "receipt_id" in data
        assert data["status"] == "pending"

    def test_upload_valid_jpeg(self, client, sample_jpeg):
        """Test uploading a valid JPEG file returns 200."""
        filename, file_obj, content_type = sample_jpeg
        response = client.post(
            "/receipts/upload",
            files={"file": (filename, file_obj, content_type)}
        )
        assert response.status_code == 200
        data = response.json()
        assert "receipt_id" in data
        assert data["status"] == "pending"

    def test_upload_valid_pdf(self, client, sample_pdf):
        """Test uploading a valid PDF file returns 200."""
        filename, file_obj, content_type = sample_pdf
        response = client.post(
            "/receipts/upload",
            files={"file": (filename, file_obj, content_type)}
        )
        assert response.status_code == 200
        data = response.json()
        assert "receipt_id" in data
        assert data["status"] == "pending"

    def test_upload_response_format(self, client, sample_png):
        """Test response matches expected UploadResponse model."""
        filename, file_obj, content_type = sample_png
        response = client.post(
            "/receipts/upload",
            files={"file": (filename, file_obj, content_type)}
        )
        assert response.status_code == 200
        data = response.json()

        # Verify all required fields are present
        assert "receipt_id" in data
        assert "status" in data
        assert "message" in data

        # Verify receipt_id is a valid UUID
        uuid.UUID(data["receipt_id"])

        # Verify status is "pending"
        assert data["status"] == "pending"

        # Verify message is present and non-empty
        assert len(data["message"]) > 0


class TestUploadValidation:
    """Tests for file type validation errors."""

    def test_upload_invalid_file_type_text(self, client, sample_text_file):
        """Test uploading a text file returns 400."""
        filename, file_obj, content_type = sample_text_file
        response = client.post(
            "/receipts/upload",
            files={"file": (filename, file_obj, content_type)}
        )
        assert response.status_code == 400
        assert "not supported" in response.json()["detail"]

    def test_upload_unsupported_mime_type_gif(self, client):
        """Test uploading a GIF file returns 400."""
        gif_bytes = b"GIF89a\x01\x00\x01\x00\x00\x00\x00;"
        response = client.post(
            "/receipts/upload",
            files={"file": ("test.gif", io.BytesIO(gif_bytes), "image/gif")}
        )
        assert response.status_code == 400
        assert "not supported" in response.json()["detail"]

    def test_upload_missing_file(self, client):
        """Test uploading without a file returns 422."""
        response = client.post("/receipts/upload")
        assert response.status_code == 422


class TestUploadSizeValidation:
    """Tests for file size validation."""

    def test_upload_file_too_large(self, client, large_file):
        """Test uploading a file larger than 10MB returns 413."""
        filename, file_obj, content_type = large_file
        response = client.post(
            "/receipts/upload",
            files={"file": (filename, file_obj, content_type)}
        )
        assert response.status_code == 413
        assert "10MB" in response.json()["detail"]

    def test_upload_file_at_size_limit(self, client):
        """Test uploading a file exactly at 10MB succeeds."""
        size = 10 * 1024 * 1024  # Exactly 10MB
        content = b"x" * size
        response = client.post(
            "/receipts/upload",
            files={"file": ("test.png", io.BytesIO(content), "image/png")}
        )
        assert response.status_code == 200


class TestUploadEdgeCases:
    """Tests for edge cases."""

    def test_upload_empty_file(self, client):
        """Test uploading an empty file."""
        response = client.post(
            "/receipts/upload",
            files={"file": ("empty.png", io.BytesIO(b""), "image/png")}
        )
        # Empty file should still be accepted (validation happens later)
        assert response.status_code == 200

    def test_upload_generates_unique_ids(self, client, sample_png):
        """Test that each upload generates a unique receipt ID."""
        filename, file_obj, content_type = sample_png

        # First upload
        response1 = client.post(
            "/receipts/upload",
            files={"file": (filename, io.BytesIO(file_obj.read()), content_type)}
        )
        file_obj.seek(0)

        # Second upload
        response2 = client.post(
            "/receipts/upload",
            files={"file": (filename, io.BytesIO(file_obj.read()), content_type)}
        )

        assert response1.status_code == 200
        assert response2.status_code == 200
        assert response1.json()["receipt_id"] != response2.json()["receipt_id"]
