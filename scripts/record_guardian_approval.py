#!/usr/bin/env python3
"""
Guardian Approval Recording Script
Records guardian approvals for autonomous deployment decisions.
"""

import sys
import os
import argparse
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from server.guardian_approvals import get_approval_system


def record_approval(
    decision_id: str,
    decision_type: str = "deployment",
    guardian_id: str = "guardian",
    action: str = "approve",
    reasoning: str = "Manual guardian approval",
    priority: str = "high",
    confidence: float = 0.76
):
    """
    Record a guardian approval
    
    Args:
        decision_id: Decision ID to approve
        decision_type: Type of decision
        guardian_id: Guardian identifier
        action: approve, reject, or modify
        reasoning: Reasoning for the action
        priority: Priority level
        confidence: Confidence score
    """
    approval_system = get_approval_system()
    
    approval = approval_system.record_approval(
        decision_id=decision_id,
        decision_type=decision_type,
        guardian_id=guardian_id,
        action=action,
        reasoning=reasoning,
        priority=priority,
        confidence=confidence,
        metadata={
            "recorded_via": "cli_script",
            "timestamp_human": datetime.now().isoformat()
        }
    )
    
    print(f"✅ Guardian approval recorded:")
    print(f"   Approval ID: {approval.approval_id}")
    print(f"   Decision ID: {approval.decision_id}")
    print(f"   Action: {approval.action}")
    print(f"   Guardian: {approval.guardian_id}")
    print(f"   Reasoning: {approval.reasoning}")
    print(f"   Timestamp: {datetime.fromtimestamp(approval.timestamp).isoformat()}")
    
    return approval


def check_approval(decision_id: str):
    """Check if a decision is approved"""
    approval_system = get_approval_system()
    
    approval = approval_system.get_approval(decision_id)
    is_approved = approval_system.is_approved(decision_id)
    
    if approval:
        print(f"✅ Decision {decision_id} is approved:")
        print(f"   Approval ID: {approval.approval_id}")
        print(f"   Action: {approval.action}")
        print(f"   Guardian: {approval.guardian_id}")
        print(f"   Reasoning: {approval.reasoning}")
        print(f"   Timestamp: {datetime.fromtimestamp(approval.timestamp).isoformat()}")
    else:
        print(f"❌ Decision {decision_id} has not been approved")
    
    return is_approved


def list_approvals(limit: int = 10):
    """List recent approvals"""
    approval_system = get_approval_system()
    
    approvals = approval_system.get_all_approvals(limit=limit)
    
    if not approvals:
        print("No approvals recorded")
        return
    
    print(f"Recent approvals (showing {len(approvals)}):")
    for approval in approvals:
        timestamp = datetime.fromtimestamp(approval.timestamp).isoformat()
        print(f"  • {approval.approval_id}")
        print(f"    Decision: {approval.decision_id}")
        print(f"    Action: {approval.action}")
        print(f"    Guardian: {approval.guardian_id}")
        print(f"    Type: {approval.decision_type}")
        print(f"    Priority: {approval.priority}")
        print(f"    Time: {timestamp}")
        print()


def show_stats():
    """Show approval statistics"""
    approval_system = get_approval_system()
    stats = approval_system.get_approval_stats()
    
    print("Guardian Approval Statistics:")
    print(f"  Total Approvals: {stats['total']}")
    print(f"  Approved: {stats['approved']}")
    print(f"  Rejected: {stats['rejected']}")
    print(f"  Modified: {stats['modified']}")
    print(f"  Approval Rate: {stats['approval_rate']:.2%}")
    
    if stats['by_type']:
        print("\n  By Decision Type:")
        for decision_type, type_stats in stats['by_type'].items():
            print(f"    {decision_type}:")
            print(f"      Total: {type_stats['total']}")
            print(f"      Approved: {type_stats['approved']}")
            print(f"      Rejected: {type_stats['rejected']}")
            print(f"      Modified: {type_stats['modified']}")


def main():
    parser = argparse.ArgumentParser(
        description="Guardian Approval Recording System",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Record an approval for a deployment decision
  python record_guardian_approval.py record deployment_1734134400000 --guardian onenoly1010 --reasoning "Approved"

  # Check if a decision is approved
  python record_guardian_approval.py check deployment_1734134400000

  # List recent approvals
  python record_guardian_approval.py list

  # Show approval statistics
  python record_guardian_approval.py stats
        """
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Command to execute')
    
    # Record command
    record_parser = subparsers.add_parser('record', help='Record a guardian approval')
    record_parser.add_argument('decision_id', help='Decision ID to approve')
    record_parser.add_argument('--type', default='deployment', help='Decision type')
    record_parser.add_argument('--guardian', default='guardian', help='Guardian ID')
    record_parser.add_argument('--action', default='approve', choices=['approve', 'reject', 'modify'], help='Action')
    record_parser.add_argument('--reasoning', default='Manual guardian approval', help='Reasoning')
    record_parser.add_argument('--priority', default='high', choices=['critical', 'high', 'medium', 'low'], help='Priority')
    record_parser.add_argument('--confidence', type=float, default=0.76, help='Confidence score')
    
    # Check command
    check_parser = subparsers.add_parser('check', help='Check if a decision is approved')
    check_parser.add_argument('decision_id', help='Decision ID to check')
    
    # List command
    list_parser = subparsers.add_parser('list', help='List recent approvals')
    list_parser.add_argument('--limit', type=int, default=10, help='Number of approvals to show')
    
    # Stats command
    stats_parser = subparsers.add_parser('stats', help='Show approval statistics')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    if args.command == 'record':
        record_approval(
            decision_id=args.decision_id,
            decision_type=args.type,
            guardian_id=args.guardian,
            action=args.action,
            reasoning=args.reasoning,
            priority=args.priority,
            confidence=args.confidence
        )
    elif args.command == 'check':
        check_approval(args.decision_id)
    elif args.command == 'list':
        list_approvals(limit=args.limit)
    elif args.command == 'stats':
        show_stats()


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n⚠️  Operation cancelled by user")
        sys.exit(1)
    except PermissionError as e:
        print(f"❌ Permission denied: {e}")
        print("   Try running with appropriate permissions or check directory access")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
