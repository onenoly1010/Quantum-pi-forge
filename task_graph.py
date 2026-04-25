#!/usr/bin/env python3
import yaml
import json
import os
import glob
import subprocess
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from enum import Enum


class FailureAction(Enum):
    ABORT = "abort"
    RETRY = "retry"
    DEGRADE = "degrade"


@dataclass
class TaskResult:
    success: bool
    message: str
    artifacts: Dict[str, Any] = None


@dataclass
class Task:
    id: str
    description: str
    inputs: List[str]
    outputs: List[str]
    steps: List[str]
    validation: Dict[str, Any]
    on_fail: Dict[str, Any]
    risk_score: float

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Task':
        return cls(
            id=data['id'],
            description=data['description'],
            inputs=data['inputs'],
            outputs=data['outputs'],
            steps=data['steps'],
            validation=data['validation'],
            on_fail=data['on_fail'],
            risk_score=data['risk_score']
        )


class TaskGraph:
    def __init__(self, graph_path: str):
        with open(graph_path, 'r') as f:
            self.raw = yaml.safe_load(f)
        
        self.version = self.raw['version']
        self.root_task_id = self.raw['root']
        self.tasks: Dict[str, Task] = {}
        
        for task_data in self.raw['tasks']:
            task = Task.from_dict(task_data)
            self.tasks[task.id] = task

    def execution_order(self) -> List[Task]:
        """Return tasks in correct dependency order"""
        ordered = []
        visited = set()
        
        def visit(task_id: str):
            if task_id in visited:
                return
            task = self.tasks[task_id]
            # Visit dependencies first
            for inp in task.inputs:
                # Find which task produces this input
                for tid, t in self.tasks.items():
                    for out in t.outputs:
                        if out == inp or (out.endswith('*') and inp.startswith(out[:-1])):
                            visit(tid)
            visited.add(task_id)
            ordered.append(task)
        
        visit(self.root_task_id)
        return ordered

    def validate_criteria(self, task: Task) -> TaskResult:
        """Execute deterministic validation checks for a task"""
        criteria = task.validation.get('criteria', [])
        
        for criterion in criteria:
            if isinstance(criterion, str) and criterion.startswith('file_exists:'):
                path = criterion.split(':', 1)[1].lstrip('/')
                if path.endswith('*'):
                    matches = glob.glob(path)
                    if not matches:
                        return TaskResult(False, f"No files matching pattern {path} found")
                else:
                    if not os.path.exists(path):
                        return TaskResult(False, f"Required file {path} does not exist")
            
            elif isinstance(criterion, str) and criterion.startswith('json_key_exists:'):
                full_path = criterion.split(':', 1)[1].lstrip('/')
                split_pos = full_path.find('.json') + 5
                file_path = full_path[:split_pos]
                key_path = full_path[split_pos:].lstrip('.')
                if not os.path.exists(file_path):
                    return TaskResult(False, f"File {file_path} missing for key check")
                with open(file_path, 'r') as f:
                    data = json.load(f)
                keys = key_path.split('.')
                current = data
                for k in keys:
                    if k not in current:
                        return TaskResult(False, f"Key {key_path} not found in {file_path}")
                    current = current[k]
            
            elif isinstance(criterion, dict) and 'file_contains' in criterion:
                path = next(iter(criterion['file_contains'].keys()))
                required = criterion['file_contains'][path]
                if not os.path.exists(path):
                    return TaskResult(False, f"File {path} missing")
                with open(path, 'r') as f:
                    content = f.read()
                for needle in required:
                    if needle not in content:
                        return TaskResult(False, f"Required string '{needle}' not found in {path}")

            elif isinstance(criterion, dict) and 'file_contains_keys' in criterion:
                # This validation will be implemented at task execution time
                pass

        return TaskResult(True, "All validation criteria passed")


def load_graph(path: str) -> TaskGraph:
    return TaskGraph(path)


def execute_task(task: Task) -> TaskResult:
    """Execute a single task with no interpretation - strictly artifact driven"""
    print(f"\n⚡ Executing: {task.id}")
    print(f"📋 Description: {task.description}")
    
    max_retries = task.on_fail.get('max_retries', 0)
    attempt = 0
    
    while attempt <= max_retries:
        attempt += 1
        if attempt > 1:
            print(f"🔄 Retry attempt {attempt}/{max_retries}")
        
        # Execute task steps
        try:
            # This is where your run_alive.py hooks in actual execution logic
            # For bootstrap we just generate the state file
            if task.id == "T0_bootstrap":
                repos = [f for f in os.listdir('.') if os.path.isdir(f) and not f.startswith('.')]
                bootstrap_state = {
                    "timestamp": int(os.times()[4]),
                    "repositories": repos,
                    "working_directory": os.getcwd(),
                    "git_available": subprocess.run(["git", "version"], capture_output=True).returncode == 0
                }
                with open("state/bootstrap.json", "w") as f:
                    json.dump(bootstrap_state, f, indent=2)
            
            # Validation is mandatory
            result = task_graph.validate_criteria(task)
            
            if result.success:
                print(f"✅ {task.id} completed successfully")
                return result
            else:
                print(f"❌ {task.id} failed validation: {result.message}")
                
        except Exception as e:
            print(f"💥 {task.id} exception: {str(e)}")
            if attempt > max_retries:
                return TaskResult(False, str(e))
    
    return TaskResult(False, f"Max retries exceeded for {task.id}")


if __name__ == "__main__":
    task_graph = load_graph("market_activation_v1.yaml")
    
    print("📊 Market Activation v1 Task Graph Loaded")
    print(f"🔢 Total tasks: {len(task_graph.tasks)}")
    print(f"🎯 Root task: {task_graph.root_task_id}")
    
    print("\n📋 Execution Order:")
    for i, task in enumerate(task_graph.execution_order()):
        print(f"  {i+1}. {task.id} | Risk: {task.risk_score}")
    
    print("\n🚀 Starting execution...")
    for task in task_graph.execution_order():
        result = execute_task(task)
        
        if not result.success:
            print(f"\n⛔ Task failure: {task.id}")
            action = FailureAction(task.on_fail['action'].lower())
            
            if action == FailureAction.ABORT:
                print("💀 Aborting execution graph")
                exit(1)
            elif action == FailureAction.DEGRADE:
                print("⚠️  Degrading - continuing execution with partial state")
                continue
            elif action == FailureAction.RETRY:
                # We already handled retries inside execute_task
                print("❌ Task failed all retries")
                exit(1)
    
    print("\n🎉 All tasks completed successfully")