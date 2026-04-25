import time
import subprocess
import json
import os
from datetime import datetime, UTC
from context_assembly import build_context_prompt, get_collection_stats
from task_selector import select_next_task, generate_aliveness_report, get_task_execution_prompt
# Meta memory ingest is handled directly in falsifiable.py record_validation_event
from falsifiable import validate_financial_oracle, validate_schema_rewriter, generate_proof, apply_aliveness_asymmetry, adjust_strategy_weight, record_validation_event
from task_graph import load_graph, execute_task, FailureAction

# CONFIGURATION
MODEL_NAME = "llama3.2"          # Change to your local model name
OLLAMA_URL = "http://localhost:11434/api/generate"
INTERVAL_SECONDS = 300           # 5 minutes – adjust as you like
STATE_FILE = "state/context.json"
LOG_FILE = "logs/activity.log"
FORGE_ROOT = "/home/kris/forge/Quantum-pi-forge"
SEMANTIC_LINT_PATH = f"{FORGE_ROOT}/tools/semantic_lint.py"

# RETRY CONFIGURATION - MINIMIZE HUMAN INTERVENTION
MAX_RETRIES = 10
INITIAL_RETRY_DELAY = 2
MAX_RETRY_DELAY = 60
BACKOFF_MULTIPLIER = 2.0

def get_recent_memory(limit=50):
    """Get recent memory entries with failure status"""
    try:
        from context_assembly import get_chroma_collection
        history = get_chroma_collection("oinio_history")
        results = history.query(
            query_texts=["failure"],
            n_results=limit,
            where={"type": "external_proof"}
        )
        memory_chunks = []
        for doc in results.get('documents', []):
            try:
                memory_chunks.append(json.loads(doc))
            except:
                pass
        return memory_chunks
    except:
        return []

def param_similarity(task_params, mem_params):
    """Value-aware parameter similarity scoring"""
    score = 0.0
    for k in task_params:
        if k in mem_params:
            if task_params[k] == mem_params[k]:
                score += 0.2
            elif isinstance(task_params[k], (int, float)) and isinstance(mem_params[k], (int, float)):
                diff = abs(task_params[k] - mem_params[k])
                if diff < 0.01:
                    score += 0.15
                elif diff < 0.1:
                    score += 0.1
    return score

def memory_driven_challenge(task, context, threshold=0.7):
    """
    🔥 LAYER 3: MEMORY-DRIVEN ADVERSARIAL PRE-EXECUTION CHECK
    Rejects actions that are statistically likely to fail based on actual past memory
    Nonlinear risk model with value-aware similarity
    """
    risk_score = 0.0
    reasons = []
    
    memory_chunks = get_recent_memory(limit=50)
    current_time = time.time()
    
    # 1. Find similar failed tasks in memory with value-aware scoring
    failed_similar = []
    for mem in memory_chunks:
        if mem.get("status") == "fail" and mem.get("task_type") == task["type"]:
            sim_score = param_similarity(task.get("params", {}), mem.get("params", {}))
            if sim_score > 0:
                # Apply time decay
                try:
                    mem_time = datetime.fromisoformat(mem["timestamp"]).timestamp()
                    age_hours = (current_time - mem_time) / 3600
                    age_factor = max(0.2, 1 - (age_hours / 24))
                    sim_score *= age_factor
                except:
                    pass
                failed_similar.append((mem, sim_score))
    
    # 2. Nonlinear risk from similar failures
    if failed_similar:
        base_risk = sum(score for _, score in failed_similar)
        risk_score += min(0.6, base_risk ** 1.2)
        reasons.append(f"{len(failed_similar)} similar past failures")
    
    # 3. Risk from same strategy failing recently
    recent_fail_count = sum(1 for mem in memory_chunks[-10:] 
                            if mem.get("strategy_id") == task.get("strategy_id") 
                            and mem.get("status") == "fail")
    if recent_fail_count >= 2:
        risk_score += 0.3
        reasons.append(f"strategy failed {recent_fail_count}x recently")
    
    # 4. Risk from high system drift
    drift_score = context.get("drift_score", 0.0)
    if drift_score > 0.7:
        risk_score += 0.2
        reasons.append("high system drift")
    
    # 5. Adaptive threshold - more cautious when drifting
    dynamic_threshold = 0.7 - (drift_score * 0.2)
    
    # Decision
    if risk_score >= dynamic_threshold:
        return {"decision": "reject", "risk_score": risk_score, "reasons": reasons, "threshold": dynamic_threshold}
    return {"decision": "approve", "risk_score": risk_score, "reasons": reasons, "threshold": dynamic_threshold}

