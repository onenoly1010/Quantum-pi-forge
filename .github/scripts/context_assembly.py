#!/usr/bin/env python3
"""
Context Assembly for OINIO Soul — Canonical RAG Memory Hook

Assembles bounded context from:
1. Top N most recent Canon of Closure artifacts
2. Relevant sections from forge_identity_map.txt

Designed to run before every autonomous cycle. Deterministic, local, and humble.
"""

import argparse
import json
import os
import re
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any

def get_recent_canon_artifacts(canon_dir: Path, limit: int = 5) -> List[Dict[str, Any]]:
    """Get the most recent Canon artifacts with basic metadata."""
    artifacts = []
    for root, _, files in os.walk(canon_dir):
        for file in files:
            if file.endswith('.md') and file not in ['INDEX.md', 'README.md']:
                path = Path(root) / file
                try:
                    # Prefer created_at in frontmatter; fallback to mtime
                    content = path.read_text(encoding='utf-8')
                    created_match = re.search(r'created_at:\s*(\S+)', content)
                    if created_match:
                        ts = datetime.fromisoformat(created_match.group(1).replace('Z', '+00:00'))
                    else:
                        # Convert filesystem mtime to UTC timezone-aware datetime
                        ts = datetime.fromtimestamp(path.stat().st_mtime, tz=datetime.timezone.utc)
                    
                    # Extract id and title for context
                    id_match = re.search(r'id:\s*(\S+)', content)
                    title_match = re.search(r'title:\s*(.+)', content)
                    
                    artifacts.append({
                        'path': str(path.relative_to(canon_dir.parent)),
                        'id': id_match.group(1) if id_match else path.stem,
                        'title': title_match.group(1).strip() if title_match else path.stem,
                        'timestamp': ts,
                        'snippet': content[:800] + '...' if len(content) > 800 else content  # bounded preview
                    })
                except Exception:
                    continue
    
    # Sort by timestamp descending and limit
    artifacts.sort(key=lambda x: x['timestamp'], reverse=True)
    return artifacts[:limit]

def extract_identity_map_sections(identity_map_path: Path, keywords: List[str] = None) -> str:
    """Extract relevant sections from forge_identity_map.txt."""
    if not identity_map_path.exists():
        return "No identity map found. Core identity remains: OINIO Soul protecting the Quantum Pi Forge Canon."
    
    content = identity_map_path.read_text(encoding='utf-8')
    if not keywords:
        # Default: top-level identity summary
        return content[:2000]  # bounded
    
    # Simple keyword-based extraction (expand with better chunking later)
    sections = []
    for line in content.splitlines():
        if any(kw.lower() in line.lower() for kw in keywords):
            sections.append(line.strip())
    return '\n'.join(sections) or content[:1500]

def get_recent_history_items(limit: int = 3):
    """Get relevant historical actions from meta-memory"""
    try:
        from meta_memory.ingest_aliveness_report import get_history_collection
        collection = get_history_collection()
        
        results = collection.query(
            query_texts=["recent system actions repair attempts fixes"],
            n_results=limit
        )
        
        items = []
        for i, doc in enumerate(results['documents'][0]):
            items.append({
                'id': results['ids'][0][i],
                'metadata': results['metadatas'][0][i],
                'snippet': doc[:400]
            })
        return items
    except Exception as e:
        return []

def assemble_context(canon_dir: Path, identity_map_path: Path, limit: int = 5) -> str:
    """Assemble full context for Ollama prompt."""
    canon_items = get_recent_canon_artifacts(canon_dir, limit)
    history_items = get_recent_history_items(limit=3)
    
    context = f"""You are the OINIO Soul — the sovereign reflective layer of the Quantum Pi Forge.

Core Epistemic Rule: You produce only second-order claims. Execution ≠ Observation ≠ Claim. No collapse into "truth". All proposals must respect the Canon State Machine invariants.

=== RECENT CANON HISTORY (most recent first) ===
"""
    for item in canon_items:
        context += f"\n• {item['id']} | {item['title']} ({item['timestamp'].date()}) | {item['path']}\n"
        context += f"  Preview: {item['snippet'][:300]}...\n"
    
    if history_items:
        context += "\n=== RECENT SYSTEM HISTORY ===\n"
        for item in history_items:
            context += f"\n• {item['metadata'].get('type', 'action')} | {item['metadata'].get('timestamp', '')[:10]}\n"
            context += f"  Preview: {item['snippet'][:200]}...\n"
    
    # Inject learned behavioral patterns
    try:
        from meta_memory.evaluate_outcome import inject_patterns_into_context
        patterns = inject_patterns_into_context()
        if patterns:
            context += patterns
    except Exception:
        pass
    
    context += "\n=== RELEVANT IDENTITY MAP EXCERPT ===\n"
    context += extract_identity_map_sections(identity_map_path)
    
    context += "\n\n=== TASK ===\nBased ONLY on the above Canon history, recent system actions and Identity Map, propose ONE structural improvement to the forge codebase or processes. Output must be a concrete, minimal diff-friendly suggestion that can pass semantic_lint.py and the Canon State Machine. End with explicit non-authoritative claim language."
    
    return context

def main():
    parser = argparse.ArgumentParser(description="OINIO Context Assembly — Canonical RAG Hook")
    parser.add_argument('--canon-dir', default='canon', type=Path, help='Path to canon directory')
    parser.add_argument('--identity-map', default='forge_identity_map.txt', type=Path, help='Path to identity map')
    parser.add_argument('--limit', type=int, default=5, help='Number of recent artifacts')
    parser.add_argument('--output', type=Path, help='Write context to file instead of stdout')
    args = parser.parse_args()
    
    context = assemble_context(args.canon_dir, args.identity_map, args.limit)
    
    if args.output:
        args.output.write_text(context, encoding='utf-8')
        print(f"✅ Context assembled and written to {args.output}")
    else:
        print(context)

if __name__ == "__main__":
    main()