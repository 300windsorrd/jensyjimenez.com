#!/usr/bin/env python3
"""
Enhanced Site Scraper - A modular, configurable web scraping tool for UI analysis
Built with Playwright for robust JavaScript rendering and comprehensive asset collection.
"""

import asyncio
import os
import re
import json
import pathlib
import hashlib
import mimetypes
import logging
import time
from dataclasses import dataclass, field
from typing import Dict, List, Set, Optional, Any, Callable
from urllib.parse import urlparse, urljoin, urldefrag
from playwright.async_api import async_playwright, Browser, BrowserContext, Page, Response
from abc import ABC, abstractmethod
import yaml
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============================================================================
# Configuration Classes
# ============================================================================

@dataclass
class ScraperConfig:
    """Configuration class for scraper behavior and limits."""
    
    # Core settings
    max_pages: int = 200
    max_depth: int = 3
    concurrency_pages: int = 4
    
    # Timeouts and delays
    navigation_timeout_ms: int = 30000
    network_idle_ms: int = 1500
    page_delay_ms: int = 100
    
    # Content filtering
    save_content_types: tuple = ("text/html", "text/css", "application/javascript", 
                                "application/x-javascript", "image/", "font/")
    block_host_patterns: List[str] = field(default_factory=lambda: [
        r"googletagmanager\.com", r"google-analytics\.com", r"hotjar\.com",
        r"facebook\.com", r"doubleclick\.net", r"googlesyndication\.com"
    ])
    
    # Browser settings
    headless: bool = True
    user_agent: str = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                       "(KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36")
    viewport_desktop: Dict[str, int] = field(default_factory=lambda: {"width": 1920, "height": 1080})
    viewport_mobile: Dict[str, int] = field(default_factory=lambda: {"width": 390, "height": 844})
    
    # Output settings
    save_screenshots: bool = True
    save_html: bool = True
    save_assets: bool = True
    collect_ui_inventory: bool = True
    
    # Advanced settings
    retry_failed_pages: bool = True
    max_retries: int = 3
    respect_robots_txt: bool = False
    custom_headers: Dict[str, str] = field(default_factory=dict)
    
    @classmethod
    def from_file(cls, config_path: str) -> 'ScraperConfig':
        """Load configuration from YAML file."""
        try:
            with open(config_path, 'r') as f:
                config_data = yaml.safe_load(f)
            return cls(**config_data)
        except Exception as e:
            logger.warning(f"Failed to load config from {config_path}: {e}")
            return cls()
    
    def save_to_file(self, config_path: str):
        """Save configuration to YAML file."""
        try:
            with open(config_path, 'w') as f:
                yaml.dump(self.__dict__, f, default_flow_style=False, indent=2)
            logger.info(f"Configuration saved to {config_path}")
        except Exception as e:
            logger.error(f"Failed to save config to {config_path}: {e}")

# ============================================================================
# Utility Functions
# ============================================================================

class URLUtils:
    """Utility class for URL manipulation and validation."""
    
    @staticmethod
    def sanitize_path(path: str) -> str:
        """Sanitize URL path for filesystem use."""
        u = urlparse(path)
        path = u.path
        if not path or path.endswith("/"):
            path = path + "index.html"
        return path
    
    @staticmethod
    def normalize_link(current_url: str, href: str) -> Optional[str]:
        """Normalize and validate a link URL."""
        if not href:
            return None
        
        href = href.strip()
        if href.startswith(("mailto:", "tel:", "javascript:", "#")):
            return None
        
        try:
            abs_url = urljoin(current_url, href)
            abs_url, _frag = urldefrag(abs_url)
            return abs_url
        except Exception:
            return None
    
    @staticmethod
    def is_same_origin(seed: str, candidate: str) -> bool:
        """Check if two URLs have the same origin."""
        a, b = urlparse(seed), urlparse(candidate)
        return (a.scheme, a.netloc) == (b.scheme, b.netloc)
    
    @staticmethod
    def matches_blocklist(url: str, patterns: List[str]) -> bool:
        """Check if URL matches any blocklist pattern."""
        return any(re.search(p, url) for p in patterns)
    
    @staticmethod
    def is_asset_url(url: str) -> bool:
        """Check if URL points to an asset file."""
        asset_extensions = r"\.(pdf|zip|png|jpe?g|webp|gif|svg|ico|mp4|mov|mp3|wav|woff2?|ttf|eot)$"
        return bool(re.search(asset_extensions, url, re.I))