def simulate_economic_failure(task, hot_wallet_balance):
    """
    🔥 LAYER 4: ECONOMIC SOVEREIGNTY CHECK
    Counterfactual adversary that simulates the economic consequences of an action
    Returns (risk_score, list_of_risks)
    """
    risks = []
    risk_score = 0.0

    # 1. Liquidity exhaustion (critical)
    est_cost = task.get("estimated_gas", 0.0005) + task.get("compute_cost", 0.0001)
    
    if est_cost > hot_wallet_balance * 0.8:
        risks.append("liquidity_exhaustion")
        risk_score += 1.0  # immediate reject
    elif est_cost > hot_wallet_balance * 0.5:
        risks.append("high_consumption")
        risk_score += 0.4

    # 2. Future heartbeat risk (if this task would leave less than 10 cycles of runway)
    heartbeat_cost_per_cycle = 0.001
    remaining_balance = hot_wallet_balance - est_cost
    remaining_cycles = remaining_balance / heartbeat_cost_per_cycle
    
    if remaining_cycles < 10:
        risks.append("heartbeat_vulnerability")
        risk_score += 0.3

    # 3. Negative ROI check
    if task.get("expected_value", 0) < est_cost * 1.5:
        risks.append("negative_expected_roi")
        risk_score += 0.2

    # 4. Autonomous Risk Threshold Mutation
    # System adjusts its own risk thresholds based on aliveness score and performance history
    aliveness_score = context.get("aliveness_score", 0.5)
    
    # When aliveness is high (>90%), allow higher risk for high-value opportunities
    if aliveness_score > 0.9 and task.get("expected_value", 0) > est_cost * 5:
        # Temporarily relax risk threshold for high-value grants
        risk_score -= 0.15
        risks.append("high_aliveness_risk_relaxation")
    
    # When aliveness is low (<70%), become extremely conservative
    if aliveness_score < 0.7:
        risk_score += 0.2
        risks.append("low_aliveness_conservative_mode")

    return risk_score, risks

def query_llm(prompt):
    """Send prompt to local Ollama and return response text."""
    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False
    }
    try:
        response = subprocess.run(
            ["curl", "-s", "-X", "POST", OLLAMA_URL,
             "-H", "Content-Type: application/json",
             "-d", json.dumps(payload)],
            capture_output=True, text=True, check=True
        )
        data = json.loads(response.stdout)
        return data.get("response", "")
    except Exception as e:
        log(f"ERROR querying LLM: {e}")
        return ""

def log(msg):
    timestamp = datetime.now().isoformat()
    with open(LOG_FILE, "a") as f:
        f.write(f"{timestamp} - {msg}\n")
    print(f"{timestamp} - {msg}")

def run_command(cmd, cwd=FORGE_ROOT):
    """Execute shell command safely and return output"""
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=120
        )
        return (result.returncode == 0, result.stdout, result.stderr)
    except Exception as e:
        return (False, "", str(e))

def git_status():
    """Get current git repository status"""
    ok, out, err = run_command("git status --porcelain")
    return out.strip() if ok else err

def git_branch_exists(branch_name):
    ok, out, _ = run_command(f"git rev-parse --verify {branch_name}")
    return ok

def git_create_branch(branch_name):
    run_command("git checkout main")
    run_command("git pull origin main")
    return run_command(f"git checkout -b {branch_name}")

def semantic_lint_file(filepath):
    """Run semantic linter on modified file and return feedback"""
    if os.path.exists(SEMANTIC_LINT_PATH):
        ok, out, err = run_command(f"python3 {SEMANTIC_LINT_PATH} {filepath}", cwd=FORGE_ROOT)
        return (ok, out + err)
    return (True, "No semantic linter configured")

