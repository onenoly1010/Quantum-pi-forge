# Evidence Library v1

**Purpose:** Reusable evidence references for scoped service delivery. Each
customer-facing claim must cite a relevant bundle and state its limits.

| Bundle | Supports | Core evidence | Limitation |
| --- | --- | --- | --- |
| Deployment evidence | "A QPF public release was deployed and checked." | Cloudflare Pages workflow runs, `version.json`, pull-request deployment comments. | QPF evidence does not prove a client's deployment. |
| Verification evidence | "QPF publishes reproducible public verification." | `scripts/verify-public-portal.mjs`, deployed-addresses page, verification reports. | Internal methods require discovery before adaptation to a client. |
| Architecture summary | "QPF has documented technical boundaries." | Public architecture/deployed-addresses pages and repository documentation. | Not a third-party architecture audit. |
| Security posture | "QPF documents authorization and secret boundaries." | `docs/ai/AUTHORIZATION_WORKFLOW.md` when merged; existing security and policy documentation. | Not security certification or a client security assessment. |
| Audit summary | "QPF distinguishes evidence from claims." | Evidence verification scripts, receipts, and readiness materials. | Not an audit opinion or compliance attestation. |
| Public references | "A reviewer can inspect QPF independently." | Public website, GitHub repository, official 0G documentation. | Public sources may change; verify at delivery time. |

## Evidence packet rules

1. Include only evidence relevant to the scoped claim.
2. Label every item as QPF evidence, client-provided evidence, or independently
   observed evidence.
3. Record source URL, commit, timestamp, or command reference.
4. State what the evidence does not establish.
5. Never include secrets, private keys, credentials, or payment information.
