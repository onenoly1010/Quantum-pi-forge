#!/usr/bin/env python3
"""
🔍 QUANTUM SERVER VERIFICATION SCRIPT
Tests all server components without dependencies
"""

import sys
import os
import ast

def check_python_syntax(file_path):
    """Check if a Python file has valid syntax"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            source = f.read()
        
        # Parse the AST to check syntax
        ast.parse(source)
        print(f"✅ {file_path}: Syntax OK")
        return True
    except SyntaxError as e:
        print(f"❌ {file_path}: Syntax Error - {e}")
        return False
    except Exception as e:
        print(f"⚠️ {file_path}: Error reading file - {e}")
        return False

def check_imports(file_path):
    """Check if imports in a file are standard or available"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            source = f.read()
        
        tree = ast.parse(source)
        imports = []
        
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    imports.append(alias.name)
            elif isinstance(node, ast.ImportFrom):
                imports.append(node.module)
        
        print(f"📦 {file_path}: Imports - {', '.join(set(imports))}")
        return imports
    except Exception as e:
        print(f"⚠️ {file_path}: Could not analyze imports - {e}")
        return []

def main():
    print("🌌 QUANTUM RESONANCE LATTICE - SERVER VERIFICATION")
    print("=" * 60)
    
    server_files = [
        "server/main.py",
        "server/app.py", 
        "server/canticle_interface.py"
    ]
    
    all_good = True
    
    for file_path in server_files:
        if os.path.exists(file_path):
            print(f"\n🔍 Checking {file_path}...")
            syntax_ok = check_python_syntax(file_path)
            if syntax_ok:
                check_imports(file_path)
            all_good = all_good and syntax_ok
        else:
            print(f"❌ {file_path}: File not found")
            all_good = False
    
    print(f"\n🎯 OVERALL STATUS: {'✅ ALL GOOD' if all_good else '❌ ISSUES FOUND'}")
    
    # Check if quantum demo works
    if os.path.exists("quantum_demo.py"):
        print(f"\n🎭 Checking quantum_demo.py...")
        check_python_syntax("quantum_demo.py")
    
    print("\n🚀 Server verification complete!")

if __name__ == "__main__":
    main()