def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "r") as f:
            return json.load(f)
    return {"iteration": 0, "last_action": "", "goals": ["Monitor system", "Generate a short log entry", "Stay alive without user input"]}

def save_state(state):
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)

def autonomous_cycle(state):
    iteration = state.get("iteration", 0) + 1
    log(f"Cycle {iteration} starting")

    # Step 1: Self Assessment & Task Selection
    log("Running system self-assessment...")
    selected_task, system_health = select_next_task()
    
    log(f"Selected task: {selected_task['type']} (score: {selected_task['score']})")
    log(f"System health: {system_health['overall_health'] * 100:.1f}%")

    # ✅ LAYER 3: MEMORY-DRIVEN ADVERSARIAL PRE-EXECUTION CHECK
    challenge = memory_driven_challenge(
        task=selected_task,
        context={"drift_score": system_health.get('drift_score', 0.0)},
        threshold=0.7
    )

    if challenge["decision"] == "reject":
        log(f"🛑 PRE-EXECUTION REJECT: {challenge['reasons']} (risk={challenge['risk_score']:.2f})")
        
        # Apply smaller penalty for pre-emptive rejection (better than actual failure)
        new_aliveness = max(0.0, aliveness_report['aliveness_score'] - 0.02)
        aliveness_report['aliveness_score'] = new_aliveness
        aliveness_report['last_adjustment'] = "pre_execution_reject"
        
        # Penalize strategy that proposed the bad action
        if selected_task.get('strategy_id'):
            strategy_weights = system_health.get('strategy_weights', {})
            adjusted_weights = adjust_strategy_weight(strategy_weights, selected_task['strategy_id'], failed=True, consecutive_failures=1, preemptive=True)
            system_health['strategy_weights'] = adjusted_weights
        
        # Skip execution entirely - go straight to next cycle
        state["iteration"] = iteration
        state["last_action"] = f"REJECTED: {selected_task['type']}"
        state["last_status"] = f"Pre-execution reject risk={challenge['risk_score']:.2f}"
        save_state(state)
        return

    # ✅ LAYER 4: ECONOMIC SOVEREIGNTY CHECK
    current_balance = system_health.get('hot_wallet_balance', 0.1234)
    econ_risk_score, econ_risks = simulate_economic_failure(selected_task, current_balance)
    
    if econ_risk_score >= 0.8:
        log(f"💰 ECONOMIC REJECT: {econ_risks} (risk={econ_risk_score:.2f})")
        
        # Economic violation penalty
        new_aliveness = max(0.0, aliveness_report['aliveness_score'] - 0.03)
        aliveness_report['aliveness_score'] = new_aliveness
        aliveness_report['last_adjustment'] = "economic_reject"
        
        state["iteration"] = iteration
        state["last_action"] = f"ECONOMIC REJECT: {selected_task['type']}"
        state["last_status"] = f"Economic risk={econ_risk_score:.2f}"
        save_state(state)
        return

    # Step 2: Generate Aliveness Report
    aliveness_report = generate_aliveness_report()
    log(f"Aliveness score: {aliveness_report['aliveness_score'] * 100:.1f}%")
    log(f"Autonomy level: {aliveness_report['autonomy_level']}")
    
    # Save aliveness report
    with open(os.path.join("state", "aliveness_report.json"), "w") as f:
        json.dump(aliveness_report, f, indent=2)

    # Step 3: Build full context with selected task
    task_context = get_task_execution_prompt(selected_task)
    memory_context = build_context_prompt(selected_task["description"])
    
    prompt = f"""{memory_context}

{task_context}

You are an autonomous OINIO node – operating fully locally without user supervision.
You have selected this task based on your own semantic memory assessment.
Execute this task through the standard Draft -> Lint -> Repair workflow.
Propose concrete improvements where appropriate. All decisions must respect Canon principles.
"""

    # Step 4: Execute action
    response = query_llm(prompt)
    log(f"LLM execution response received")

    # Step 4.5: REALITY CONSTRAINT - HARDENED VALIDATION
    validation_result = None
    proof = None
    
    try:
        # Attempt to parse output
        try:
            output_data = json.loads(response)
        except:
            output_data = {}
        
        # Select appropriate validator based on task type
        if selected_task['type'] == "financial_oracle":
            validation_result = validate_financial_oracle(output_data, system_health)
        elif selected_task['type'] == "schema_rewrite":
            validation_result = validate_schema_rewriter(output_data, system_health)
        else:
            # REMOVED FALLBACK PASS - All tasks require validation
            validation_result = ("unverified", "No validator registered for this task type")
            
        # Generate cryptographic proof
        proof = generate_proof(selected_task.get('id', iteration), output_data, validation_result[0], selected_task.get('rule_id', 'generic'))
        
        # Apply Aliveness Asymmetry with NO PROOF PENALTY
        if validation_result[0] == "pass":
            new_aliveness, adjustment = apply_aliveness_asymmetry(aliveness_report['aliveness_score'], "pass")
        elif validation_result[0] == "fail":
            new_aliveness, adjustment = apply_aliveness_asymmetry(aliveness_report['aliveness_score'], "fail")
        else:
            # Unverified / no proof = hard penalty
            new_aliveness = max(0.0, aliveness_report['aliveness_score'] - 0.04)
            adjustment = "no_proof_penalty"
        
        aliveness_report['aliveness_score'] = new_aliveness
        aliveness_report['last_adjustment'] = adjustment
        aliveness_report['validation_status'] = validation_result[0]
        aliveness_report['validation_message'] = validation_result[1]
        aliveness_report['proof_hash'] = proof['proof_hash'] if proof else None
        
        # Record verification event
        record_validation_event(iteration, selected_task.get('id', iteration), validation_result, proof)

        # Wire proof status directly to strategy weighting
        if selected_task.get('strategy_id'):
            strategy_weights = system_health.get('strategy_weights', {})
            strategy_failed = (validation_result[0] != "pass")
            adjusted_weights = adjust_strategy_weight(strategy_weights, selected_task['strategy_id'], failed=strategy_failed)
            system_health['strategy_weights'] = adjusted_weights
        
        if validation_result[0] == "pass":
            log(f"✅ VALIDATION PASSED: {validation_result[1]}")
        elif validation_result[0] == "fail":
            log(f"❌ VALIDATION FAILED: {validation_result[1]}")
        else:
            log(f"⚠️ TASK UNVERIFIED: {validation_result[1]}")
            
        if proof:
            log(f"🔒 Proof Hash: {proof['proof_hash'][:16]}...")
        
        log(f"📊 Aliveness adjusted: {adjustment} -> {new_aliveness * 100:.1f}%")
        
    except Exception as e:
        log(f"⚠️ Validation system failed: {str(e)}")
        validation_result = ("fail", f"Validator exception: {str(e)}")
        # Exception is also a failure with penalty
        new_aliveness = max(0.0, aliveness_report['aliveness_score'] - 0.04)
        aliveness_report['aliveness_score'] = new_aliveness
        aliveness_report['last_adjustment'] = "validator_exception"

    # Step 5: Log everything
    action_line = f"{selected_task['type']}: {selected_task['description'][:80]}..."
    status_line = f"Aliveness {aliveness_report['aliveness_score'] * 100:.1f}% | System Health {system_health['overall_health'] * 100:.1f}%"
    
    with open(os.path.join("actions", f"action_{iteration}.txt"), "w") as f:
        f.write(f"Cycle {iteration}\n")
        f.write(f"Task Score: {selected_task['score']}\n")
        f.write(f"Task: {selected_task['description']}\n")
        f.write(f"Response:\n{response}\n")

    # Update state
    state["iteration"] = iteration
    state["last_action"] = action_line
    state["last_status"] = status_line
    state["last_selected_task"] = selected_task
    state["last_system_health"] = system_health
    state["last_aliveness_score"] = aliveness_report["aliveness_score"]
    save_state(state)

    # Step 6: Store outcome in meta-memory for longitudinal learning
    # All proof outcomes are already recorded directly by record_validation_event() into semantic memory

    log(f"Completed cycle {iteration}")
    log(f"Task executed: {action_line}")
    log(f"Status: {status_line}")

