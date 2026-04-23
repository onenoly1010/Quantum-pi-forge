#!/usr/bin/env python3
"""
OINIO Soul Meta-Memory: Ingest Aliveness Reports
Embeds each cycle's self-assessment into ChromaDB for longitudinal learning.
"""

import os
import json
import hashlib
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

def ingest_aliveness_report(report_path: str = "state/aliveness_report.json"):
    if not os.path.exists(report_path):
        print(f"⚠️ No aliveness report found at {report_path}")
        return False

    with open(report_path, "r") as f:
        report = json.load(f)

    collection = get_history_collection()

    # Create a rich document for embedding
    doc_text = f"""
Aliveness Report {report['generated_at']}
Aliveness Score: {report['aliveness_score']}
Autonomy Level: {report['autonomy_level']}
Next Task: {report['next_task'].get('type', 'unknown')} - {report['next_task'].get('description', '')[:200]}
System Health: {report['system_health']['overall_health']}
Memory Chunks: {report['memory_stats']['count']}
"""

    doc_id = f"aliveness_{int(datetime.now().timestamp())}"

    collection.add(
        documents=[doc_text],
        metadatas=[{
            "type": "aliveness_report",
            "timestamp": report['generated_at'],
            "aliveness_score": report['aliveness_score'],
            "autonomy_level": report['autonomy_level']
        }],
        ids=[doc_id]
    )

    print(f"✅ Ingested aliveness report {doc_id} into meta-memory")
    return True

if __name__ == "__main__":
    ingest_aliveness_report()