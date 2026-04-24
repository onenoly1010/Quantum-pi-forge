#!/usr/bin/env python3
"""
One command full memory ingestion.
Run this once to load all identity map and canon artifacts into ChromaDB.
"""

import sys
from context_assembly import ingest_full, get_collection_stats

if __name__ == "__main__":
    print("OINIO Soul Deep Memory Ingestion")
    print("=" * 60)
    
    print("\n🔄 Starting full ingestion pipeline...")
    
    state_hash, results = ingest_full()
    
    print("\n✅ Ingestion complete:")
    for msg in results:
        print(f"   - {msg}")
    
    print(f"\n🔒 State Hash Boundary: {state_hash}")
    
    stats = get_collection_stats()
    
    print("\n📊 Memory System Statistics:")
    print(f"   Total entries: {stats['count']}")
    print(f"   Database path: {stats['path']}")
    print(f"   Embedding model: {stats['embedding_model']}")
    
    print("\n✨ Deep Memory system is now active.")
    print("\nAll agent loops, lint, CI and merge gates will now have")
    print("full semantic access to 23,750+ identity entries and all Canon artifacts.")