#!/usr/bin/env python3
"""
Canon Conflict Detection Script

Detects semantic, structural, and continuity conflicts in Canon artifacts.
Outputs JSON results for workflow consumption.
"""

import argparse
import json
import os
import re
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import yaml

# Try to import optional dependencies
try:
    import requests
    REQUESTS_AVAILABLE = True
except ImportError:
    REQUESTS_AVAILABLE = False
    print("::warning::requests not available, API features disabled")

try:
    import networkx as nx
    NETWORKX_AVAILABLE = True
except ImportError:
    NETWORKX_AVAILABLE = False
    print("::warning::networkx not available, dependency analysis disabled")


def load_artifact(file_path: Path) -> Optional[Dict]:
    """Load and parse a Canon artifact YAML file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract YAML frontmatter
        if content.startswith('---'):
            parts = content.split('---', 2)
            if len(parts) >= 3:
                frontmatter = yaml.safe_load(parts[1])
                body = parts[2].strip()
                return {
                    'path': str(file_path),
                    'frontmatter': frontmatter,
                    'body': body
                }
    except Exception as e:
        print(f"::warning::Failed to load artifact {file_path}: {e}")
    return None


def find_canon_artifacts(canon_dir: Path) -> List[Dict]:
    """Find all Canon artifacts in the directory."""
    artifacts = []
    
    if not canon_dir.exists():
        print(f"::warning::Canon directory {canon_dir} does not exist")
        return artifacts
    
    for file_path in canon_dir.rglob('*.md'):
        if file_path.name in ['INDEX.md', 'README.md']:
            continue
        
        artifact = load_artifact(file_path)
        if artifact:
            artifacts.append(artifact)
    
    return artifacts


def check_naming_conflicts(new_artifact: Dict, existing_artifacts: List[Dict]) -> List[Dict]:
    """Check for naming conflicts."""
    conflicts = []
    
    new_id = new_artifact.get('frontmatter', {}).get('id')
    new_title = new_artifact.get('frontmatter', {}).get('title')
    
    if not new_id:
        conflicts.append({
            'type': 'missing_id',
            'severity': 'error',
            'message': 'Artifact missing required ID field',
            'artifact': new_artifact['path']
        })
        return conflicts
    
    for artifact in existing_artifacts:
        existing_id = artifact.get('frontmatter', {}).get('id')
        existing_title = artifact.get('frontmatter', {}).get('title')
        
        # Check ID conflict
        if existing_id == new_id and artifact['path'] != new_artifact['path']:
            conflicts.append({
                'type': 'duplicate_id',
                'severity': 'error',
                'message': f'Duplicate artifact ID: {new_id}',
                'artifact': new_artifact['path'],
                'conflicts_with': artifact['path']
            })
        
        # Check title similarity
        if existing_title and new_title:
            if existing_title.lower() == new_title.lower() and artifact['path'] != new_artifact['path']:
                conflicts.append({
                    'type': 'duplicate_title',
                    'severity': 'warning',
                    'message': f'Duplicate artifact title: {new_title}',
                    'artifact': new_artifact['path'],
                    'conflicts_with': artifact['path']
                })
    
    return conflicts


def check_parent_references(new_artifact: Dict, existing_artifacts: List[Dict]) -> List[Dict]:
    """Check parent reference validity."""
    conflicts = []
    
    parent_id = new_artifact.get('frontmatter', {}).get('parent')
    
    if not parent_id:
        # No parent is valid for foundational artifacts
        return conflicts
    
    # Check if parent exists
    parent_exists = any(
        a.get('frontmatter', {}).get('id') == parent_id
        for a in existing_artifacts
    )
    
    if not parent_exists:
        conflicts.append({
            'type': 'missing_parent',
            'severity': 'error',
            'message': f'Parent artifact not found: {parent_id}',
            'artifact': new_artifact['path'],
            'parent_id': parent_id
        })
    
    return conflicts


def check_trace_ids(new_artifact: Dict) -> List[Dict]:
    """Check trace ID validity."""
    conflicts = []
    
    trace_id = new_artifact.get('frontmatter', {}).get('trace_id')
    
    if not trace_id:
        conflicts.append({
            'type': 'missing_trace_id',
            'severity': 'warning',
            'message': 'Artifact missing trace_id field',
            'artifact': new_artifact['path']
        })
        return conflicts
    
    # Validate trace ID format (example: A22-001, A23-042)
    if not re.match(r'^A\d{2}-\d{3}$', trace_id):
        conflicts.append({
            'type': 'invalid_trace_id',
            'severity': 'error',
            'message': f'Invalid trace ID format: {trace_id} (expected format: AXX-YYY)',
            'artifact': new_artifact['path'],
            'trace_id': trace_id
        })
    
    return conflicts


def check_circular_dependencies(artifacts: List[Dict]) -> List[Dict]:
    """Check for circular parent dependencies."""
    conflicts = []
    
    if not NETWORKX_AVAILABLE:
        return conflicts
    
    # Build dependency graph
    graph = nx.DiGraph()
    
    for artifact in artifacts:
        artifact_id = artifact.get('frontmatter', {}).get('id')
        parent_id = artifact.get('frontmatter', {}).get('parent')
        
        if artifact_id:
            graph.add_node(artifact_id, artifact=artifact)
            if parent_id:
                graph.add_edge(artifact_id, parent_id)
    
    # Find cycles
    try:
        cycles = list(nx.simple_cycles(graph))
        for cycle in cycles:
            conflicts.append({
                'type': 'circular_dependency',
                'severity': 'error',
                'message': f'Circular dependency detected: {" -> ".join(cycle)}',
                'cycle': cycle
            })
    except Exception as e:
        print(f"::warning::Failed to check for cycles: {e}")
    
    return conflicts


def calculate_semantic_similarity(text1: str, text2: str) -> float:
    """Calculate semantic similarity between two texts."""
    # Simple word overlap similarity (can be enhanced with embeddings)
    words1 = set(text1.lower().split())
    words2 = set(text2.lower().split())
    
    if not words1 or not words2:
        return 0.0
    
    intersection = words1.intersection(words2)
    union = words1.union(words2)
    
    return len(intersection) / len(union) if union else 0.0


def check_semantic_conflicts(
    new_artifact: Dict,
    existing_artifacts: List[Dict],
    threshold: float = 0.85
) -> List[Dict]:
    """Check for semantic conflicts using similarity threshold."""
    conflicts = []
    
    new_body = new_artifact.get('body', '')
    new_title = new_artifact.get('frontmatter', {}).get('title', '')
    new_text = f"{new_title} {new_body}"
    
    for artifact in existing_artifacts:
        if artifact['path'] == new_artifact['path']:
            continue
        
        existing_body = artifact.get('body', '')
        existing_title = artifact.get('frontmatter', {}).get('title', '')
        existing_text = f"{existing_title} {existing_body}"
        
        similarity = calculate_semantic_similarity(new_text, existing_text)
        
        if similarity >= threshold:
            conflicts.append({
                'type': 'semantic_conflict',
                'severity': 'warning',
                'message': f'High semantic similarity detected ({similarity:.2%})',
                'artifact': new_artifact['path'],
                'conflicts_with': artifact['path'],
                'similarity_score': similarity
            })
    
    return conflicts


def check_structural_validity(artifact: Dict) -> List[Dict]:
    """Check structural validity of artifact."""
    conflicts = []
    
    frontmatter = artifact.get('frontmatter', {})
    required_fields = ['id', 'title', 'type', 'created_at']
    
    for field in required_fields:
        if field not in frontmatter:
            conflicts.append({
                'type': 'missing_required_field',
                'severity': 'error',
                'message': f'Missing required field: {field}',
                'artifact': artifact['path'],
                'field': field
            })
    
    # Validate type
    valid_types = ['foundational', 'channel', 'closure', 'governance']
    artifact_type = frontmatter.get('type')
    if artifact_type and artifact_type not in valid_types:
        conflicts.append({
            'type': 'invalid_type',
            'severity': 'error',
            'message': f'Invalid artifact type: {artifact_type}',
            'artifact': artifact['path'],
            'valid_types': valid_types
        })
    
    return conflicts


def main():
    parser = argparse.ArgumentParser(description="Canon Conflict Detection")
    parser.add_argument('--canon-dir', default='canon', help='Canon directory path')
    parser.add_argument('--new-artifact', help='Path to new artifact to check')
    parser.add_argument('--semantic-threshold', type=float, default=0.85,
                       help='Semantic similarity threshold (0.0-1.0)')
    parser.add_argument('--output', help='Output JSON file path')
    
    args = parser.parse_args()
    
    print("::group::Canon Conflict Detection")
    
    # Resolve paths
    repo_root = Path(os.environ.get('GITHUB_WORKSPACE', '.')).resolve()
    canon_dir = (repo_root / args.canon_dir).resolve()
    
    # Load existing artifacts
    print(f"Loading existing artifacts from {canon_dir}...")
    existing_artifacts = find_canon_artifacts(canon_dir)
    print(f"Found {len(existing_artifacts)} existing artifacts")
    
    # Load new artifact if specified
    new_artifact = None
    if args.new_artifact:
        new_artifact_path = (repo_root / args.new_artifact).resolve()
        if new_artifact_path.exists():
            new_artifact = load_artifact(new_artifact_path)
            if new_artifact:
                print(f"Loaded new artifact: {new_artifact_path}")
        else:
            print(f"::error::New artifact not found: {new_artifact_path}")
            sys.exit(1)
    
    # Run conflict checks
    all_conflicts = []
    
    if new_artifact:
        print("\nChecking structural validity...")
        all_conflicts.extend(check_structural_validity(new_artifact))
        
        print("Checking naming conflicts...")
        all_conflicts.extend(check_naming_conflicts(new_artifact, existing_artifacts))
        
        print("Checking parent references...")
        all_conflicts.extend(check_parent_references(new_artifact, existing_artifacts))
        
        print("Checking trace IDs...")
        all_conflicts.extend(check_trace_ids(new_artifact))
        
        print("Checking semantic conflicts...")
        all_conflicts.extend(check_semantic_conflicts(
            new_artifact, existing_artifacts, args.semantic_threshold
        ))
        
        # Check circular dependencies with new artifact included
        print("Checking circular dependencies...")
        all_artifacts = existing_artifacts + [new_artifact]
        all_conflicts.extend(check_circular_dependencies(all_artifacts))
    else:
        # Check existing artifacts only
        print("Checking circular dependencies...")
        all_conflicts.extend(check_circular_dependencies(existing_artifacts))
    
    # Categorize conflicts
    errors = [c for c in all_conflicts if c.get('severity') == 'error']
    warnings = [c for c in all_conflicts if c.get('severity') == 'warning']
    
    # Output results
    result = {
        'success': len(errors) == 0,
        'total_conflicts': len(all_conflicts),
        'errors': len(errors),
        'warnings': len(warnings),
        'conflicts': all_conflicts
    }
    
    # Print summary
    print(f"\n{'='*60}")
    print(f"Conflict Detection Results:")
    print(f"  Total Conflicts: {result['total_conflicts']}")
    print(f"  Errors: {result['errors']}")
    print(f"  Warnings: {result['warnings']}")
    print(f"{'='*60}")
    
    if errors:
        print("\nErrors found:")
        for error in errors:
            print(f"  ❌ {error['type']}: {error['message']}")
    
    if warnings:
        print("\nWarnings found:")
        for warning in warnings:
            print(f"  ⚠️  {warning['type']}: {warning['message']}")
    
    # Save output
    if args.output:
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w') as f:
            json.dump(result, f, indent=2)
        print(f"\nResults saved to: {output_path}")
    
    # Output for GitHub Actions
    github_output = os.environ.get('GITHUB_OUTPUT')
    if github_output:
        with open(github_output, 'a') as f:
            f.write(f"success={str(result['success']).lower()}\n")
            f.write(f"conflicts={result['total_conflicts']}\n")
            f.write(f"errors={result['errors']}\n")
            f.write(f"warnings={result['warnings']}\n")
    else:
        # Fallback for local testing
        print(f"\nsuccess={str(result['success']).lower()}")
        print(f"conflicts={result['total_conflicts']}")
        print(f"errors={result['errors']}")
        print(f"warnings={result['warnings']}")
    
    print("::endgroup::")
    
    # Exit with error if conflicts found
    sys.exit(0 if result['success'] else 1)


if __name__ == '__main__':
    main()