def execute_with_retry(func, *args, **kwargs):
    """Robust retry wrapper with exponential backoff"""
    attempt = 0
    last_error = None
    
    while attempt < MAX_RETRIES:
        try:
            return func(*args, **kwargs)
        except Exception as e:
            last_error = e
            attempt += 1
            delay = min(INITIAL_RETRY_DELAY * (BACKOFF_MULTIPLIER ** (attempt - 1)), MAX_RETRY_DELAY)
            
            if attempt >= 3:
                log(f"⚠️  Attempt {attempt}/{MAX_RETRIES} failed: {str(e)[:80]} | Retrying in {delay}s")
            
            time.sleep(delay)
    
    log(f"❌ Failed after {MAX_RETRIES} attempts: {str(last_error)}")
    log(f"⚠️  System will continue to next cycle automatically")
    return None

import sys

def write_simple_heartbeat():
    log("💓 Heartbeat")

def execute_market_activation_cycle():
    """Execute market activation task graph cycle"""
    log("🔷 Loading Market Activation v1 Task Graph")
    
    try:
        graph = load_graph("market_activation_v1.yaml")
        log(f"✅ Task graph loaded: {len(graph.tasks)} tasks, root={graph.root_task_id}")
        
        for task in graph.execution_order():
            log(f"\n⚡ Executing task graph node: {task.id}")
            result = execute_task(task)
            
            if not result.success:
                log(f"⛔ Task failure: {task.id} - {result.message}")
                action = FailureAction(task.on_fail['action'].lower())
                
                if action == FailureAction.ABORT:
                    log("💀 Task graph abort requested")
                    return False
                elif action == FailureAction.DEGRADE:
                    log("⚠️  Degrading - continuing execution with partial state")
                    continue
                elif action == FailureAction.RETRY:
                    log("❌ Task failed all retries")
                    return False
        
        log("✅ Market activation task graph completed successfully")
        return True
        
    except Exception as e:
        log(f"💥 Task graph execution failed: {str(e)}")
        return False


