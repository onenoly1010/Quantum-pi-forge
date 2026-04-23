#!/usr/bin/env python3
"""
OINIO Soul Meta-Memory: Ingest PR Outcomes
Scans and embeds merged PR history for longitudinal learning about successful and failed repair attempts.
"""

import os
import json
import subprocess
from datetime import datetime
from pathlib import Path

try:
    import chromadb
    from chromadb.utils.embedding_functions import OllamaEmbeddingFunction
except ImportError:
    print("❌ ChromaDB not installed. Run: pip install chromadb")
    exit(1)

CHROMA_PATH = Path("chroma_db")
COLLECTION_NAME = "oinio_history"

def get_history_collection():
    client = chromadb.PersistentClient(path=str(CHROMA_PATH))
    ef = OllamaEmbeddingFunction(url="http://localhost:11434", model_name="nomic-embed-text")
    return client.get_or_create_collection(name=COLLECTION_NAME, embedding_function=ef)

def get_merged_prs(label="oinio-proposal", limit=20):
    """Get recent merged PRs with given label from GitHub"""
    try:
        cmd = [
            "gh", "pr", "list",
            "--state", "merged",
            "--label", label,
            "--json", "number,title,body,files,mergedAt,state,additions,deletions",
            "--limit", str(limit)
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return json.loads(result.stdout)
    except Exception as e:
        print(f"⚠️ Could not fetch PRs: {e}")
        return []

def ingest_pr_outcome(pr):
    collection = get_history_collection()

    files_changed = ", ".join([f['path'] for f in pr['files']])
    
    # Create rich document for embedding
    doc_text = f"""
Pull Request #{pr['number']}
Title: {pr['title']}
Merged: {pr['mergedAt']}
Files changed: {files_changed}
Changes: +{pr['additions']} -{pr['deletions']}

{pr['body'][:1200]}
"""

    doc_id = f"pr_{pr['number']}"

    collection.upsert(
        documents=[doc_text],
        metadatas=[{
            "type": "pr_outcome",
            "pr_number": pr['number'],
            "timestamp": pr['mergedAt'],
            "status": pr['state'],
            "files_changed": files_changed
        }],
        ids=[doc_id]
    )

    print(f"✅ Ingested PR #{pr['number']} into meta-memory")
    return True

def ingest_all_recent_prs():
    prs = get_merged_prs()
    ingested = 0
    for pr in prs:
        if ingest_pr_outcome(pr):
            ingested +=1
    print(f"\n✅ Ingested {ingested}/{len(prs)} PR outcomes")
    return ingested

if __name__ == "__main__":
    ingest_all_recent_prs()