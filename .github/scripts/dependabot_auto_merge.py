#!/usr/bin/env python3
"""
Dependabot Auto-Merge Gate Script

This script validates gating conditions and merges eligible Dependabot PRs.
It supports:
- CODEOWNERS parsing with team membership checks
- Check-run and workflow run freshness verification
- Caching of team membership data
- PR merge via REST API
"""

import argparse
import hashlib
import json
import os
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Optional

import requests

# Constants
GITHUB_API_URL = "https://api.github.com"
CACHE_DIR = Path("/tmp/dependabot-auto-merge-cache")


def get_github_token() -> str:
    """Get GitHub token, preferring REPO_MERGE_TOKEN over GITHUB_TOKEN."""
    token = os.environ.get("REPO_MERGE_TOKEN") or os.environ.get("GITHUB_TOKEN")
    if not token:
        print("::error::No GitHub token found. Set REPO_MERGE_TOKEN or GITHUB_TOKEN.")
        sys.exit(1)
    return token


def github_request(
    method: str,
    endpoint: str,
    token: str,
    data: Optional[dict] = None,
    params: Optional[dict] = None,
) -> requests.Response:
    """Make a request to the GitHub API."""
    url = f"{GITHUB_API_URL}{endpoint}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    response = requests.request(
        method, url, headers=headers, json=data, params=params, timeout=30
    )
    return response


def get_pr_details(repo: str, pr_number: int, token: str) -> dict:
    """Fetch PR details from GitHub API."""
    response = github_request("GET", f"/repos/{repo}/pulls/{pr_number}", token)
    if response.status_code != 200:
        print(f"::error::Failed to fetch PR details: {response.status_code}")
        sys.exit(1)
    return response.json()


def is_dependabot_pr(pr_data: dict) -> bool:
    """Check if the PR is created by Dependabot."""
    user = pr_data.get("user", {})
    login = user.get("login", "").lower()
    return login in ("dependabot[bot]", "dependabot")


def has_required_label(pr_data: dict, required_label: str) -> bool:
    """Check if the PR has the required label."""
    labels = pr_data.get("labels", [])
    return any(label.get("name") == required_label for label in labels)


def parse_codeowners(repo: str, token: str, pr_base_ref: str) -> list[str]:
    """Parse CODEOWNERS file and return list of owners (usernames and teams)."""
    # Try common CODEOWNERS locations
    locations = [".github/CODEOWNERS", "CODEOWNERS", "docs/CODEOWNERS"]
    
    for location in locations:
        response = github_request(
            "GET",
            f"/repos/{repo}/contents/{location}",
            token,
            params={"ref": pr_base_ref},
        )
        if response.status_code == 200:
            content_data = response.json()
            if content_data.get("encoding") == "base64":
                import base64
                content = base64.b64decode(content_data["content"]).decode("utf-8")
                return extract_owners_from_codeowners(content)
    
    print("::warning::No CODEOWNERS file found.")
    return []


def extract_owners_from_codeowners(content: str) -> list[str]:
    """Extract unique owners from CODEOWNERS file content."""
    owners = set()
    for line in content.splitlines():
        line = line.strip()
        # Skip comments and empty lines
        if not line or line.startswith("#"):
            continue
        # Split line into parts (path + owners)
        parts = line.split()
        # Skip the first part (path pattern), rest are owners
        for part in parts[1:]:
            if part.startswith("@"):
                owners.add(part[1:])  # Remove @ prefix
    return list(owners)


def get_cache_path(key: str) -> Path:
    """Get cache file path for a given key."""
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    hash_key = hashlib.sha256(key.encode()).hexdigest()[:16]
    return CACHE_DIR / f"{hash_key}.json"


def get_cached_data(key: str, ttl_seconds: int) -> Optional[dict]:
    """Get cached data if it exists and is not expired."""
    cache_path = get_cache_path(key)
    if not cache_path.exists():
        return None
    
    try:
        with open(cache_path) as f:
            cached = json.load(f)
        
        cached_time = datetime.fromisoformat(cached["timestamp"])
        # Ensure cached_time is timezone-aware for comparison
        if cached_time.tzinfo is None:
            cached_time = cached_time.replace(tzinfo=timezone.utc)
        if datetime.now(timezone.utc) - cached_time < timedelta(seconds=ttl_seconds):
            return cached["data"]
    except (json.JSONDecodeError, KeyError, ValueError, TypeError):
        pass
    
    return None


def set_cached_data(key: str, data: dict) -> None:
    """Cache data with timestamp."""
    cache_path = get_cache_path(key)
    with open(cache_path, "w") as f:
        json.dump(
            {"timestamp": datetime.now(timezone.utc).isoformat(), "data": data}, f
        )


