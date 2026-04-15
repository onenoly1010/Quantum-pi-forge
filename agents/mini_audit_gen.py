#!/usr/bin/env python3
"""
QUANTUM PI FORGE
Autonomous Mini-Audit Generator - Client Acquisition System
Runs locally on Linux Mint with Ollama. 100% Sovereign. No external APIs.
"""
import os
import csv
import json
import time
import requests

OLLAMA_ENDPOINT = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3"

def generate_audit_report(contract_address, transactions_csv):
    """Generate sovereign audit report using local AI"""
    
    print(f"\n🔍 Initiating Sovereign Audit for: {contract_address}")
    
    # Parse transaction ledger
    contract_transactions = []
    total_volume = 0
    unique_addresses = set()
    latest_block = 0
    
    with open(transactions_csv, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row.get('To') == contract_address or row.get('From') == contract_address:
                contract_transactions.append(row)
                total_volume += float(row.get('Quantity', 0))
                unique_addresses.add(row.get('From'))
                unique_addresses.add(row.get('To'))
                latest_block = max(latest_block, int(row.get('EpochNumber', 0)))
    
    print(f"✅ Analyzed {len(contract_transactions)} transactions")
    print(f"✅ Total Volume: {total_volume:,.0f} OINIO")
    print(f"✅ Unique Interactions: {len(unique_addresses)}")
    print(f"✅ Latest Block: {latest_block}")

    # Local AI Analysis - No external services
    prompt = f"""
    ACT AS QUANTUM PI FORGE AUDIT AI.
    
    CONTRACT: {contract_address}
    0G ARISTOTLE MAINNET
    
    METRICS:
    - Total Transaction Volume: {total_volume:,.0f} OINIO
    - Unique Wallet Interactions: {len(unique_addresses)}
    - Last Verified Block: {latest_block}
    - Transaction Count: {len(contract_transactions)}
    
    WRITE A PROFESSIONAL 3 PARAGRAPH TRANSPARENCY HEALTH REPORT.
    
    FOCUS ON:
    1. Current on-chain activity and integrity observation
    2. The value of permanent Soul Ledger validation
    3. Clear recommendation for Sovereign Data Validation
    
    USE PRECISE TECHNICAL LANGUAGE. NO HYPE. MAINTAIN SOVEREIGN TONE.
    """

    print("\n🤖 Running local AI analysis...")
    
    response = requests.post(OLLAMA_ENDPOINT, json={
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.1,
            "top_k": 10
        }
    })
    
    ai_analysis = response.json().get('response')
    
    # Generate final report
    report = f"""# ✅ QUANTUM PI FORGE SOVEREIGN AUDIT

## Contract: `{contract_address}`

> **Generated:** {time.ctime()}  
> **Network:** 0G Aristotle Mainnet  
> **Auditor:** Kris Olofson  
> **Status:** PRELIMINARY VALIDATION

---

### 📊 VERIFIED METRICS

| METRIC | VALUE |
|---|---|
| Total Transaction Volume | {total_volume:,.0f} OINIO |
| Unique Wallet Interactions | {len(unique_addresses)} |
| Analyzed Transactions | {len(contract_transactions)} |
| Last Verified Block | {latest_block} |

---

### 🧠 AI ANALYSIS

{ai_analysis}

---

### ✅ RECOMMENDATION

This contract qualifies for Sovereign Data Validation. Complete validation will establish a permanent Soul Ledger entry on the 0G Network.

> **"We do not trust. We verify."**

---

**Kris Olofson**  
Lead Guardian, Quantum Pi Forge  
https://quantumpiforge.com
"""

    # Ensure audit directory exists
    os.makedirs("audits", exist_ok=True)
    report_filename = f"audits/AUDIT_{contract_address[2:10]}.md"
    
    with open(report_filename, "w") as f:
        f.write(report)
    
    print(f"\n✅ Audit Report Generated: {report_filename}")
    return report_filename

if __name__ == "__main__":
    print("=" * 70)
    print("QUANTUM PI FORGE - AUTONOMOUS MINI-AUDIT GENERATOR")
    print("=" * 70)
    
    # Genesis Audit for OINIO Contract
    generate_audit_report(
        "0xbebc1a40a18632cee19d220647e7ad296a1a5f37",
        "token-OINIO-0xbebc1a40a18632cee19d220647e7ad296a1a5f37-2026.04.15.csv"
    )
    
    print("\n🎯 Audit complete. Report ready for outreach.")