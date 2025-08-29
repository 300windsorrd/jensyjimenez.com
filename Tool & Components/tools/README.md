# Web Scraping Tools

This directory contains tools for web scraping, content analysis, and data extraction.

## Tools Overview

### Enhanced Web Scraper (`scraper_enhanced.py`)

A comprehensive web scraping tool with AI-powered analysis capabilities.

**Features:**
- Multi-page scraping with depth control
- AI-powered content analysis and categorization
- Screenshot capture and storage
- Content extraction (text, images, links)
- Data export in multiple formats
- Configurable scraping parameters

**Usage:**
```bash
python scraper_enhanced.py --url https://example.com --depth 2 --output ./scrape_output
```

**Options:**
- `--url`: Target website URL
- `--depth`: Scraping depth (default: 1)
- `--output`: Output directory
- `--config`: Configuration file path
- `--screenshots`: Enable screenshot capture
- `--ai-analysis`: Enable AI content analysis

### Test Suite (`test_scraper.py`)

Comprehensive testing suite for the scraper functionality.

**Features:**
- Unit tests for all scraper functions
- Integration tests for end-to-end workflows
- Performance benchmarking
- Error handling validation
- Output quality assessment

**Usage:**
```bash
python test_scraper.py
python test_scraper.py --verbose
python test_scraper.py --coverage
```

### Configuration (`config_example.yaml`)

Example configuration file for customizing scraper behavior.

**Configuration Options:**
- User agent strings
- Request delays and timeouts
- Content filters and selectors
- Output format preferences
- AI analysis parameters

## Installation

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **For enhanced features, install additional packages:**
   ```bash
   pip install -r requirements_enhanced.txt
   ```

## Dependencies

### Core Requirements (`requirements.txt`)
- `requests`: HTTP library
- `beautifulsoup4`: HTML parsing
- `selenium`: Browser automation

### Enhanced Requirements (`requirements_enhanced.txt`)
- `openai`: AI analysis capabilities
- `pillow`: Image processing
- `pandas`: Data manipulation
- `pyyaml`: Configuration parsing
- `tqdm`: Progress bars

## Output Structure

The scraper generates organized output:

```
scrape_output/
├── pages/              # Individual page data
│   ├── page_1.html
│   ├── page_1.json
│   └── ...
├── screenshots/         # Page screenshots
├── assets/             # Downloaded assets
├── analysis/           # AI analysis results
└── summary.json        # Scraping summary
```

## Best Practices

### Ethical Scraping
- Respect robots.txt files
- Implement reasonable delays between requests
- Don't overload target servers
- Follow website terms of service

### Performance Optimization
- Use appropriate request delays
- Implement connection pooling
- Cache results when possible
- Use async processing for large sites

### Data Quality
- Validate extracted content
- Handle missing or malformed data
- Implement retry logic for failed requests
- Log errors and warnings

## Troubleshooting

### Common Issues

1. **Rate Limiting**: Increase delays between requests
2. **Blocked Requests**: Rotate user agents and IPs
3. **JavaScript Content**: Use Selenium for dynamic content
4. **Large Sites**: Implement pagination and depth limits

### Debug Mode

Enable verbose logging:
```bash
python scraper_enhanced.py --url https://example.com --verbose
```

## Contributing

When improving the tools:

1. **Add Tests**: Include tests for new functionality
2. **Documentation**: Update this README and docstrings
3. **Error Handling**: Implement proper error handling
4. **Performance**: Optimize for speed and memory usage
5. **Compatibility**: Ensure cross-platform compatibility

## License

These tools are provided for educational and development purposes. Please respect the terms of service of any websites you scrape.
