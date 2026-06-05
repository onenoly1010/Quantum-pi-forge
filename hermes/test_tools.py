#!/usr/bin/env python3
from hermes.tools import fetch_page, search_web

print("=== search stub ===")
print(search_web("code generating LLM formal verification"))

print()
print("=== fetch test ===")
page = fetch_page("https://quantumpiforge.com")
print("title:", page["title"])
print("url:", page["url"])
print("content_type:", page["content_type"])
print("text_preview:", page["text"][:500])
