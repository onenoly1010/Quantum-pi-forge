#!/usr/bin/env python3
"""
Canon Artifact Validation

Validates YAML frontmatter, schema, and content format of Canon artifacts.
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List

import yaml

try:
    import jsonschema
    JSONSCHEMA_AVAILABLE = True
except ImportError:
    JSONSCHEMA_AVAILABLE = False
    print("::warning::jsonschema not available, schema validation disabled")


# Canon artifact schema
ARTIFACT_SCHEMA = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "required": ["id", "title", "type", "created_at", "author"],
    "properties": {
        "id": {
            "type": "string",
            "pattern": "^[A-Z0-9-]+$",
            "description": "Unique artifact identifier"
        },
        "title": {
            "type": "string",
            "minLength": 1,
            "description": "Artifact title"
        },
        "type": {
            "type": "string",
            "enum": ["foundational", "channel", "closure", "governance"],
            "description": "Artifact type"
        },
        "created_at": {
            "type": "string",
            "description": "Creation timestamp (ISO 8601)"
        },
        "updated_at": {
            "type": "string",
            "description": "Last update timestamp (ISO 8601)"
        },
        "author": {
            "type": "string",
            "minLength": 1,
            "description": "Artifact author"
        },
        "parent": {
            "type": "string",
            "description": "Parent artifact ID"
        },
        "trace_id": {
            "type": "string",
            "pattern": "^A\\d{2}-\\d{3}$",
            "description": "Trace ID (format: AXX-YYY)"
        },
        "status": {
            "type": "string",
            "enum": ["draft", "review", "approved", "archived"],
            "description": "Artifact status"
        },
        "tags": {
            "type": "array",
            "items": {"type": "string"},
            "description": "Artifact tags"
        },
        "related": {
            "type": "array",
            "items": {"type": "string"},
            "description": "Related artifact IDs"
        }
    }
}


def validate_frontmatter(frontmatter: Dict) -> List[Dict]:
    """Validate YAML frontmatter structure."""
    issues = []
    
    # Check required fields
    required_fields = ['id', 'title', 'type', 'created_at', 'author']
    for field in required_fields:
        if field not in frontmatter or not frontmatter[field]:
            issues.append({
                'type': 'missing_required_field',
                'severity': 'error',
                'field': field,
                'message': f'Missing required field: {field}'
            })
    
    # Validate ID format
    if 'id' in frontmatter:
        artifact_id = frontmatter['id']
        if not re.match(r'^[A-Z0-9-]+$', artifact_id):
            issues.append({
                'type': 'invalid_id_format',
                'severity': 'error',
                'field': 'id',
                'value': artifact_id,
                'message': f'Invalid ID format: {artifact_id} (must be uppercase alphanumeric with hyphens)'
            })
    
    # Validate type
    valid_types = ['foundational', 'channel', 'closure', 'governance']
    if 'type' in frontmatter:
        artifact_type = frontmatter['type']
        if artifact_type not in valid_types:
            issues.append({
                'type': 'invalid_type',
                'severity': 'error',
                'field': 'type',
                'value': artifact_type,
                'valid_types': valid_types,
                'message': f'Invalid type: {artifact_type}'
            })
    
    # Validate trace_id format
    if 'trace_id' in frontmatter:
        trace_id = frontmatter['trace_id']
        if not re.match(r'^A\d{2}-\d{3}$', trace_id):
            issues.append({
                'type': 'invalid_trace_id',
                'severity': 'error',
                'field': 'trace_id',
                'value': trace_id,
                'message': f'Invalid trace_id format: {trace_id} (expected: AXX-YYY)'
            })
    
    # Validate status
    valid_statuses = ['draft', 'review', 'approved', 'archived']
    if 'status' in frontmatter:
        status = frontmatter['status']
        if status not in valid_statuses:
            issues.append({
                'type': 'invalid_status',
                'severity': 'warning',
                'field': 'status',
                'value': status,
                'valid_statuses': valid_statuses,
                'message': f'Invalid status: {status}'
            })
    
    # Validate timestamps
    for date_field in ['created_at', 'updated_at']:
        if date_field in frontmatter:
            date_value = frontmatter[date_field]
            try:
                # Handle both datetime objects and strings
                if isinstance(date_value, datetime):
                    # Already a datetime object, that's valid
                    pass
                elif isinstance(date_value, str):
                    # Parse string to validate format
                    datetime.fromisoformat(date_value.replace('Z', '+00:00'))
                else:
                    issues.append({
                        'type': 'invalid_timestamp',
                        'severity': 'warning',
                        'field': date_field,
                        'value': str(date_value),
                        'message': f'Invalid timestamp type in {date_field}'
                    })
            except (ValueError, AttributeError):
                issues.append({
                    'type': 'invalid_timestamp',
                    'severity': 'warning',
                    'field': date_field,
                    'value': str(date_value),
                    'message': f'Invalid timestamp format in {date_field}'
                })
    
    return issues


def validate_schema(frontmatter: Dict) -> List[Dict]:
    """Validate frontmatter against JSON schema."""
    issues = []
    
    if not JSONSCHEMA_AVAILABLE:
        return issues
    
    # Convert datetime objects to strings for schema validation
    def convert_for_schema(value):
        if isinstance(value, datetime):
            return value.isoformat()
        elif isinstance(value, list):
            return [convert_for_schema(v) for v in value]
        elif isinstance(value, dict):
            return {k: convert_for_schema(v) for k, v in value.items()}
        return value
    
    converted_frontmatter = {k: convert_for_schema(v) for k, v in frontmatter.items()}
    
    try:
        jsonschema.validate(converted_frontmatter, ARTIFACT_SCHEMA)
    except jsonschema.ValidationError as e:
        issues.append({
            'type': 'schema_validation_error',
            'severity': 'error',
            'field': '.'.join(str(p) for p in e.path) if e.path else 'root',
            'message': f'Schema validation failed: {e.message}'
        })
    except jsonschema.SchemaError as e:
        issues.append({
            'type': 'schema_error',
            'severity': 'error',
            'message': f'Schema error: {e.message}'
        })
    
    return issues


def validate_content(body: str, frontmatter: Dict) -> List[Dict]:
    """Validate artifact content."""
    issues = []
    
    # Check minimum content length
    if len(body.strip()) < 100:
        issues.append({
            'type': 'insufficient_content',
            'severity': 'warning',
            'message': f'Artifact content is very short ({len(body)} characters)'
        })
    
    # Check for required sections (for certain types)
    artifact_type = frontmatter.get('type')
    
    if artifact_type == 'closure':
        required_sections = ['## Issue Summary', '## Resolution']
        for section in required_sections:
            if section.lower() not in body.lower():
                issues.append({
                    'type': 'missing_section',
                    'severity': 'warning',
                    'section': section,
                    'message': f'Closure artifact missing recommended section: {section}'
                })
    
    # Check for broken markdown links
    link_pattern = r'\[([^\]]+)\]\(([^)]+)\)'
    links = re.findall(link_pattern, body)
    
    for link_text, link_url in links:
        # Check for empty URLs
        if not link_url.strip():
            issues.append({
                'type': 'broken_link',
                'severity': 'warning',
                'link_text': link_text,
                'message': f'Empty link URL: [{link_text}]()'
            })
    
    return issues


def validate_artifact_file(file_path: Path) -> Dict:
    """Validate a single Canon artifact file."""
    result = {
        'file': str(file_path),
        'valid': True,
        'issues': []
    }
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check for YAML frontmatter
        if not content.startswith('---'):
            result['valid'] = False
            result['issues'].append({
                'type': 'missing_frontmatter',
                'severity': 'error',
                'message': 'Artifact missing YAML frontmatter'
            })
            return result
        
        # Parse frontmatter
        parts = content.split('---', 2)
        if len(parts) < 3:
            result['valid'] = False
            result['issues'].append({
                'type': 'invalid_frontmatter',
                'severity': 'error',
                'message': 'Invalid YAML frontmatter structure'
            })
            return result
        
        try:
            frontmatter = yaml.safe_load(parts[1])
        except yaml.YAMLError as e:
            result['valid'] = False
            result['issues'].append({
                'type': 'yaml_parse_error',
                'severity': 'error',
                'message': f'Failed to parse YAML: {e}'
            })
            return result
        
        body = parts[2].strip()
        
        # Run validations
        result['issues'].extend(validate_frontmatter(frontmatter))
        result['issues'].extend(validate_schema(frontmatter))
        result['issues'].extend(validate_content(body, frontmatter))
        
        # Determine if valid
        errors = [i for i in result['issues'] if i.get('severity') == 'error']
        result['valid'] = len(errors) == 0
        
    except Exception as e:
        result['valid'] = False
        result['issues'].append({
            'type': 'validation_error',
            'severity': 'error',
            'message': f'Validation failed: {str(e)}'
        })
    
    return result


def main():
    parser = argparse.ArgumentParser(description="Canon Artifact Validation")
    parser.add_argument('artifact', help='Path to artifact file to validate')
    parser.add_argument('--output', help='Output JSON file path')
    parser.add_argument('--strict', action='store_true',
                       help='Fail on warnings as well as errors')
    
    args = parser.parse_args()
    
    print("::group::Canon Artifact Validation")
    
    # Resolve path
    artifact_path = Path(args.artifact).resolve()
    
    if not artifact_path.exists():
        print(f"::error::Artifact not found: {artifact_path}")
        print("::endgroup::")
        sys.exit(1)
    
    print(f"Validating artifact: {artifact_path}")
    
    # Validate artifact
    result = validate_artifact_file(artifact_path)
    
    # Categorize issues
    errors = [i for i in result['issues'] if i.get('severity') == 'error']
    warnings = [i for i in result['issues'] if i.get('severity') == 'warning']
    
    # Print summary
    print(f"\n{'='*60}")
    print(f"Validation Results:")
    print(f"  Valid: {result['valid']}")
    print(f"  Total Issues: {len(result['issues'])}")
    print(f"  Errors: {len(errors)}")
    print(f"  Warnings: {len(warnings)}")
    print(f"{'='*60}")
    
    if errors:
        print("\n❌ Errors found:")
        for error in errors:
            print(f"  • {error['type']}: {error['message']}")
    
    if warnings:
        print(f"\n⚠️  Warnings found:")
        for warning in warnings:
            print(f"  • {warning['type']}: {warning['message']}")
    
    if result['valid']:
        print("\n✅ Artifact is valid!")
    else:
        print("\n❌ Artifact validation failed")
    
    # Save output
    if args.output:
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w') as f:
            json.dump(result, f, indent=2)
        print(f"\nResults saved to: {output_path}")
    
    print("::endgroup::")
    
    # Determine exit code
    if args.strict:
        success = result['valid'] and len(warnings) == 0
    else:
        success = result['valid']
    
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