class FileUtils:
    """Utility class for file operations."""
    
    @staticmethod
    def get_output_path(base_dir: pathlib.Path, url: str, content_type: str) -> pathlib.Path:
        """Generate output file path for a URL and content type."""
        u = urlparse(url)
        safe_host = u.netloc.replace(":", "_")
        path = URLUtils.sanitize_path(url)
        target = base_dir / safe_host / path.lstrip("/")
        
        if content_type.startswith("text/html") and not target.name.endswith(".html"):
            target = target.with_suffix(".html")
        
        target.parent.mkdir(parents=True, exist_ok=True)
        return target
    
    @staticmethod
    def ensure_directory(path: pathlib.Path):
        """Ensure directory exists, creating parents if necessary."""
        path.mkdir(parents=True, exist_ok=True)
    
    @staticmethod
    def safe_filename(filename: str) -> str:
        """Convert filename to filesystem-safe version."""
        return re.sub(r'[<>:"/\\|?*]', '_', filename)

# ============================================================================
# Data Collection Classes
# ============================================================================

class UICollector:
    """Collects UI inventory data from web pages."""
    
    def __init__(self):
        self.inventory = {
            "seed": "",
            "pages": [],
            "fonts": set(),
            "colors": set(),
            "buttons": [],
            "links": [],
            "css_variables": {},
            "canvases": [],
            "interactive_controls": [],
            "components": [],
            "meta": {
                "total_pages": 0,
                "total_assets": 0,
                "scraping_start": "",
                "scraping_end": ""
            }
        }
    
    async def collect_from_page(self, page: Page, url: str) -> Dict[str, Any]:
        """Collect UI data from a single page."""
        try:
            # Basic UI elements
            ui_data = await page.evaluate("""
            () => {
                const styles = getComputedStyle(document.documentElement);
                const gather = () => {
                    const fonts = new Set();
                    const colors = new Set();
                    const links = [];
                    const buttons = [];
                    const canvases = [];
                    const controls = [];
                    const components = [];
                    
                    const push = (s) => {
                        const f = s.fontFamily || s.font || "";
                        if (f) fonts.add(f);
                        
                        ["color", "backgroundColor", "borderTopColor", "borderColor"].forEach(k => {
                            const v = s[k];
                            if (v && v.startsWith("rgb")) colors.add(v);
                        });
                    };
                    
                    document.querySelectorAll("*").forEach(el => {
                        const s = getComputedStyle(el);
                        
                        if (el.tagName === "A") {
                            links.push({
                                text: el.textContent.trim(),
                                href: el.href,
                                classes: el.className
                            });
                        }
                        
                        if (el.tagName === "BUTTON" || el.getAttribute("role") === "button" || s.cursor === "pointer") {
                            const rect = el.getBoundingClientRect();
                            if (rect.width >= 60 && rect.height >= 28) {
                                buttons.push({
                                    text: el.textContent.trim(),
                                    w: rect.width,
                                    h: rect.height,
                                    classes: el.className
                                });
                            }
                        }
                        
                        if (el.tagName === "CANVAS") {
                            const rect = el.getBoundingClientRect();
                            canvases.push({
                                w: Math.round(rect.width),
                                h: Math.round(rect.height)
                            });
                        }
                        
                        if (el.matches('input, select, textarea') || el.getAttribute('role') === 'slider') {
                            const type = el.getAttribute('type') || el.tagName.toLowerCase();
                            const rect = el.getBoundingClientRect();
                            controls.push({
                                type,
                                w: Math.round(rect.width),
                                h: Math.round(rect.height),
                                classes: el.className
                            });
                        }
                        
                        push(s);
                    });
                    
                    return {
                        fonts: Array.from(fonts).slice(0, 200),
                        colors: Array.from(colors).slice(0, 200),
                        links: links.slice(0, 200),
                        buttons: buttons.slice(0, 100),
                        canvases,
                        controls,
                        components
                    };
                };
                return gather();
            }
            """)
            
            # CSS Variables
            css_vars = await page.evaluate("""
            () => {
                const vars = {};
                const collectVars = (style) => {
                    if (!style) return;
                    for (let i = 0; i < style.length; i++) {
                        const prop = style[i];
                        if (prop.startsWith('--')) {
                            vars[prop] = style.getPropertyValue(prop).trim();
                        }
                    }
                };
                
                collectVars(document.documentElement.style);
                for (const sheet of Array.from(document.styleSheets)) {
                    try {
                        const rules = sheet.cssRules || [];
                        for (const rule of Array.from(rules)) {
                            if (rule.style) collectVars(rule.style);
                        }
                    } catch (e) {}
                }
                return vars;
            }
            """)
            
            # Page metadata
            page_meta = await page.evaluate("""
            () => ({
                title: document.title,
                description: document.querySelector('meta[name="description"]')?.content || '',
                keywords: document.querySelector('meta[name="keywords"]')?.content || '',
                viewport: document.querySelector('meta[name="viewport"]')?.content || '',
                language: document.documentElement.lang || 'en'
            })
            """)
            
            return {
                "ui_data": ui_data,
                "css_variables": css_vars or {},
                "page_meta": page_meta,
                "url": url
            }
            
        except Exception as e:
            logger.error(f"Failed to collect UI data from {url}: {e}")
            return {}
    
    def update_inventory(self, page_data: Dict[str, Any]):
        """Update the main inventory with page data."""
        if not page_data:
            return
        
        ui_data = page_data.get("ui_data", {})
        
        # Update fonts and colors
        for font in ui_data.get("fonts", []):
            self.inventory["fonts"].add(font)
        for color in ui_data.get("colors", []):
            self.inventory["colors"].add(color)
        
        # Update other collections
        self.inventory["pages"].append({
            "url": page_data["url"],
            "meta": page_data.get("page_meta", {}),
            "links": ui_data.get("links", [])[:200]
        })
        
        self.inventory["buttons"].extend(ui_data.get("buttons", [])[:100])
        self.inventory["canvases"].extend(ui_data.get("canvases", []))
        self.inventory["interactive_controls"].extend(ui_data.get("controls", []))
        self.inventory["components"].extend(ui_data.get("components", []))
        
        # Update CSS variables
        for k, v in page_data.get("css_variables", {}).items():
            if isinstance(v, str) and v:
                self.inventory["css_variables"][k] = v
    
    def finalize_inventory(self):
        """Prepare inventory for saving (convert sets to lists, etc.)."""
        self.inventory["fonts"] = sorted(list(self.inventory["fonts"]))
        self.inventory["colors"] = sorted(list(self.inventory["colors"]))
        self.inventory["meta"]["scraping_end"] = time.strftime("%Y-%m-%d %H:%M:%S")
    
    def save_inventory(self, output_dir: pathlib.Path):
        """Save inventory to JSON file."""
        try:
            inv_path = output_dir / "ui_inventory.json"
            inv_path.parent.mkdir(parents=True, exist_ok=True)
            with open(inv_path, 'w', encoding='utf-8') as f:
                json.dump(self.inventory, f, indent=2, ensure_ascii=False)
            logger.info(f"UI inventory saved to {inv_path}")
        except Exception as e:
            logger.error(f"Failed to save UI inventory: {e}")

