/**
 * SCCB credential design catalog — metadata only.
 * Answers: what / why / capability / scope / store / retrieve / standing / approval / revoke.
 * No secret values.
 */

/** @typedef {object} CredentialDesignSlot
 * @property {string} id
 * @property {string} provider
 * @property {string} label
 * @property {string} why
 * @property {string[]} capabilities_unlocked
 * @property {string[]} env_names
 * @property {string} pass_path
 * @property {object} scoping
 * @property {object} storage
 * @property {object} retrieval
 * @property {string[]} standing_policy_actions
 * @property {string[]} approval_required_actions
 * @property {string[]} forbidden_until_separate_go
 * @property {string} enrollment_priority
 * @property {boolean} recommended_for_first_real_bootstrap
 * @property {boolean} store_unrestricted_private_key
 * @property {string[]} operator_notes
 */

/** @type {CredentialDesignSlot[]} */
export const CREDENTIAL_DESIGN_CATALOG = [
  {
    id: 'cloudflare-api-token',
    provider: 'cloudflare',
    label: 'Cloudflare API token (Pages)',
    why: 'Deploy and inspect Cloudflare Pages projects without pasting tokens into chat on every deploy.',
    capabilities_unlocked: ['cloudflare.pages.read', 'cloudflare.deploy'],
    env_names: ['CLOUDFLARE_API_TOKEN'],
    pass_path: 'qpf/providers/cloudflare/api-token',
    scoping: {
      preferred: 'API Token (not Global API Key)',
      read_only_possible: true,
      read_only_scopes: ['Account.Cloudflare Pages:Read', 'Account.Account Settings:Read'],
      write_scopes_for_deploy: ['Account.Cloudflare Pages:Edit'],
      short_lived: 'Prefer tokens with expiration; rotate on schedule or after incident',
      account_restriction: 'Limit to QPF account / named Pages projects only when CF UI allows',
    },
    storage: {
      backend: 'pass (GPG password-store)',
      path: 'qpf/providers/cloudflare/api-token',
      plaintext_in_git: false,
      plaintext_in_chat: false,
      metadata_file: 'sccb/config/credential-metadata.local.json (gitignored)',
    },
    retrieval: {
      who: 'SCCB broker inject path only (child process env)',
      agent_sees: 'CAPABILITY grants + metadata status, never token value',
      cli: 'never prints secret; validate checks presence only',
    },
    standing_policy_actions: [
      'cloudflare.pages.read:list_projects',
      'cloudflare.pages.read:list_deployments',
      'cloudflare.pages.read:get_deployment',
    ],
    approval_required_actions: [
      'cloudflare.deploy:deploy when target/branch outside allowlist (quantumpiforge|oinio-dashboard + main)',
      'First production deploy via SCCB if production_deploy_via_sccb still NOT_AUTHORIZED',
    ],
    forbidden_until_separate_go: [],
    enrollment_priority: 'P1 — first real bootstrap candidate',
    recommended_for_first_real_bootstrap: true,
    store_unrestricted_private_key: false,
    operator_notes: [
      'Create token in Cloudflare dashboard with least privilege.',
      'Enrollment: pass insert (local interactive), then register-metadata.',
    ],
  },
  {
    id: 'github-token',
    provider: 'github',
    label: 'GitHub fine-grained or classic PAT (scoped)',
    why: 'Open PRs and (with human approval) merge without re-pasting tokens.',
    capabilities_unlocked: ['github.pr.create', 'github.merge'],
    env_names: ['GITHUB_TOKEN'],
    pass_path: 'qpf/providers/github/token',
    scoping: {
      preferred: 'Fine-grained PAT limited to Quantum-pi-forge (and siblings you choose)',
      read_only_possible: true,
      read_only_scopes: ['Contents: Read', 'Pull requests: Read', 'Metadata: Read'],
      write_for_pr: ['Contents: Read/Write', 'Pull requests: Read/Write'],
      merge_needs: 'Often same as write; merge capability still HUMAN_APPROVAL in SCCB',
      short_lived: '90-day expiry recommended; no SSO org tokens broader than needed',
    },
    storage: {
      backend: 'pass (GPG password-store)',
      path: 'qpf/providers/github/token',
      plaintext_in_git: false,
      plaintext_in_chat: false,
      metadata_file: 'sccb/config/credential-metadata.local.json (gitignored)',
    },
    retrieval: {
      who: 'SCCB broker inject only',
      agent_sees: 'CAPABILITY: github.* — never GITHUB_TOKEN=…',
      cli: 'metadata + presence validate only',
    },
    standing_policy_actions: [],
    approval_required_actions: [
      'github.pr.create:create_pr (CONDITIONAL — allowlisted repos only; mismatch escalates)',
      'github.merge:merge_pr (always HUMAN_APPROVAL)',
    ],
    forbidden_until_separate_go: [],
    enrollment_priority: 'P1 — first real bootstrap candidate',
    recommended_for_first_real_bootstrap: true,
    store_unrestricted_private_key: false,
    operator_notes: [
      'Prefer fine-grained PAT over classic.',
      'Do not grant admin:org or delete_repo for agent use.',
    ],
  },
  {
    id: 'delivery-x',
    provider: 'delivery',
    label: 'X/Twitter delivery API keys',
    why: 'Existing revenue delivery path; unify under SCCB policy/audit instead of ad-hoc env.',
    capabilities_unlocked: ['delivery.x.public_post'],
    env_names: [
      'TWITTER_API_KEY',
      'TWITTER_API_SECRET',
      'TWITTER_ACCESS_TOKEN',
      'TWITTER_ACCESS_SECRET',
    ],
    pass_path: 'qpf/revenue-delivery',
    scoping: {
      preferred: 'App + user tokens limited to posting on QPF account only',
      read_only_possible: false,
      short_lived: 'Rotate on compromise; platform-dependent expiry',
      note: 'May already exist under pass qpf/revenue-delivery/* from prior delivery setup',
    },
    storage: {
      backend: 'pass (existing delivery pattern)',
      path: 'qpf/revenue-delivery/<ENV_NAME>',
      plaintext_in_git: false,
      plaintext_in_chat: false,
      legacy_inject: 'press-agent/scripts/run-with-delivery-credentials.sh',
    },
    retrieval: {
      who: 'Delivery inject script and/or SCCB broker (future thin wrap)',
      agent_sees: 'CAPABILITY: delivery.x.public_post only',
      cli: 'presence validate only',
    },
    standing_policy_actions: [],
    approval_required_actions: ['delivery.x.public_post:post (HUMAN_APPROVAL — external publish)'],
    forbidden_until_separate_go: [],
    enrollment_priority: 'P2 — after CF/GitHub; may already be provisioned offline',
    recommended_for_first_real_bootstrap: false,
    store_unrestricted_private_key: false,
    operator_notes: [
      'If already in pass, only register SCCB metadata — do not re-paste into chat.',
      'External posts always need human approval in SCCB v1.',
    ],
  },
  {
    id: 'pi-api',
    provider: 'pi',
    label: 'Pi App API key',
    why: 'Future Pi payment/status reads after portal provision. Currently capability FORBIDDEN.',
    capabilities_unlocked: ['pi.read'],
    env_names: ['PI_API_KEY'],
    pass_path: 'qpf/providers/pi/api-key',
    scoping: {
      preferred: 'App-scoped API key when Pi portal provides one',
      read_only_possible: true,
      short_lived: 'Rotate if App recreated',
    },
    storage: {
      backend: 'pass — only after pi_activation AUTHORIZED',
      path: 'qpf/providers/pi/api-key',
      plaintext_in_git: false,
      plaintext_in_chat: false,
    },
    retrieval: {
      who: 'Broker inject after capability un-forbidden',
      agent_sees: 'CAPABILITY: pi.read (denied until policy change)',
    },
    standing_policy_actions: [],
    approval_required_actions: [],
    forbidden_until_separate_go: ['pi.read — FORBIDDEN until pi_activation phase'],
    enrollment_priority: 'P9 — do not enroll in first real bootstrap',
    recommended_for_first_real_bootstrap: false,
    store_unrestricted_private_key: false,
    operator_notes: [
      'Pi remains dormant. Do not enroll real Pi secrets during first bootstrap.',
    ],
  },
  {
    id: 'wallet-signer',
    provider: 'wallet',
    label: 'Wallet signer reference (prefer external)',
    why: 'Enable prepare→policy→approve→sign pipeline without agent holding unrestricted keys.',
    capabilities_unlocked: ['wallet.sign_transaction'],
    env_names: ['WALLET_SIGNER_REF'],
    pass_path: 'qpf/providers/wallet/signer',
    scoping: {
      preferred:
        'External signer / hardware wallet / remote policy signer. Value should be a reference or connector id — NOT a raw seed.',
      read_only_possible: false,
      short_lived: 'Session-bound signing approvals preferred',
      store_unrestricted_private_key: false,
      strongly_discouraged: 'EOA private key or seed phrase on agent host laptop',
    },
    storage: {
      backend: 'Prefer: no private key in pass. Optional: pass holds only a signer endpoint ref / key id',
      path: 'qpf/providers/wallet/signer (reference only if used)',
      plaintext_in_git: false,
      plaintext_in_chat: false,
    },
    retrieval: {
      who: 'Signer subsystem after wallet_signing AUTHORIZED — never LLM',
      agent_sees:
        'CAPABILITY: wallet.prepare_transaction (intent summary only); sign remains FORBIDDEN by default',
    },
    standing_policy_actions: ['wallet.prepare_transaction:prepare (unsigned intent only)'],
    approval_required_actions: [
      'Any sign path (when ever un-forbidden) → HUMAN + amount/destination policy',
    ],
    forbidden_until_separate_go: [
      'wallet.sign_transaction',
      '0g.submit_transaction',
      'economics.mint / economics.liquidity',
    ],
    enrollment_priority: 'P9 — not first bootstrap; design external signer first',
    recommended_for_first_real_bootstrap: false,
    store_unrestricted_private_key: false,
    operator_notes: [
      'SCCB should orchestrate intents; unrestricted private keys should not live in agent context.',
      'First bootstrap should skip wallet-signer enrollment entirely.',
    ],
  },
];

