#!/usr/bin/env python3
"""
Canon Integrity Verification

Checks for broken parent references, orphaned artifacts, circular dependencies,
and validates artifact structure.
"""

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Set

import yaml

try:
    import networkx as nx
    NETWORKX_AVAILABLE = True
except ImportError:
    NETWORKX_AVAILABLE = False
    print("::warning::networkx not available, dependency analysis disabled")


def load_artifact(file_path: Path) -> Dict:
    """Load and parse a Canon artifact YAML file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract YAML frontmatter
        if content.startswith('---'):
            parts = content.split('---', 2)
            if len(parts) >= 3:
                frontmatter = yaml.safe_load(parts[1])
                return {
                    'path': str(file_path.relative_to(file_path.parent.parent)),
                    'filename': file_path.name,
                    'frontmatter': frontmatter
                }
    except Exception as e:
        print(f"::warning::Failed to load artifact {file_path}: {e}")
        return None


def find_canon_artifacts(canon_dir: Path) -> List[Dict]:
    """Find all Canon artifacts in the directory."""
    artifacts = []
    
    if not canon_dir.exists():
        print(f"::error::Canon directory {canon_dir} does not exist")
        return artifacts
    
    for file_path in canon_dir.rglob('*.md'):
        if file_path.name in ['INDEX.md', 'README.md']:
            continue
        
        artifact = load_artifact(file_path)
        if artifact:
            artifacts.append(artifact)
    
    return artifacts


def check_broken_references(artifacts: List[Dict]) -> List[Dict]:
    """Check for broken parent references."""
    issues = []
    
    # Build set of all artifact IDs
    artifact_ids = set()
    for artifact in artifacts:
        artifact_id = artifact.get('frontmatter', {}).get('id')
        if artifact_id:
            artifact_ids.add(artifact_id)
    
    # Check each artifact's parent reference
    for artifact in artifacts:
        frontmatter = artifact.get('frontmatter', {})
        artifact_id = frontmatter.get('id')
        parent_id = frontmatter.get('parent')
        
        if parent_id and parent_id not in artifact_ids:
            issues.append({
                'type': 'broken_parent_reference',
                'severity': 'error',
                'artifact_id': artifact_id,
                'artifact_path': artifact['path'],
                'parent_id': parent_id,
                'message': f'Artifact {artifact_id} references non-existent parent: {parent_id}'
            })
    
    return issues


def check_orphaned_artifacts(artifacts: List[Dict]) -> List[Dict]:
    """Check for orphaned artifacts (no parent and not foundational)."""
    issues = []
    
    for artifact in artifacts:
        frontmatter = artifact.get('frontmatter', {})
        artifact_id = frontmatter.get('id')
        artifact_type = frontmatter.get('type')
        parent_id = frontmatter.get('parent')
        
        # Foundational artifacts don't need parents
        if artifact_type == 'foundational':
            continue
        
        # Non-foundational artifacts should have parents
        if not parent_id:
            issues.append({
                'type': 'orphaned_artifact',
                'severity': 'warning',
                'artifact_id': artifact_id,
                'artifact_path': artifact['path'],
                'artifact_type': artifact_type,
                'message': f'Non-foundational artifact {artifact_id} has no parent'
            })
    
    return issues


def check_circular_dependencies(artifacts: List[Dict]) -> List[Dict]:
    """Check for circular parent dependencies."""
    issues = []
    
    if not NETWORKX_AVAILABLE:
        print("::warning::Skipping circular dependency check (networkx not available)")
        return issues
    
    # Build dependency graph
    graph = nx.DiGraph()
    artifact_map = {}
    
    for artifact in artifacts:
        artifact_id = artifact.get('frontmatter', {}).get('id')
        parent_id = artifact.get('frontmatter', {}).get('parent')
        
        if artifact_id:
            graph.add_node(artifact_id)
            artifact_map[artifact_id] = artifact
            
            if parent_id:
                # Add edge from child to parent
                graph.add_edge(artifact_id, parent_id)
    
    # Find cycles
    try:
        cycles = list(nx.simple_cycles(graph))
        for cycle in cycles:
            issues.append({
                'type': 'circular_dependency',
                'severity': 'error',
                'cycle': cycle,
                'message': f'Circular dependency detected: {" → ".join(cycle + [cycle[0]])}'
            })
    except Exception as e:
        print(f"::warning::Failed to check for cycles: {e}")
    
    return issues


def check_missing_fields(artifacts: List[Dict]) -> List[Dict]:
    """Check for missing required fields."""
    issues = []
    
    required_fields = ['id', 'title', 'type', 'created_at', 'author']
    
    for artifact in artifacts:
        frontmatter = artifact.get('frontmatter', {})
        artifact_id = frontmatter.get('id', 'unknown')
        
        for field in required_fields:
            if field not in frontmatter or not frontmatter[field]:
                issues.append({
                    'type': 'missing_required_field',
                    'severity': 'error',
                    'artifact_id': artifact_id,
                    'artifact_path': artifact['path'],
                    'field': field,
                    'message': f'Artifact {artifact_id} missing required field: {field}'
                })
    
    return issues


def check_duplicate_ids(artifacts: List[Dict]) -> List[Dict]:
    """Check for duplicate artifact IDs."""
    issues = []
    
    seen_ids = {}
    
    for artifact in artifacts:
        artifact_id = artifact.get('frontmatter', {}).get('id')
        
        if not artifact_id:
            continue
        
        if artifact_id in seen_ids:
            issues.append({
                'type': 'duplicate_id',
                'severity': 'error',
                'artifact_id': artifact_id,
                'artifact_path': artifact['path'],
                'conflicts_with': seen_ids[artifact_id],
                'message': f'Duplicate artifact ID: {artifact_id}'
            })
        else:
            seen_ids[artifact_id] = artifact['path']
    
    return issues


def check_type_validity(artifacts: List[Dict]) -> List[Dict]:
    """Check artifact type validity."""
    issues = []
    
    valid_types = ['foundational', 'channel', 'closure', 'governance']
    
    for artifact in artifacts:
        frontmatter = artifact.get('frontmatter', {})
        artifact_id = frontmatter.get('id', 'unknown')
        artifact_type = frontmatter.get('type')
        
        if artifact_type and artifact_type not in valid_types:
            issues.append({
                'type': 'invalid_type',
                'severity': 'error',
                'artifact_id': artifact_id,
                'artifact_path': artifact['path'],
                'artifact_type': artifact_type,
                'valid_types': valid_types,
                'message': f'Artifact {artifact_id} has invalid type: {artifact_type}'
            })
    
    return issues


def main():
    parser = argparse.ArgumentParser(description="Canon Integrity Verification")
    parser.add_argument('--canon-dir', default='canon', help='Canon directory path')
    parser.add_argument('--output', help='Output JSON file path')
    parser.add_argument('--strict', action='store_true',
                       help='Fail on warnings as well as errors')
    
    args = parser.parse_args()
    
    print("::group::Canon Integrity Verification")
    
    # Resolve paths
    repo_root = Path(os.environ.get('GITHUB_WORKSPACE', '.')).resolve()
    canon_dir = (repo_root / args.canon_dir).resolve()
    
    # Load all artifacts
    print(f"Loading artifacts from {canon_dir}...")
    artifacts = find_canon_artifacts(canon_dir)
    print(f"Found {len(artifacts)} artifacts")
    
    if not artifacts:
        print("::warning::No artifacts found")
        print("::endgroup::")
        sys.exit(0)
    
    # Run integrity checks
    all_issues = []
    
    print("\nRunning integrity checks...")
    
    print("  • Checking for broken parent references...")
    all_issues.extend(check_broken_references(artifacts))
    
    print("  • Checking for orphaned artifacts...")
    all_issues.extend(check_orphaned_artifacts(artifacts))
    
    print("  • Checking for circular dependencies...")
    all_issues.extend(check_circular_dependencies(artifacts))
    
    print("  • Checking for missing required fields...")
    all_issues.extend(check_missing_fields(artifacts))
    
    print("  • Checking for duplicate IDs...")
    all_issues.extend(check_duplicate_ids(artifacts))
    
    print("  • Checking type validity...")
    all_issues.extend(check_type_validity(artifacts))
    
    # Categorize issues
    errors = [i for i in all_issues if i.get('severity') == 'error']
    warnings = [i for i in all_issues if i.get('severity') == 'warning']
    
    # Build result
    result = {
        'success': len(errors) == 0 and (not args.strict or len(warnings) == 0),
        'total_artifacts': len(artifacts),
        'total_issues': len(all_issues),
        'errors': len(errors),
        'warnings': len(warnings),
        'issues': all_issues
    }
    
    # Print summary
    print(f"\n{'='*60}")
    print(f"Canon Integrity Verification Results:")
    print(f"  Total Artifacts: {result['total_artifacts']}")
    print(f"  Total Issues: {result['total_issues']}")
    print(f"  Errors: {result['errors']}")
    print(f"  Warnings: {result['warnings']}")
    print(f"{'='*60}")
    
    if errors:
        print("\n❌ Errors found:")
        for error in errors:
            print(f"  • {error['type']}: {error['message']}")
    
    if warnings:
        print(f"\n⚠️  Warnings found:")
        for warning in warnings:
            print(f"  • {warning['type']}: {warning['message']}")
    
    if result['success']:
        print("\n✅ Canon integrity verified successfully!")
    else:
        if args.strict:
            print("\n❌ Canon integrity check failed (strict mode)")
        else:
            print("\n❌ Canon integrity check failed")
    
    # Save output
    if args.output:
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w') as f:
            json.dump(result, f, indent=2)
        print(f"\nResults saved to: {output_path}")
    
    print("::endgroup::")
    
    # Exit with error if issues found
    sys.exit(0 if result['success'] else 1)


if __name__ == '__main__':
    main()