def get_team_members(org: str, team_slug: str, token: str, cache_ttl: int) -> list[str]:
    """Get members of a GitHub team with caching."""
    cache_key = f"team_members:{org}:{team_slug}"
    cached = get_cached_data(cache_key, cache_ttl)
    if cached is not None:
        return cached
    
    members = []
    page = 1
    while True:
        response = github_request(
            "GET",
            f"/orgs/{org}/teams/{team_slug}/members",
            token,
            params={"per_page": 100, "page": page},
        )
        if response.status_code != 200:
            print(f"::warning::Failed to fetch team members for {org}/{team_slug}: {response.status_code}")
            break
        
        page_members = response.json()
        if not page_members:
            break
        
        members.extend([m["login"] for m in page_members])
        page += 1
    
    set_cached_data(cache_key, members)
    return members


def expand_codeowners_to_users(
    owners: list[str], token: str, cache_ttl: int
) -> list[str]:
    """Expand CODEOWNERS (including teams) to individual usernames."""
    users = set()
    
    for owner in owners:
        if "/" in owner:
            # This is a team reference (org/team)
            parts = owner.split("/")
            if len(parts) == 2:
                org, team_slug = parts
                team_members = get_team_members(org, team_slug, token, cache_ttl)
                users.update(team_members)
        else:
            # This is a username
            users.add(owner)
    
    return list(users)


def get_pr_reviews(repo: str, pr_number: int, token: str) -> list[dict]:
    """Get all reviews for a PR."""
    reviews = []
    page = 1
    while True:
        response = github_request(
            "GET",
            f"/repos/{repo}/pulls/{pr_number}/reviews",
            token,
            params={"per_page": 100, "page": page},
        )
        if response.status_code != 200:
            print(f"::error::Failed to fetch reviews: {response.status_code}")
            sys.exit(1)
        
        page_reviews = response.json()
        if not page_reviews:
            break
        
        reviews.extend(page_reviews)
        page += 1
    
    return reviews


def count_codeowner_approvals(
    reviews: list[dict], codeowner_users: list[str]
) -> int:
    """Count approvals from CODEOWNERS."""
    # Track the latest review state per user
    user_states = {}
    
    for review in reviews:
        user = review.get("user", {}).get("login")
        state = review.get("state")
        submitted_at = review.get("submitted_at")
        
        if user and state and submitted_at:
            if user not in user_states or submitted_at > user_states[user]["submitted_at"]:
                user_states[user] = {"state": state, "submitted_at": submitted_at}
    
    # Count approvals from codeowner users
    approvals = 0
    for user in codeowner_users:
        if user in user_states and user_states[user]["state"] == "APPROVED":
            approvals += 1
            print(f"::notice::Approval from CODEOWNER: {user}")
    
    return approvals


def get_check_runs(repo: str, ref: str, token: str) -> list[dict]:
    """Get check runs for a commit ref."""
    check_runs = []
    page = 1
    while True:
        response = github_request(
            "GET",
            f"/repos/{repo}/commits/{ref}/check-runs",
            token,
            params={"per_page": 100, "page": page},
        )
        if response.status_code != 200:
            print(f"::error::Failed to fetch check runs: {response.status_code}")
            sys.exit(1)
        
        data = response.json()
        page_runs = data.get("check_runs", [])
        if not page_runs:
            break
        
        check_runs.extend(page_runs)
        page += 1
    
    return check_runs


def verify_required_checks(
    check_runs: list[dict],
    required_checks: list[str],
    freshness_hours: int,
) -> bool:
    """Verify that required checks have passed and are fresh."""
    now = datetime.now(timezone.utc)
    freshness_threshold = now - timedelta(hours=freshness_hours)
    
    for required_check in required_checks:
        required_check = required_check.strip()
        if not required_check:
            continue
        
        # Find matching check run
        matching_runs = [
            run for run in check_runs
            if run.get("name") == required_check
        ]
        
        if not matching_runs:
            print(f"::error::Required check '{required_check}' not found.")
            return False
        
        # Get the latest run
        latest_run = max(
            matching_runs,
            key=lambda r: r.get("completed_at") or r.get("started_at") or "",
        )
        
        # Check status and conclusion
        status = latest_run.get("status")
        conclusion = latest_run.get("conclusion")
        
        if status != "completed":
            print(f"::error::Required check '{required_check}' is not completed (status: {status}).")
            return False
        
        if conclusion != "success":
            print(f"::error::Required check '{required_check}' did not succeed (conclusion: {conclusion}).")
            return False
        
        # Check freshness
        completed_at_str = latest_run.get("completed_at")
        if completed_at_str:
            # Parse ISO 8601 format; handle both 'Z' and '+00:00' timezone suffixes
            try:
                completed_at = datetime.fromisoformat(completed_at_str.replace("Z", "+00:00"))
            except ValueError:
                # Fallback: try parsing without timezone modification
                completed_at = datetime.fromisoformat(completed_at_str)
                if completed_at.tzinfo is None:
                    completed_at = completed_at.replace(tzinfo=timezone.utc)
            if completed_at < freshness_threshold:
                print(f"::error::Required check '{required_check}' is stale (completed at {completed_at_str}, threshold: {freshness_hours} hours).")
                return False
        
        print(f"::notice::Required check '{required_check}' passed and is fresh.")
    
    return True


