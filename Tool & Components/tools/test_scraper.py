#!/usr/bin/env python3
"""
Basic tests for the Enhanced Site Scraper
Run with: pytest test_scraper.py -v
"""

import pytest
import asyncio
from pathlib import Path
from unittest.mock import Mock, AsyncMock, patch

# Import scraper components
from scraper_enhanced import (
    ScraperConfig, URLUtils, FileUtils, UICollector,
    ScreenshotProcessor, HTMLProcessor, AssetProcessor
)


class TestScraperConfig:
    """Test configuration management."""
    
    def test_default_config(self):
        """Test default configuration values."""
        config = ScraperConfig()
        assert config.max_pages == 200
        assert config.max_depth == 3
        assert config.concurrency_pages == 4
        assert config.headless is True
    
    def test_custom_config(self):
        """Test custom configuration values."""
        config = ScraperConfig(
            max_pages=100,
            max_depth=2,
            headless=False
        )
        assert config.max_pages == 100
        assert config.max_depth == 2
        assert config.headless is False
    
    def test_config_from_file(self, tmp_path):
        """Test loading configuration from YAML file."""
        config_file = tmp_path / "test_config.yaml"
        config_file.write_text("""
max_pages: 50
max_depth: 1
headless: false
        """)
        
        config = ScraperConfig.from_file(str(config_file))
        assert config.max_pages == 50
        assert config.max_depth == 1
        assert config.headless is False
    
    def test_save_config(self, tmp_path):
        """Test saving configuration to file."""
        config = ScraperConfig(max_pages=75, max_depth=4)
        config_path = tmp_path / "saved_config.yaml"
        
        config.save_to_file(str(config_path))
        assert config_path.exists()
        
        # Verify content
        content = config_path.read_text()
        assert "max_pages: 75" in content
        assert "max_depth: 4" in content


class TestURLUtils:
    """Test URL utility functions."""
    
    def test_sanitize_path(self):
        """Test path sanitization."""
        assert URLUtils.sanitize_path("/") == "/index.html"
        assert URLUtils.sanitize_path("/about") == "/about"
        assert URLUtils.sanitize_path("/blog/") == "/blog/index.html"
    
    def test_normalize_link(self):
        """Test link normalization."""
        base_url = "https://example.com/page"
        
        # Valid links
        assert URLUtils.normalize_link(base_url, "/about") == "https://example.com/about"
        assert URLUtils.normalize_link(base_url, "https://example.com/contact") == "https://example.com/contact"
        
        # Invalid links
        assert URLUtils.normalize_link(base_url, "mailto:test@example.com") is None
        assert URLUtils.normalize_link(base_url, "tel:+1234567890") is None
        assert URLUtils.normalize_link(base_url, "javascript:void(0)") is None
        assert URLUtils.normalize_link(base_url, "#section") is None
    
    def test_is_same_origin(self):
        """Test origin checking."""
        assert URLUtils.is_same_origin("https://example.com", "https://example.com/about") is True
        assert URLUtils.is_same_origin("https://example.com", "http://example.com") is False
        assert URLUtils.is_same_origin("https://example.com", "https://other.com") is False
    
    def test_matches_blocklist(self):
        """Test blocklist pattern matching."""
        patterns = [r"google\.com", r"facebook\.com"]
        
        assert URLUtils.matches_blocklist("https://google.com/analytics", patterns) is True
        assert URLUtils.matches_blocklist("https://facebook.com/tracking", patterns) is True
        assert URLUtils.matches_blocklist("https://example.com", patterns) is False
    
    def test_is_asset_url(self):
        """Test asset URL detection."""
        assert URLUtils.is_asset_url("https://example.com/image.png") is True
        assert URLUtils.is_asset_url("https://example.com/style.css") is True
        assert URLUtils.is_asset_url("https://example.com/script.js") is True
        assert URLUtils.is_asset_url("https://example.com/font.woff2") is True
        assert URLUtils.is_asset_url("https://example.com/page") is False


class TestFileUtils:
    """Test file utility functions."""
    
    def test_get_output_path(self, tmp_path):
        """Test output path generation."""
        url = "https://example.com/about"
        content_type = "text/html"
        
        path = FileUtils.get_output_path(tmp_path, url, content_type)
        assert "example_com" in str(path)
        assert path.name == "about.html"
        assert path.parent.exists()
    
    def test_ensure_directory(self, tmp_path):
        """Test directory creation."""
        new_dir = tmp_path / "new" / "nested" / "directory"
        FileUtils.ensure_directory(new_dir)
        assert new_dir.exists()
        assert new_dir.is_dir()
    
    def test_safe_filename(self):
        """Test filename sanitization."""
        assert FileUtils.safe_filename("file<>:\"/\\|?*.txt") == "file_______.txt"
        assert FileUtils.safe_filename("normal-file.txt") == "normal-file.txt"


