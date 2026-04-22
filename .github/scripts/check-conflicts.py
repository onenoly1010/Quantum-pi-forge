#!/usr/bin/env python3
"""
Canon Conflict Detection Script

Checks for:
1. Duplicate artifact IDs
2. Structural validity
3. Reference integrity
4. Optional semantic similarity detection
"""

import argparse
import os
import re
import json
import hashlib
from pathlib import Path


def extract_frontmatter(file_path):
    """Extract YAML frontmatter from markdown file"""
    frontmatter = {}
    in_frontmatter = False
    frontmatter_lines = []
    
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            if line.strip() == '---':
                if not in_frontmatter:
                    in_frontmatter = True
                else:
                    break
            elif in_frontmatter:
                frontmatter_lines.append(line)
    
    for line in frontmatter_lines:
        if ':' in line:
            key, value = line.split(':', 1)
            frontmatter[key.strip()] = value.strip()
    
    return frontmatter


def get_all_artifact_ids(canon_dir):
    """Get all existing artifact IDs from canon directory"""
    ids = set()
    
    for root, _, files in os.walk(canon_dir):
        for file in files:
            if file.endswith('.md') and file not in ['INDEX.md', 'README.md']:
                path = os.path.join(root, file)
                fm = extract_frontmatter(path)
                if 'id' in fm:
                    ids.add(fm['id'])
    
    return ids


def check_duplicate_id(new_artifact, existing_ids):
    """Check if artifact ID already exists"""
    fm = extract_frontmatter(new_artifact)
    if 'id' not in fm:
        print("❌ Artifact missing 'id' field in frontmatter")
        return False
    
    artifact_id = fm['id']
    if artifact_id in existing_ids:
        print(f"❌ Duplicate artifact ID: {artifact_id}")
        return False
    
    print(f"✅ Artifact ID {artifact_id} is unique")
    return True


def check_reference_validity(new_artifact, canon_dir):
    """Check that all references point to existing artifacts"""
    fm = extract_frontmatter(new_artifact)
    
    # Check parent references
    if 'parent' in fm:
        parent_id = fm['parent']
        existing_ids = get_all_artifact_ids(canon_dir)
        if parent_id not in existing_ids:
            print(f"❌ Parent reference {parent_id} does not exist")
            return False
        print(f"✅ Parent reference {parent_id} is valid")
    
    return True


def calculate_similarity(text1, text2):
    """Simple word overlap similarity check"""
    words1 = set(re.findall(r'\b\w+\b', text1.lower()))
    words2 = set(re.findall(r'\b\w+\b', text2.lower()))
    
    if not words1 or not words2:
        return 0.0
    
    intersection = len(words1.intersection(words2))
    union = len(words1.union(words2))
    
    return intersection / union


def check_semantic_conflicts(new_artifact, canon_dir, threshold=0.85):
    """Check for semantic similarity with existing artifacts"""
    with open(new_artifact, 'r', encoding='utf-8') as f:
        new_content = f.read()
    
    conflicts = []
    
    for root, _, files in os.walk(canon_dir):
        for file in files:
            if file.endswith('.md') and file not in ['INDEX.md', 'README.md']:
                path = os.path.join(root, file)
                if path == new_artifact:
                    continue
                    
                with open(path, 'r', encoding='utf-8') as f:
                    existing_content = f.read()
                
                similarity = calculate_similarity(new_content, existing_content)
                if similarity > threshold:
                    conflicts.append((path, similarity))
    
    if conflicts:
        print("⚠️  Potential semantic conflicts detected:")
        for path, sim in conflicts:
            print(f"   {path}: {sim:.2f} similarity")
        return False
    
    print("✅ No semantic conflicts detected")
    return True


def main():
    parser = argparse.ArgumentParser(description='Canon Conflict Detection')
    parser.add_argument('--canon-dir', required=True, help='Path to canon directory')
    parser.add_argument('--new-artifact', required=True, help='Path to new artifact file')
    parser.add_argument('--threshold', type=float, default=0.85, help='Semantic similarity threshold')
    
    args = parser.parse_args()
    
    print("Running Canon Conflict Detection")
    print("================================")
    print()
    
    all_passed = True
    
    # Load config
    config_path = Path('.github/config/canon-merge-rules.json')
    if config_path.exists():
        with open(config_path, 'r') as f:
            config = json.load(f)
        threshold = config.get('validation_gates', {}).get('gate4_conflict', {}).get('semantic_threshold', args.threshold)
    else:
        threshold = args.threshold
    
    # Check 1: Duplicate ID
    existing_ids = get_all_artifact_ids(args.canon_dir)
    if not check_duplicate_id(args.new_artifact, existing_ids):
        all_passed = False
    
    # Check 2: Reference validity
    if not check_reference_validity(args.new_artifact, args.canon_dir):
        all_passed = False
    
    # Check 3: Semantic conflicts
    if not check_semantic_conflicts(args.new_artifact, args.canon_dir, threshold):
        all_passed = False
    
    print()
    if all_passed:
        print("✅ All conflict checks passed")
        return 0
    else:
        print("❌ Conflict checks failed")
        return 1


if __name__ == "__main__":
    exit(main())