/**
 * Map design catalog → legacy bootstrap catalog shape.
 */
export function toLegacyCatalogEntries() {
  return CREDENTIAL_DESIGN_CATALOG.map((d) => ({
    id: d.id,
    provider: d.provider,
    label: d.label,
    pass_path: d.pass_path,
    env_names: d.env_names,
    scopes: d.scoping.write_scopes_for_deploy
      ? [d.scoping.preferred]
      : d.scoping.read_only_scopes || [d.scoping.preferred],
    capabilities: d.capabilities_unlocked,
  }));
}

/**
 * First-wave real bootstrap recommendation (still requires sealed credential_bootstrap).
 */
export function firstWaveEnrollmentPlan() {
  const first = CREDENTIAL_DESIGN_CATALOG.filter((c) => c.recommended_for_first_real_bootstrap);
  const deferred = CREDENTIAL_DESIGN_CATALOG.filter((c) => !c.recommended_for_first_real_bootstrap);
  return {
    schema: 'sccb.first_wave_enrollment.v1',
    first_wave: first.map((c) => ({
      id: c.id,
      provider: c.provider,
      why: c.why,
      capabilities: c.capabilities_unlocked,
      pass_path: c.pass_path,
      scoping_summary: c.scoping.preferred,
    })),
    deferred: deferred.map((c) => ({
      id: c.id,
      reason: c.enrollment_priority,
      forbidden_until: c.forbidden_until_separate_go,
    })),
    secret_values_included: false,
  };
}