# ============================================================================
# Core Scraper Classes
# ============================================================================

class PageProcessor(ABC):
    """Abstract base class for page processing strategies."""
    
    @abstractmethod
    async def process_page(self, page: Page, url: str, output_dir: pathlib.Path) -> bool:
        """Process a single page. Return True if successful."""
        pass

class ScreenshotProcessor(PageProcessor):
    """Handles screenshot generation for pages."""
    
    def __init__(self, config: ScraperConfig):
        self.config = config
    
    async def process_page(self, page: Page, url: str, output_dir: pathlib.Path) -> bool:
        """Generate screenshots for desktop and mobile views."""
        if not self.config.save_screenshots:
            return True
        
        try:
            ss_dir = output_dir / "_screenshots"
            ss_dir.mkdir(parents=True, exist_ok=True)
            
            # Generate filename from URL hash
            fname = hashlib.sha1(url.encode()).hexdigest()[:12]
            
            # Desktop screenshot
            await page.screenshot(
                path=str(ss_dir / f"{fname}_desktop.png"),
                full_page=True
            )
            
            # Mobile screenshot (create new page with mobile viewport)
            mobile_page = page.context.new_page()
            await mobile_page.set_viewport_size(self.config.viewport_mobile)
            
            try:
                await mobile_page.goto(url, wait_until="networkidle", 
                                     timeout=self.config.navigation_timeout_ms)
                await mobile_page.screenshot(
                    path=str(ss_dir / f"{fname}_mobile.png"),
                    full_page=True
                )
            finally:
                await mobile_page.close()
            
            logger.debug(f"Screenshots saved for {url}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to generate screenshots for {url}: {e}")
            return False