def merge_pr(repo: str, pr_number: int, token: str, merge_method: str) -> bool:
    """Merge the PR using the specified method."""
    response = github_request(
        "PUT",
        f"/repos/{repo}/pulls/{pr_number}/merge",
        token,
        data={"merge_method": merge_method},
    )
    
    if response.status_code == 200:
        print(f"::notice::PR #{pr_number} merged successfully using '{merge_method}' method.")
        return True
    else:
        try:
            error_data = response.json()
            error_message = error_data.get('message', 'Unknown error')
        except (ValueError, json.JSONDecodeError):
            error_message = response.text or 'Unknown error'
        print(f"::error::Failed to merge PR: {response.status_code} - {error_message}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Dependabot Auto-Merge Gate")
    parser.add_argument("--repo", required=True, help="Repository (owner/repo)")
    parser.add_argument("--pr", type=int, required=True, help="PR number")
    parser.add_argument("--required-label", default="dependencies", help="Required label")
    parser.add_argument("--required-checks", default="", help="Comma-separated required checks")
    parser.add_argument("--freshness-hours", type=int, default=12, help="Freshness window in hours")
    parser.add_argument("--required-approvals", type=int, default=1, help="Required CODEOWNER approvals")
    parser.add_argument("--merge-method", default="squash", choices=["merge", "squash", "rebase"], help="Merge method")
    parser.add_argument("--cache-ttl", type=int, default=86400, help="Cache TTL in seconds")
    
    args = parser.parse_args()
    
    print(f"::group::Dependabot Auto-Merge Gate for PR #{args.pr}")
    
    token = get_github_token()
    
    # Fetch PR details
    print("Fetching PR details...")
    pr_data = get_pr_details(args.repo, args.pr, token)
    
    # Check if PR is from Dependabot
    if not is_dependabot_pr(pr_data):
        print("::notice::PR is not from Dependabot. Skipping auto-merge.")
        print("::endgroup::")
        sys.exit(0)
    
    print("✓ PR is from Dependabot")
    
    # Check for required label
    if args.required_label and not has_required_label(pr_data, args.required_label):
        print(f"::notice::PR does not have required label '{args.required_label}'. Skipping auto-merge.")
        print("::endgroup::")
        sys.exit(0)
    
    print(f"✓ PR has required label '{args.required_label}'")
    
    # Parse CODEOWNERS
    pr_base_ref = pr_data.get("base", {}).get("ref", "main")
    codeowners = parse_codeowners(args.repo, token, pr_base_ref)
    print(f"Found {len(codeowners)} CODEOWNERS entries")
    
    # Expand teams to users
    codeowner_users = expand_codeowners_to_users(codeowners, token, args.cache_ttl)
    print(f"Expanded to {len(codeowner_users)} unique users")
    
    # Get and count approvals
    reviews = get_pr_reviews(args.repo, args.pr, token)
    approvals = count_codeowner_approvals(reviews, codeowner_users)
    print(f"CODEOWNER approvals: {approvals}/{args.required_approvals}")
    
    if approvals < args.required_approvals:
        print(f"::warning::Insufficient CODEOWNER approvals ({approvals}/{args.required_approvals}). Cannot auto-merge.")
        print("::endgroup::")
        sys.exit(0)
    
    print(f"✓ Has sufficient CODEOWNER approvals ({approvals}/{args.required_approvals})")
    
    # Verify required checks
    if args.required_checks:
        required_checks = [c.strip() for c in args.required_checks.split(",") if c.strip()]
        head_sha = pr_data.get("head", {}).get("sha")
        
        if head_sha:
            check_runs = get_check_runs(args.repo, head_sha, token)
            if not verify_required_checks(check_runs, required_checks, args.freshness_hours):
                print("::error::Required checks validation failed. Cannot auto-merge.")
                print("::endgroup::")
                sys.exit(1)
            print("✓ All required checks passed and are fresh")
        else:
            print("::warning::Could not determine PR head SHA. Skipping check verification.")
    
    # Merge the PR
    print(f"Attempting to merge PR #{args.pr} using '{args.merge_method}' method...")
    if merge_pr(args.repo, args.pr, token, args.merge_method):
        print("✓ PR merged successfully!")
        print("::endgroup::")
        sys.exit(0)
    else:
        print("::endgroup::")
        sys.exit(1)


if __name__ == "__main__":
    main()
