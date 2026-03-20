import os
import requests
from typing import Optional, Dict

def send_slack_alert(message: str) -> bool:
    """Send a plain-text message to Slack via webhook."""
    url = os.getenv("GUARDIAN_SLACK_WEBHOOK_URL")
    if not url:
        print("[GuardianAlert] Slack webhook URL not configured.")
        return False
    payload = {"text": message}
    try:
        resp = requests.post(url, json=payload, timeout=10)
        print(f"[GuardianAlert] Slack response: {resp.status_code}")
        return resp.ok
    except Exception as e:
        print(f"[GuardianAlert] Slack error: {e}")
        return False

def send_mailgun_email(subject: str, text: str, recipient: str) -> bool:
    """Send alert email using Mailgun API."""
    domain = os.getenv("MAILGUN_DOMAIN")
    key = os.getenv("MAILGUN_API_KEY")
    sender = os.getenv("MAILGUN_FROM", f"guardian@{domain}" if domain else "")
    if not (domain and key and sender):
        print("[GuardianAlert] Mailgun config missing.")
        return False
    url = f"https://api.mailgun.net/v3/{domain}/messages"
    data = {
        "from": sender,
        "to": recipient,
        "subject": subject,
        "text": text
    }
    try:
        resp = requests.post(url, auth=("api", key), data=data, timeout=10)
        print(f"[GuardianAlert] Mailgun response: {resp.status_code}")
        return resp.ok
    except Exception as e:
        print(f"[GuardianAlert] Mailgun error: {e}")
        return False

def send_sendgrid_email(subject: str, text: str, recipient: str) -> bool:
    """Send alert email using SendGrid API."""
    api_key = os.getenv("SENDGRID_API_KEY")
    sender = os.getenv("SENDGRID_FROM")
    if not (api_key and sender):
        print("[GuardianAlert] SendGrid config missing.")
        return False
    url = "https://api.sendgrid.com/v3/mail/send"
    data = {
        "personalizations": [{"to": [{"email": recipient}]}],
        "from": {"email": sender},
        "subject": subject,
        "content": [{"type": "text/plain", "value": text}],
    }
    try:
        resp = requests.post(url, headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }, json=data, timeout=10)
        print(f"[GuardianAlert] SendGrid response: {resp.status_code}")
        return resp.ok
    except Exception as e:
        print(f"[GuardianAlert] SendGrid error: {e}")
        return False

def send_webhook_alert(payload: Dict, url: Optional[str] = None) -> bool:
    """Send payload to a generic webhook (e.g., Discord, OpsGenie, custom)."""
    target_url = url or os.getenv("GUARDIAN_ALERT_WEBHOOK_URL")
    if not target_url:
        print("[GuardianAlert] Webhook URL not set.")
        return False
    try:
        resp = requests.post(target_url, json=payload, timeout=10)
        print(f"[GuardianAlert] Webhook response: {resp.status_code}")
        return resp.ok
    except Exception as e:
        print(f"[GuardianAlert] Webhook error: {e}")
        return False

def send_alert(
    kind: str,
    message: str = "",
    subject: str = "",
    recipient: str = "",
    payload: Optional[Dict] = None,
    webhook_url: str = "",
) -> bool:
    """Main dispatcher: kind = 'slack'|'mailgun'|'sendgrid'|'webhook'."""
    kind = kind.lower()
    if kind == "slack":
        return send_slack_alert(message)
    elif kind == "mailgun":
        if recipient and subject and message:
            return send_mailgun_email(subject, message, recipient)
    elif kind == "sendgrid":
        if recipient and subject and message:
            return send_sendgrid_email(subject, message, recipient)
    elif kind == "webhook":
        return send_webhook_alert(payload or {"text": message}, url=webhook_url)
    print(f"[GuardianAlert] Unhandled alert kind: {kind}")
    return False