class HTMLProcessor(PageProcessor):
    """Handles HTML content saving."""
    
    def __init__(self, config: ScraperConfig):
        self.config = config
    
    async def process_page(self, page: Page, url: str, output_dir: pathlib.Path) -> bool:
        """Save rendered HTML content."""
        if not self.config.save_html:
            return True
        
        try:
            rendered_html = await page.content()
            html_path = FileUtils.get_output_path(output_dir, url, "text/html")
            html_path.write_text(rendered_html, encoding="utf-8")
            logger.debug(f"HTML saved for {url}")
            return True
        except Exception as e:
            logger.error(f"Failed to save HTML for {url}: {e}")
            return False

class AssetProcessor:
    """Handles asset collection and saving."""
    
    def __init__(self, config: ScraperConfig, output_dir: pathlib.Path):
        self.config = config
        self.output_dir = output_dir
        self.saved_assets: Set[str] = set()
    
    async def handle_response(self, response: Response):
        """Process and save asset responses."""
        if not self.config.save_assets:
            return
        
        try:
            url = response.url
            if URLUtils.matches_blocklist(url, self.config.block_host_patterns):
                return
            
            content_type = response.headers.get("content-type", "")
            if not content_type:
                return
            
            if not any(content_type.startswith(t) for t in self.config.save_content_types):
                return
            
            if url in self.saved_assets:
                return
            
            body = await response.body()
            if not body:
                return
            
            path = FileUtils.get_output_path(self.output_dir, url, content_type)
            
            # Guess extension if missing
            if not path.suffix:
                ext = mimetypes.guess_extension(content_type.split(";")[0].strip()) or ".bin"
                path = path.with_suffix(ext)
            
            with open(path, "wb") as f:
                f.write(body)
            
            self.saved_assets.add(url)
            logger.debug(f"Asset saved: {url}")
            
        except Exception as e:
            logger.error(f"Failed to save asset {response.url}: {e}")

