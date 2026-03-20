import fetch from "node-fetch";

export async function sendSlackAlert(message: string): Promise<boolean> {
  const url = process.env.GUARDIAN_SLACK_WEBHOOK_URL;
  if (!url) {
    console.log("[GuardianAlert] Slack webhook URL not configured.");
    return false;
  }
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message }),
    });
    console.log("[GuardianAlert] Slack response:", resp.status);
    return resp.ok;
  } catch (e) {
    console.log("[GuardianAlert] Slack error:", e);
    return false;
  }
}

export async function sendMailgunEmail(
  subject: string,
  text: string,
  recipient: string
): Promise<boolean> {
  const domain = process.env.MAILGUN_DOMAIN;
  const key = process.env.MAILGUN_API_KEY;
  const sender =
    process.env.MAILGUN_FROM || (domain ? `guardian@${domain}` : "");
  if (!domain || !key || !sender) {
    console.log("[GuardianAlert] Mailgun config missing.");
    return false;
  }
  const url = `https://api.mailgun.net/v3/${domain}/messages`;
  const data = new URLSearchParams({
    from: sender,
    to: recipient,
    subject: subject,
    text: text,
  });

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from("api:" + key).toString("base64"),
      },
      body: data,
    });
    console.log("[GuardianAlert] Mailgun response:", resp.status);
    return resp.ok;
  } catch (e) {
    console.log("[GuardianAlert] Mailgun error:", e);
    return false;
  }
}

export async function sendSendgridEmail(
  subject: string,
  text: string,
  recipient: string
): Promise<boolean> {
  const apiKey = process.env.SENDGRID_API_KEY;
  const sender = process.env.SENDGRID_FROM;
  if (!apiKey || !sender) {
    console.log("[GuardianAlert] SendGrid config missing.");
    return false;
  }
  const url = "https://api.sendgrid.com/v3/mail/send";
  const data = {
    personalizations: [{ to: [{ email: recipient }] }],
    from: { email: sender },
    subject,
    content: [{ type: "text/plain", value: text }],
  };
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log("[GuardianAlert] SendGrid response:", resp.status);
    return resp.ok;
  } catch (e) {
    console.log("[GuardianAlert] SendGrid error:", e);
    return false;
  }
}

export async function sendWebhookAlert(
  payload: object,
  url?: string
): Promise<boolean> {
  const targetUrl = url || process.env.GUARDIAN_ALERT_WEBHOOK_URL;
  if (!targetUrl) {
    console.log("[GuardianAlert] Webhook URL not set.");
    return false;
  }
  try {
    const resp = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log("[GuardianAlert] Webhook response:", resp.status);
    return resp.ok;
  } catch (e) {
    console.log("[GuardianAlert] Webhook error:", e);
    return false;
  }
}

type AlertKind = "slack" | "mailgun" | "sendgrid" | "webhook";

interface SendAlertOpts {
  kind: AlertKind;
  message?: string;
  subject?: string;
  recipient?: string;
  payload?: object;
  webhookUrl?: string;
}

export async function sendAlert(opts: SendAlertOpts): Promise<boolean> {
  const kind = opts.kind.toLowerCase();
  if (kind === "slack") {
    return sendSlackAlert(opts.message ?? "");
  } else if (kind === "mailgun") {
    if (opts.recipient && opts.subject && opts.message)
      return sendMailgunEmail(opts.subject, opts.message, opts.recipient);
  } else if (kind === "sendgrid") {
    if (opts.recipient && opts.subject && opts.message)
      return sendSendgridEmail(opts.subject, opts.message, opts.recipient);
  } else if (kind === "webhook") {
    return sendWebhookAlert(opts.payload || { text: opts.message }, opts.webhookUrl);
  }
  console.log("[GuardianAlert] Unhandled alert kind:", kind);
  return false;
}