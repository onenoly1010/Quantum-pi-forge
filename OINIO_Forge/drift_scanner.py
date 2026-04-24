#!/usr/bin/env python3
"""
Day 3 Implementation: Long-Term Drift Detection (Deep Reflection)
Full system audit comparing codebase against canonical identity map
Part of 7 Day Activation Map
"""

import json
import os
import hashlib
from pathlib import Path
from datetime import datetime
from context_assembly import retrieve_context, get_chroma_collection

FORGE_ROOT = Path("/home/kris/forge/Quantum-pi-forge")
DRIFT_REPORT = Path("state/drift_report.json")

SCAN_EXTENSIONS = [".py", ".json", ".md", ".js", ".ts"]
EXCLUDE_DIRS = [".git", "node_modules", "__pycache__", "state", "logs"]

def scan_codebase_files() -> List[Path]:
    """Recursively scan all relevant files in the forge"""
    files = []
    
    for root, dirs, filenames in os.walk(FORGE_ROOT):
        # Exclude directories
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        
        for filename in filenames:
            path = Path(root) / filename
            if path.suffix in SCAN_EXTENSIONS:
                files.append(path)
    
    return files

def calculate_file_alignment(file_path: Path) -> Dict:
    """Calculate alignment score for a single file against identity map"""
    
    try:
        content = file_path.read_text(errors="ignore")
        relative_path = file_path.relative_to(FORGE_ROOT)
    except:
        return {
            "file": str(relative_path),
            "alignment_score": 0.0,
            "status": "unreadable",
            "violations": []
        }
    
    # Retrieve relevant identity map entries
    chunks, _ = retrieve_context(content[:1000], limit=5, collection="canon")
    
    alignment_score = 0.0
    violations = []
    
    for chunk in chunks:
        confidence = chunk["confidence"]
        alignment_score += confidence
        
        if confidence < 0.3:
            violations.append({
                "chunk": chunk["text"][:150],
                "confidence": confidence,
                "source": chunk["metadata"].get("source", "unknown")
            })
    
    alignment_score = min(alignment_score / max(len(chunks), 1), 1.0)
    
    return {
        "file": str(relative_path),
        "alignment_score": round(alignment_score, 4),
        "status": "critical" if alignment_score < 0.3 else "warning" if alignment_score < 0.6 else "ok",
        "violations": violations,
        "file_hash": hashlib.sha256(content.encode()).hexdigest()[:12]
    }

def run_full_drift_scan() -> Dict:
    """Run complete system drift scan"""
    
    print(f"🔍 Starting drift scan at {datetime.now().isoformat()}")
    
    files = scan_codebase_files()
    print(f"📁 Found {len(files)} files to scan")
    
    results = []
    total_score = 0.0
    
    for i, file_path in enumerate(files):
        print(f"  Scanning {i+1}/{len(files)}: {file_path.name}")
        alignment = calculate_file_alignment(file_path)
        results.append(alignment)
        total_score += alignment["alignment_score"]
    
    # Sort by alignment score ascending (worst first)
    results.sort(key=lambda x: x["alignment_score"])
    
    overall_alignment = round(total_score / len(results), 4)
    
    report = {
        "scan_completed_at": datetime.now().isoformat(),
        "files_scanned": len(files),
        "overall_alignment_score": overall_alignment,
        "critical_drift_count": sum(1 for r in results if r["status"] == "critical"),
        "warning_drift_count": sum(1 for r in results if r["status"] == "warning"),
        "results": results,
        "scan_status": "completed"
    }
    
    # Save report
    with open(DRIFT_REPORT, "w") as f:
        json.dump(report, f, indent=2)
    
    print(f"\n✅ Drift scan complete")
    print(f"Overall alignment: {overall_alignment*100:.1f}%")
    print(f"Critical drift: {report['critical_drift_count']} files")
    print(f"Warning drift: {report['warning_drift_count']} files")
    print(f"Report saved to {DRIFT_REPORT}")
    
    return report

def get_critical_drift_files(limit=3):
    """Return worst offending files for auto-repair"""
    if not DRIFT_REPORT.exists():
        return []
    
    with open(DRIFT_REPORT) as f:
        report = json.load(f)
    
    critical = [r for r in report["results"] if r["status"] == "critical"]
    return critical[:limit]

if __name__ == "__main__":
    run_full_drift_scan()