class TestUICollector:
    """Test UI data collection."""
    
    def test_initial_inventory(self):
        """Test initial inventory structure."""
        collector = UICollector()
        
        assert "fonts" in collector.inventory
        assert "colors" in collector.inventory
        assert "pages" in collector.inventory
        assert "meta" in collector.inventory
    
    def test_update_inventory(self):
        """Test inventory updates."""
        collector = UICollector()
        
        page_data = {
            "url": "https://example.com",
            "ui_data": {
                "fonts": ["Arial", "Helvetica"],
                "colors": ["rgb(255, 0, 0)", "rgb(0, 255, 0)"],
                "links": [{"text": "About", "href": "/about"}],
                "buttons": [{"text": "Click me", "w": 100, "h": 40}]
            },
            "css_variables": {"--primary-color": "rgb(255, 0, 0)"},
            "page_meta": {"title": "Example Page"}
        }
        
        collector.update_inventory(page_data)
        
        assert "Arial" in collector.inventory["fonts"]
        assert "rgb(255, 0, 0)" in collector.inventory["colors"]
        assert len(collector.inventory["pages"]) == 1
        assert len(collector.inventory["buttons"]) == 1
    
    def test_finalize_inventory(self):
        """Test inventory finalization."""
        collector = UICollector()
        collector.inventory["fonts"].add("Arial")
        collector.inventory["colors"].add("rgb(255, 0, 0)")
        
        collector.finalize_inventory()
        
        assert isinstance(collector.inventory["fonts"], list)
        assert isinstance(collector.inventory["colors"], list)
        assert "scraping_end" in collector.inventory["meta"]


class TestPageProcessors:
    """Test page processing components."""
    
    def test_screenshot_processor_config(self):
        """Test screenshot processor configuration."""
        config = ScraperConfig(save_screenshots=False)
        processor = ScreenshotProcessor(config)
        
        # Should return True when screenshots are disabled
        assert processor.process_page(Mock(), "https://example.com", Path("/tmp")) is True
    
    def test_html_processor_config(self):
        """Test HTML processor configuration."""
        config = ScraperConfig(save_html=False)
        processor = HTMLProcessor(config)
        
        # Should return True when HTML saving is disabled
        assert processor.process_page(Mock(), "https://example.com", Path("/tmp")) is True


class TestAssetProcessor:
    """Test asset processing."""
    
    def test_asset_processor_initialization(self):
        """Test asset processor setup."""
        config = ScraperConfig()
        output_dir = Path("/tmp")
        
        processor = AssetProcessor(config, output_dir)
        assert processor.config == config
        assert processor.output_dir == output_dir
        assert isinstance(processor.saved_assets, set)


# Integration tests (require proper mocking)
@pytest.mark.asyncio
class TestAsyncComponents:
    """Test async components with proper mocking."""
    
    async def test_ui_collector_page_evaluation(self):
        """Test UI data collection from page (mocked)."""
        collector = UICollector()
        
        # Mock page with evaluate method
        mock_page = Mock()
        mock_page.evaluate = AsyncMock(return_value={
            "fonts": ["Arial"],
            "colors": ["rgb(255, 0, 0)"],
            "links": [],
            "buttons": [],
            "canvases": [],
            "controls": [],
            "components": []
        })
        
        # Mock CSS variables evaluation
        mock_page.evaluate.side_effect = [
            {"fonts": ["Arial"], "colors": ["rgb(255, 0, 0)"], "links": [], "buttons": [], "canvases": [], "controls": [], "components": []},
            {"--primary": "rgb(255, 0, 0)"},
            {"title": "Test Page", "description": "", "keywords": "", "viewport": "", "language": "en"}
        ]
        
        result = await collector.collect_from_page(mock_page, "https://example.com")
        
        assert "ui_data" in result
        assert "css_variables" in result
        assert "page_meta" in result
        assert result["url"] == "https://example.com"


# Utility test functions
def test_config_validation():
    """Test configuration validation."""
    config = ScraperConfig()
    
    # Test that all required fields are present
    required_fields = [
        'max_pages', 'max_depth', 'concurrency_pages',
        'navigation_timeout_ms', 'network_idle_ms', 'page_delay_ms',
        'save_content_types', 'block_host_patterns', 'headless',
        'user_agent', 'viewport_desktop', 'viewport_mobile',
        'save_screenshots', 'save_html', 'save_assets',
        'collect_ui_inventory', 'retry_failed_pages', 'max_retries',
        'respect_robots_txt', 'custom_headers'
    ]
    
    for field in required_fields:
        assert hasattr(config, field), f"Missing field: {field}"


def test_url_utils_edge_cases():
    """Test URL utilities with edge cases."""
    # Empty or None URLs
    assert URLUtils.normalize_link("https://example.com", "") is None
    assert URLUtils.normalize_link("https://example.com", None) is None
    
    # Malformed URLs
    assert URLUtils.normalize_link("https://example.com", "invalid://url") is None
    
    # Very long URLs
    long_url = "a" * 10000
    assert URLUtils.normalize_link("https://example.com", long_url) is not None


if __name__ == "__main__":
    # Run basic tests if executed directly
    pytest.main([__file__, "-v"])