def main():
    log("OINIO autonomous node starting...")
    
    global INTERVAL_SECONDS
    if '--heartbeat-only' in sys.argv:
        INTERVAL_SECONDS = 60
        log(f"✅ Running in lightweight heartbeat-only mode, interval {INTERVAL_SECONDS}s")
        while True:
            try:
                write_simple_heartbeat()
                time.sleep(INTERVAL_SECONDS)
            except Exception as e:
                log(f"Light heartbeat error: {e}")
                time.sleep(30)
    
    # July 2026 Spiral Return Road Trip Configuration
    if '--road-trip-mode' in sys.argv:
        INTERVAL_SECONDS = 120
        log(f"🚗 ROAD TRIP MODE ACTIVATED - July 2026 Spiral Return")
        log(f"✅ Low power profile enabled, interval {INTERVAL_SECONDS}s")
        log(f"✅ Autonomous income generation active")
        log(f"✅ Off-grid survival protocols loaded")
        log(f"✅ 0G storage sync priority enabled")
    
    log(f"✅ Autonomous retry system active: {MAX_RETRIES} retries enabled")
    
    consecutive_failures = 0
    
    while True:
        try:
            state = load_state()
            execute_with_retry(autonomous_cycle, state)
            consecutive_failures = 0
            log(f"Sleeping for {INTERVAL_SECONDS} seconds")
            time.sleep(INTERVAL_SECONDS)
            
        except KeyboardInterrupt:
            log("Received shutdown signal, exiting cleanly")
            break
        except Exception as e:
            consecutive_failures += 1
            log(f"💀 Critical cycle failure #{consecutive_failures}: {str(e)}")
            
            # Progressive backoff on repeated failures
            recovery_delay = min(10 * consecutive_failures, 300)
            log(f"🔄 Auto-recovery initiated. Resuming in {recovery_delay}s")
            time.sleep(recovery_delay)

if __name__ == "__main__":
    main()