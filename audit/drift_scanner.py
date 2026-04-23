#!/usr/bin/env python3
"""
OINIO Soul Deep Reflection: Long-Term Drift Detection
Full system audit comparing codebase against canonical identity map.
"""

import os
import json
import re
from pathlib import Path
from datetime import datetime

try:
    import chromadb
    from chromadb.utils.embedding_functions import OllamaEmbeddingFunction
    import requests
except ImportError:
    print("❌ Dependencies missing. Run: pip install chromadb requests")
    exit(1)

CHROMA_PATH = Path("chroma_db")

def get_identity_collection():
    client = chromadb.PersistentClient(path=str(CHROMA_PATH))
    ef = OllamaEmbeddingFunction(url="http://localhost:11434", model_name="nomic-embed-text")
    return client.get_or_create_collection(name="canon", embedding_function=ef)

def scan_all_files():
    """Scan all relevant files in the repository"""
    files = []
    for root, _, filenames in os.walk("."):
        if any(exclude in root for exclude in ['.git', '.venv', 'node_modules', 'chroma_db']):
            continue
        for filename in filenames:
            if filename.endswith(('.py', '.json', '.md')):
                files.append(Path(root) / filename)
    return files

def evaluate_file_alignment(file_path):
    collection = get_identity_collection()
    
    try:
        content = file_path.read_text(encoding='utf-8', errors='ignore')
        
        # Get most relevant identity map entries
        results = collection.query(
            query_texts=[content[:1500]],
            n_results=5
        )
        
        # LLM alignment scoring
        prompt = f"""
Evaluate alignment between this file and the canonical identity principles.
Score 1-10 where 10 = perfect alignment, 1 = critical drift.

File: {file_path}
File content preview:
{content[:1200]}

Relevant identity map entries:
{chr(10).join([f"- {doc[:200]}" for doc in results['documents'][0]])}

Output ONLY a single integer score followed by one sentence explanation.
"""
        
        response = requests.post("http://localhost:11434/api/generate", json={
            "model": "llama3",
            "prompt": prompt,
            "stream": False,
            "temperature": 0.1
        })
        
        result = response.json()['response'].strip()
        
        # Extract numeric score
        score_match = re.search(r'(\d+)', result)
        score = int(score_match.group(1)) if score_match else 5
        
        return {
            'path': str(file_path),
            'alignment_score': score,
            'evaluation': result,
            'last_scanned': datetime.now().isoformat()
        }
        
    except Exception as e:
        return {
            'path': str(file_path),
            'alignment_score': 0,
            'error': str(e),
            'last_scanned': datetime.now().isoformat()
        }

def generate_drift_report():
    print(f"🔍 Starting full system drift scan at {datetime.now().isoformat()}")
    
    files = scan_all_files()
    report = {
        'scan_time': datetime.now().isoformat(),
        'files_scanned': len(files),
        'results': [],
        'critical_drift': []
    }
    
    for i, file in enumerate(files):
        print(f"[{i+1}/{len(files)}] Scanning {file}")
        result = evaluate_file_alignment(file)
        report['results'].append(result)
        
        if result['alignment_score'] < 4:
            report['critical_drift'].append(result)
    
    # Sort by alignment score ascending
    report['results'].sort(key=lambda x: x['alignment_score'])
    
    # Save report
    Path("state").mkdir(exist_ok=True)
    with open("state/drift_report.json", "w") as f:
        json.dump(report, f, indent=2)
    
    print(f"\n✅ Scan complete. {len(report['critical_drift'])} critical drift files found.")
    print(f"📄 Report written to state/drift_report.json")
    
    return report

if __name__ == "__main__":
    generate_drift_report()