class SiteScraper:
    """Main scraper class with enhanced modularity and error handling."""
    
    def __init__(self, start_url: str, output_dir: str, config: Optional[ScraperConfig] = None):
        self.start_url = start_url
        self.output_dir = pathlib.Path(output_dir)
        self.config = config or ScraperConfig()
        
        # Initialize components
        self.ui_collector = UICollector()
        self.asset_processor = AssetProcessor(self.config, self.output_dir)
        self.page_processors: List[PageProcessor] = [
            ScreenshotProcessor(self.config),
            HTMLProcessor(self.config)
        ]
        
        # State tracking
        self.to_visit = asyncio.Queue()
        self.seen_urls: Set[str] = set()
        self.failed_urls: Set[str] = set()
        self.page_count = 0
        self.start_time = time.time()
        
        # Set seed URL
        self.seed_origin = f"{urlparse(start_url).scheme}://{urlparse(start_url).netloc}"
        self.ui_collector.inventory["seed"] = start_url
        self.ui_collector.inventory["meta"]["scraping_start"] = time.strftime("%Y-%m-%d %H:%M:%S")
    
    async def run(self):
        """Main scraping execution method."""
        logger.info(f"Starting scrape of {self.start_url}")
        logger.info(f"Output directory: {self.output_dir}")
        logger.info(f"Configuration: {self.config.max_pages} pages, {self.config.max_depth} depth")
        
        try:
            async with async_playwright() as pw:
                browser = await pw.chromium.launch(headless=self.config.headless)
                context = await browser.new_context(
                    user_agent=self.config.user_agent,
                    ignore_https_errors=True,
                    extra_http_headers=self.config.custom_headers
                )
                
                # Set up response interception
                context.on("response", self.asset_processor.handle_response)
                
                # Start scraping
                await self.to_visit.put((self.start_url, 0))
                
                # Create worker tasks
                semaphore = asyncio.Semaphore(self.config.concurrency_pages)
                workers = [
                    asyncio.create_task(self._worker(context, semaphore))
                    for _ in range(self.config.concurrency_pages)
                ]
                
                # Wait for completion
                await self.to_visit.join()
                
                # Cancel workers
                for worker in workers:
                    worker.cancel()
                
                # Finalize and save results
                await self._finalize_scraping()
                
                await context.close()
                await browser.close()
                
        except Exception as e:
            logger.error(f"Scraping failed: {e}")
            raise
    
    async def _worker(self, context: BrowserContext, semaphore: asyncio.Semaphore):
        """Worker task for processing pages."""
        while True:
            try:
                url, depth = await self.to_visit.get()
            except asyncio.CancelledError:
                return
            
            try:
                async with semaphore:
                    if self.page_count >= self.config.max_pages:
                        return
                    await self._scrape_page(context, url, depth)
            finally:
                self.to_visit.task_done()
    
    async def _scrape_page(self, context: BrowserContext, url: str, depth: int):
        """Scrape a single page."""
        if url in self.seen_urls:
            return
        
        self.seen_urls.add(url)
        
        # Check origin and blocklist
        if self.config.respect_robots_txt and not self._check_robots_txt(url):
            return
        
        if URLUtils.matches_blocklist(url, self.config.block_host_patterns):
            return
        
        # Create page and navigate
        page = await context.new_page()
        await page.set_viewport_size(self.config.viewport_desktop)
        
        try:
            await page.goto(
                url,
                wait_until="networkidle",
                timeout=self.config.navigation_timeout_ms
            )
            
            # Add delay if specified
            if self.config.page_delay_ms > 0:
                await asyncio.sleep(self.config.page_delay_ms / 1000)
            
        except Exception as e:
            logger.warning(f"Failed to load {url}: {e}")
            await page.close()
            self.failed_urls.add(url)
            return
        
        self.page_count += 1
        logger.info(f"[{self.page_count}] Scraping {url}")
        
        try:
            # Process page with all processors
            for processor in self.page_processors:
                await processor.process_page(page, url, self.output_dir)
            
            # Collect UI inventory
            if self.config.collect_ui_inventory:
                page_data = await self.ui_collector.collect_from_page(page, url)
                self.ui_collector.update_inventory(page_data)
            
            # Discover new links
            await self._discover_links(page, url, depth)
            
        except Exception as e:
            logger.error(f"Error processing {url}: {e}")
            self.failed_urls.add(url)
        
        finally:
            await page.close()
    
    async def _discover_links(self, page: Page, current_url: str, current_depth: int):
        """Discover and enqueue new links from the page."""
        try:
            hrefs = await page.eval_on_selector_all(
                "a[href]",
                "els => els.map(a => a.getAttribute('href'))"
            )
            
            for href in hrefs:
                next_url = URLUtils.normalize_link(current_url, href)
                if not next_url:
                    continue
                
                # Check origin restrictions
                if not self.config.respect_robots_txt and not URLUtils.is_same_origin(self.start_url, next_url):
                    continue
                
                # Skip assets
                if URLUtils.is_asset_url(next_url):
                    continue
                
                # Check if we should visit this URL
                if (next_url not in self.seen_urls and 
                    next_url not in self.failed_urls and
                    current_depth + 1 <= self.config.max_depth):
                    await self.to_visit.put((next_url, current_depth + 1))
                    
        except Exception as e:
            logger.error(f"Failed to discover links on {current_url}: {e}")
    
    def _check_robots_txt(self, url: str) -> bool:
        """Check robots.txt for URL (placeholder implementation)."""
        # TODO: Implement robots.txt checking
        return True
    
    async def _finalize_scraping(self):
        """Finalize scraping and save results."""
        end_time = time.time()
        duration = end_time - self.start_time
        
        logger.info(f"Scraping completed in {duration:.2f} seconds")
        logger.info(f"Pages processed: {self.page_count}")
        logger.info(f"Failed URLs: {len(self.failed_urls)}")
        
        # Save UI inventory
        self.ui_collector.finalize_inventory()
        self.ui_collector.save_inventory(self.output_dir)
        
        # Save summary report
        self._save_summary_report(duration)
    
    def _save_summary_report(self, duration: float):
        """Save a summary report of the scraping session."""
        try:
            summary = {
                "scraping_session": {
                    "start_url": self.start_url,
                    "start_time": self.ui_collector.inventory["meta"]["scraping_start"],
                    "end_time": time.strftime("%Y-%m-%d %H:%M:%S"),
                    "duration_seconds": duration,
                    "total_pages": self.page_count,
                    "failed_urls": list(self.failed_urls),
                    "configuration": {
                        "max_pages": self.config.max_pages,
                        "max_depth": self.config.max_depth,
                        "concurrency": self.config.concurrency_pages
                    }
                }
            }
            
            summary_path = self.output_dir / "scraping_summary.json"
            with open(summary_path, 'w', encoding='utf-8') as f:
                json.dump(summary, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Summary report saved to {summary_path}")
            
        except Exception as e:
            logger.error(f"Failed to save summary report: {e}")

# ============================================================================
# CLI Interface
# ============================================================================

def create_parser():
    """Create command line argument parser."""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Enhanced Site Scraper - Modular web scraping tool for UI analysis",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s https://example.com
  %(prog)s https://example.com -o output_dir --max-pages 100
  %(prog)s https://example.com --config config.yaml
  %(prog)s https://example.com --save-config default_config.yaml
        """
    )
    
    parser.add_argument("url", help="Starting URL to scrape")
    parser.add_argument("-o", "--output", default="scrape_output", help="Output directory")
    parser.add_argument("--config", help="Configuration file (YAML)")
    parser.add_argument("--save-config", help="Save current config to file")
    
    # Core options
    parser.add_argument("--max-pages", type=int, help="Maximum pages to scrape")
    parser.add_argument("--max-depth", type=int, help="Maximum crawl depth")
    parser.add_argument("--concurrency", type=int, help="Number of concurrent page workers")
    
    # Behavior options
    parser.add_argument("--headless", action="store_true", help="Run browser in headless mode")
    parser.add_argument("--no-headless", dest="headless", action="store_false", help="Show browser window")
    parser.add_argument("--cross-origin", action="store_true", help="Allow crawling off-site links")
    parser.add_argument("--respect-robots", action="store_true", help="Respect robots.txt")
    
    # Output options
    parser.add_argument("--no-screenshots", dest="save_screenshots", action="store_false", help="Skip screenshots")
    parser.add_argument("--no-html", dest="save_html", action="store_false", help="Skip HTML saving")
    parser.add_argument("--no-assets", dest="save_assets", action="store_false", help="Skip asset saving")
    parser.add_argument("--no-ui-inventory", dest="collect_ui_inventory", action="store_false", help="Skip UI inventory")
    
    # Advanced options
    parser.add_argument("--timeout", type=int, help="Navigation timeout in milliseconds")
    parser.add_argument("--delay", type=int, help="Delay between pages in milliseconds")
    parser.add_argument("--user-agent", help="Custom user agent string")
    
    return parser

def main():
    """Main CLI entry point."""
    parser = create_parser()
    args = parser.parse_args()
    
    # Load or create configuration
    if args.config:
        config = ScraperConfig.from_file(args.config)
    else:
        config = ScraperConfig()
    
    # Override config with command line arguments
    if args.max_pages is not None:
        config.max_pages = args.max_pages
    if args.max_depth is not None:
        config.max_depth = args.max_depth
    if args.concurrency is not None:
        config.concurrency_pages = args.concurrency
    if args.headless is not None:
        config.headless = args.headless
    if args.timeout is not None:
        config.navigation_timeout_ms = args.timeout
    if args.delay is not None:
        config.page_delay_ms = args.delay
    if args.user_agent:
        config.user_agent = args.user_agent
    
    # Handle cross-origin setting
    if args.cross_origin:
        config.respect_robots_txt = False
    
    # Save config if requested
    if args.save_config:
        config.save_to_file(args.save_config)
        return
    
    # Create and run scraper
    try:
        scraper = SiteScraper(
            start_url=args.url,
            output_dir=args.output,
            config=config
        )
        
        asyncio.run(scraper.run())
        
    except KeyboardInterrupt:
        logger.info("Scraping interrupted by user")
    except Exception as e:
        logger.error(f"Scraping failed: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())
