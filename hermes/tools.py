#!/usr/bin/env python3
"""
Hermes tools v0.1

Safe local tool layer:
- fetch_page(url): real HTTP fetch
- search_web(query): disabled unless explicitly configured later

No API keys required.
No secrets read.
No wallet access.
"""

from __future__ import annotations

import re
import urllib.request
from html.parser import HTMLParser
from typing import Dict, List


class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ""
        self._in_title = False
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if tag.lower() == "title":
            self._in_title = True

    def handle_endtag(self, tag):
        if tag.lower() == "title":
            self._in_title = False

    def handle_data(self, data):
        text = data.strip()
        if not text:
            return
        if self._in_title:
            self.title += text
        else:
            self.parts.append(text)


def fetch_page(url: str, timeout: int = 15) -> Dict[str, str]:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "HermesResearchAgent/0.1 (+https://quantumpiforge.com)"
        },
    )

    with urllib.request.urlopen(req, timeout=timeout) as resp:
        raw = resp.read(1_000_000)
        final_url = resp.geturl()
        content_type = resp.headers.get("content-type", "")

    html = raw.decode("utf-8", errors="replace")
    parser = TextExtractor()
    parser.feed(html)

    text = " ".join(parser.parts)
    text = re.sub(r"\s+", " ", text).strip()

    return {
        "url": final_url,
        "title": parser.title.strip(),
        "content_type": content_type,
        "text": text[:20000],
    }


def search_web(query: str, max_results: int = 5) -> List[Dict[str, str]]:
    """
    Placeholder until a real provider is configured.

    This intentionally does not scrape search engines or pretend to search.
    Future providers:
    - Tavily
    - SerpAPI
    - Brave Search API
    - local curated sources
    """
    return [{
        "query": query,
        "status": "disabled",
        "reason": "No search provider configured yet.",
        "next_step": "Set up an explicit search provider adapter."
    }]
