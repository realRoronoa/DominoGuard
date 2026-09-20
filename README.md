# DominoGuard 🛡️
See the cascade before the damage starts.

DominoGuard is a privacy-first cybersecurity simulator that helps everyday users understand how connected accounts can create a digital blast radius.

Instead of asking for passwords, tokens, or access to real accounts, DominoGuard lets a user select the services they rely on and choose a threat scenario. It then builds a synthetic dependency graph, simulates a plausible defensive attack cascade, calculates an explainable risk score, and produces a prioritized recovery playbook.

## Why DominoGuard?
Most consumer security products are good at telling people that something happened.
DominoGuard focuses on a different question:
"If this account is compromised, what could become vulnerable next?"

People often use one email address, recovery method, or trusted session across multiple services. That creates hidden dependencies between accounts.
DominoGuard makes those dependencies visible and turns them into an easy-to-understand sequence:
Weak Point → Connected Account → Downstream Risk → Action

## What DominoGuard Does
* Builds a digital dependency graph from the services selected by the user.
* Simulates a threat scenario such as email compromise, SIM swap, or OAuth session hijacking.
* Calculates a 0–100 blast-radius score with a severity level.
* Visualizes the cascade so users can see how the risk propagates.
* Generates a three-step recovery playbook focused on the highest-priority defensive actions.
* Optionally checks an email address against a public breach index, clearly labelled as historical disclosure data.

The simulation is illustrative. It does not perform an attack, verify that a real account has been breached, or claim that a specific service can be bypassed.

### Honesty Rules the Code Enforces
These are behavioural guarantees, not aspirations — the UI is built so it cannot overstate what happened.

* **Only reachable accounts count.** An account with no shared recovery path with the starting point is reported as unreachable and scored `low`, not given the scenario's severity by default.
* **A failed breach lookup is never an all-clear.** `ThreatIntelResult.checked` is `false` whenever the lookup times out, errors, or is disabled, and the UI renders a distinct "Check unavailable" state instead of a green result.
* **Stage badges name the system that actually answered.** `bedrock` means a model call returned usable JSON. `live` means a real external lookup completed. `fallback`, `disabled`, and `error` all mean the deterministic engine produced the result, and the UI says so.
* **Token counts and latencies are measured, never invented.** They come from `result.usage` on the Bedrock response and real wall-clock timing; a stage that made no model call reports zero tokens.
* **MITRE technique references are labelled as references.** DominoGuard does not monitor accounts and has not detected any of them.

## Core User Flow
Select your accounts ↓ Choose a threat scenario ↓ Run the simulation ↓ Build the dependency graph ↓ Simulate the cascade ↓ Calculate the blast radius ↓ Generate the lockdown plan

## AI Architecture
DominoGuard runs four pipeline stages. Three are model-backed reasoning stages; the first is a plain HTTP lookup.

Each model-backed stage has a deterministic fallback that produces the same output shape, so the product works identically with `USE_BEDROCK=false` — the only difference is which system is credited in the agent trace.

0. **OSINT Breach Lookup** *(not a model stage)*
Role: Look for past disclosures
Queries a public breach index for the supplied email address. Skipped entirely when no address is given. Reports `mode: "live"` on success and `mode: "disabled"` when it was skipped or could not complete.

1. **Mapper**
Role: Build the graph
The Mapper converts the user's selected services into a structured synthetic dependency graph. It identifies relationships such as recovery paths and trusted connections between services, and determines which accounts are actually reachable from the scenario's starting point.

2. **Red-Team Simulator**
Role: Model the cascade
The simulator receives the dependency graph and selected threat scenario. It produces a defensive, step-by-step cascade and calculates the blast-radius score from the scenario baseline, the impact of each reachable account, and how many onward paths each one opens.
No real attack is executed.

3. **Remediator**
Role: Recommend recovery actions
The Remediator analyzes the reachable portion of the simulated cascade and produces a prioritized three-step lockdown sequence, written for a non-technical reader.

## AWS Architecture
```
                    ┌──────────────────────┐
                    │      Next.js UI      │
                    │  AWS Amplify Hosting │
                    └──────────┬───────────┘
                               │ POST /api/v1/simulate
                    ┌──────────▼───────────┐
                    │  Express / Node.js   │
                    │      TypeScript      │
                    │    AWS App Runner    │
                    └──────────┬───────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
    ┌─────▼──────┐   ┌─────────▼─────────┐   ┌──────▼───────┐
    │ XposedOrNot│   │  Amazon Bedrock   │   │  CloudWatch  │
    │  breach    │   │  Claude 3 Haiku   │   │   logging    │
    │  index     │   └─────────┬─────────┘   └──────────────┘
    └────────────┘             │
                 ┌─────────────┼─────────────┐
                 │             │             │
           ┌─────▼─────┐ ┌─────▼──────┐ ┌────▼─────┐
           │  Mapper   │→│  Red-Team  │→│Remediator│
           │   Agent   │ │ Simulator  │ │  Agent   │
           └───────────┘ └────────────┘ └──────────┘
```

**AWS services used / deployment targets**
* Amazon Bedrock — AI reasoning for the three specialist agent stages.
* AWS App Runner — backend deployment target.
* AWS Amplify Hosting — frontend deployment target.
* Amazon CloudWatch — application/deployment logging when configured.

The breach lookup calls XposedOrNot, a free public index that requires no API key and no sign-up. It is the one non-AWS dependency, and the product runs fully without it.

DominoGuard does not require a database for the MVP.

## Privacy by Design
DominoGuard intentionally avoids collecting sensitive account credentials.
We do not ask for:
* Passwords
* API keys
* Authentication tokens
* Banking credentials
* OAuth tokens
* Access to real accounts

The email field is optional. It is used only for the breach lookup, and nothing is sent anywhere until the user types an address in themselves. The simulation itself is based entirely on the services selected by the user.

**Important limitation**
DominoGuard is a simulation and decision-support tool, not a breach-detection service. Its attack paths are illustrative and depend on the configured service relationships. The breach lookup reports historical public disclosures; it is not evidence that an account is compromised today.

## Supported Services
The current MVP supports:

| Service ID | Example Service |
| ---------- | --------------- |
| email | Primary email |
| instagram | Instagram |
| whatsapp | WhatsApp |
| bank | Banking / financial account |
| google | Google Drive / Photos |
| amazon | Amazon shopping account |

## Supported Threat Scenarios

| Scenario | Description |
| -------- | ----------- |
| email_compromise | Primary email account is assumed compromised through phishing or credential exposure. |
| sim_swap | Phone/SIM trust is treated as the initial weak point. |
| oauth_hijack | A connected session/OAuth relationship is treated as the initial weak point. |

These scenarios model possible consequences; they do not execute real-world attacks.

## Tech Stack

**Frontend**
* Next.js 14 (App Router)
* React 18
* TypeScript
* Tailwind CSS
* Lucide React

**Backend**
* Node.js
* Express 5
* TypeScript
* Zod
* AWS SDK for JavaScript v3
* Amazon Bedrock

**Deployment**
* AWS Amplify Hosting
* AWS App Runner
* CloudWatch

## Project Structure
```
dominoguard/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx          # dashboard state, simulation runs
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── Sidebar.tsx            # nav, breach-check input, connection state
│   │   │   ├── RiskGauge.tsx          # score, accounts reached, blast-radius card
│   │   │   ├── CascadeGraph.tsx       # cascade spline + live agent telemetry
│   │   │   ├── FootprintForm.tsx      # per-account include/exclude
│   │   │   ├── Playbook.tsx           # three-step lockdown plan
│   │   │   ├── AuditLogModal.tsx      # full agent trace, JSON, MITRE reference
│   │   │   ├── SettingsModal.tsx      # backend URL, hop limit, model info
│   │   │   └── NotificationsPopover.tsx  # findings derived from the last run
│   │   └── types/
│   │       └── index.ts          # mirrors the backend response contract
│   ├── amplify.yml
│   ├── next.config.mjs
│   ├── package.json
│   └── tailwind.config.ts
│
├── backend/
│   ├── src/
│   │   ├── agents/
│   │   │   ├── graphAgent.ts          # Mapper
│   │   │   ├── redTeamAgent.ts        # Red-Team Simulator + scoring
│   │   │   └── remediationAgent.ts    # Remediator
│   │   ├── config/
│   │   │   ├── aws.ts                 # Bedrock client, env, timeouts
│   │   │   └── services.ts            # service labels, scenario dependency model
│   │   ├── controllers/
│   │   │   └── simulateController.ts
│   │   ├── lib/
│   │   │   ├── modelJson.ts           # strict parsing of model output
│   │   │   └── rateLimit.ts           # in-process request limiter
│   │   ├── routes/
│   │   │   └── simulateRoute.ts       # Zod request validation
│   │   ├── services/
│   │   │   └── threatIntelService.ts  # public breach-index lookup
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── deploy/
│   ├── README.md
│   └── APP-RUNNER-IAM.md
│
├── run-local.ps1
└── README.md
```

## Getting Started

### Prerequisites
Install:
* Node.js
* npm
* Git
* An AWS account for Bedrock-backed execution

The application can also run without Bedrock by disabling Bedrock mode and using the deterministic fallback logic.

### 1. Clone the repository
```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd dominoguard
```

### 2. Start the backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The API starts on:
http://localhost:4000

Health check:
GET http://localhost:4000/health
Expected response:
`{ "ok": true, "service": "dominoguard-backend", "bedrockEnabled": true, "modelId": "anthropic.claude-3-haiku-20240307-v1:0" }`

**Windows PowerShell**
```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run dev
```

### 3. Start the frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```

Open:
http://localhost:3000

The frontend defaults to:
http://localhost:4000
For a different backend URL, create `frontend/.env.local`:
`NEXT_PUBLIC_API_BASE_URL=http://localhost:4000`

## Environment Variables

**Backend**
Create `backend/.env` from `.env.example`. Every variable below has a working default, so an empty `.env` still boots.

| Variable | Default | Purpose |
| -------- | ------- | ------- |
| `PORT` | `4000` | Port the API listens on. |
| `ALLOWED_ORIGINS` | *(empty)* | Comma-separated exact origins allowed to call the API. Empty allows any origin — fine locally, set it in production. |
| `AWS_REGION` | `us-east-1` | Region for the Bedrock client. |
| `USE_BEDROCK` | `true` | Set `false` to run every stage deterministically. |
| `BEDROCK_MODEL_ID` | `anthropic.claude-3-haiku-20240307-v1:0` | Model invoked by the three reasoning stages. |
| `BEDROCK_TIMEOUT_MS` | `8000` | Ceiling for a single model invocation. Three run in sequence, so keep it well under any upstream gateway timeout. |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | *(empty)* | Optional. On App Runner or EC2, prefer an instance role and leave these blank. |
| `THREAT_INTEL_ENABLED` | `true` | Set `false` to disable the breach lookup entirely. |
| `XPOSEDORNOT_API_URL` | `https://api.xposedornot.com/v1/check-email` | Public breach index. No API key, no sign-up. |
| `THREAT_INTEL_TIMEOUT_MS` | `3500` | Ceiling for the breach lookup. On timeout the result is reported as *unavailable*, never as "clean". |
| `RATE_LIMIT_WINDOW_MS` | `60000` | Rate-limit window per client IP. |
| `RATE_LIMIT_MAX` | `20` | Requests allowed per window. Each `/simulate` call fans out to paid Bedrock invocations plus a third-party lookup. |

AWS credentials are resolved using the standard AWS SDK credential chain.

**Frontend**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

## Running Without Bedrock
For local development, or if Bedrock access is not available:
`USE_BEDROCK=false`

The Mapper, Red-Team Simulator, and Remediator each fall back to their deterministic path. The response is the same shape and the product is fully usable — the only visible difference is that each stage's badge reads **No model** instead of **Bedrock**, and reports zero tokens. The same fallback triggers automatically if a model call times out, errors, or returns JSON that fails validation, so a Bedrock outage degrades the demo rather than breaking it.

## Demo Flow
1. Start with the default footprint — all six accounts selected, Email Breach scenario.
2. Read the risk score, severity, and how many accounts are reachable.
3. Switch scenarios (Email Breach → SIM Swap → Session Hijack) and watch the score, the starting account, and the chain order all change.
4. Click any step in the chain to see why that account is reachable.
5. Deselect an account in **Your Accounts** to show the score and blast radius respond to a smaller footprint.
6. Open the **Lockdown Plan** — three concrete steps, each linking to the provider's own security page.
7. Open the **Full Audit Log** to show the per-stage agent trace: mode, real latency, and real token counts.
8. Optionally enter an email address to run the live breach lookup.

The key demo message is:
DominoGuard turns an abstract cybersecurity problem into a visible chain of consequences and concrete defensive actions.

## API

**GET /health**
Checks whether the backend is running, and reports whether Bedrock is enabled.
```json
{
  "ok": true,
  "service": "dominoguard-backend",
  "bedrockEnabled": false,
  "modelId": "anthropic.claude-3-haiku-20240307-v1:0"
}
```

**POST /api/v1/simulate**
Runs the DominoGuard simulation. Rate-limited per client IP.

Request — `services` and `scenario` are required, `email` and `maxHops` are optional:
```json
{
  "email": "you@example.com",
  "services": ["email", "instagram", "whatsapp", "bank", "google", "amazon"],
  "scenario": "email_compromise",
  "maxHops": 3
}
```

Response — abridged, with the arrays trimmed to one entry each:
```json
{
  "score": 67,
  "severity": "HIGH",
  "headline": "Several of your accounts share a recovery path worth separating.",
  "rootCause": "Your primary email is the recovery hub in this simulation.",
  "rootId": "email",
  "cascade": [
    {
      "id": "email",
      "label": "Primary Email",
      "status": "root",
      "reason": "Recovery hub: control of this account can expose reset and notification paths for connected services.",
      "order": 0
    }
  ],
  "playbook": [
    {
      "title": "Lock down Primary Email",
      "description": "Change the password from a trusted device and turn on phishing-resistant two-factor authentication where it is offered.",
      "actionUrl": "https://myaccount.google.com/security"
    }
  ],
  "threatIntel": {
    "checked": false,
    "email": "",
    "pwned": false,
    "breachCount": 0,
    "topBreaches": [],
    "source": "Breach lookup unavailable",
    "latencyMs": 0,
    "unavailableReason": "No email address provided."
  },
  "agentTrace": [
    {
      "name": "Mapper",
      "mode": "disabled",
      "latencyMs": 1,
      "inputTokens": 0,
      "outputTokens": 0,
      "summary": "Built a dependency graph across 3 selected accounts, rooted at Primary Email.",
      "note": "Bedrock disabled (USE_BEDROCK=false)."
    }
  ],
  "metrics": {
    "selectedCount": 3,
    "reachableCount": 3,
    "hopCount": 3,
    "totalLatencyMs": 8,
    "bedrockEnabled": false,
    "modelId": "anthropic.claude-3-haiku-20240307-v1:0",
    "inputTokens": 0,
    "outputTokens": 0
  },
  "privacyNote": "No passwords, tokens, or account access are requested. This simulation uses only the accounts you selected."
}
```

Field notes:
* `cascade[].status` — `root` for the starting account, then `high` / `medium` / `low`. Accounts that share no recovery path with the root are `low` with a reason explaining why they are unreachable.
* `metrics.reachableCount` — how many of `selectedCount` the attacker actually reaches. The UI derives the blast radius from this, not from the cascade length.
* `agentTrace[].mode` — `bedrock`, `live`, `fallback`, `disabled`, or `error`. Only `bedrock` means a model produced that stage's output.
* `threatIntel.checked` — `false` whenever the lookup did not complete. `pwned: false` alongside `checked: false` means *unknown*, not *clean*.

## Deployment

**Frontend — AWS Amplify**
* Push the repository to GitHub.
* Connect the repository to Amplify Hosting.
* Select the frontend directory as the application root if prompted.
* Configure: `NEXT_PUBLIC_API_BASE_URL=<YOUR_APP_RUNNER_BACKEND_URL>`
* Deploy.

The repository already includes: `frontend/amplify.yml`

**Backend — AWS App Runner**
* Build/deploy the backend directory as a Node.js service.
* Configure the environment variables from `.env.example`.
* Provide an IAM role with permission to invoke the required Bedrock model.
* Expose port 4000.
* Verify: `GET /health`

The repository also includes App Runner deployment notes under: `deploy/`

## Security Principles
DominoGuard follows a defensive-by-default model.
* No credential collection.
* No exploitation of real systems.
* No automated account takeover.
* No claims of verified breaches.
* Simulated attack paths only.
* Defensive remediation as the final output.

## Current MVP Limitations
DominoGuard is intentionally scoped for a fast, reliable hackathon MVP.
* The account dependency graph is synthetic and based on configured services.
* The breach lookup reports historical public disclosures only; it is not live breach verification and cannot tell you whether an account is compromised right now.
* Risk scores are simulation scores, not insurance, financial, or security guarantees.
* Service relationships are simplified for demonstration.
* Rate limiting is in-process, so it resets on restart and is per-instance rather than shared across a scaled deployment.
* A database and user authentication are intentionally excluded from the MVP.

## Future Roadmap
Potential future improvements include:
* User-defined custom account relationships.
* More threat scenarios.
* Confidence levels for each simulated hop.
* More granular account-security controls.
* Real breach-data integrations with appropriate privacy controls.
* Persistent personal security dashboards.
* Additional AWS-native orchestration and observability.

## Hackathon
WeMakeDevs × AWS — First Commit Hackathon 2026
Project: DominoGuard
Track focus:
* Ship It / live deployment
* AI / Agents
* UI / UX
Official event page: [https://www.wemakedevs.org/aws](https://www.wemakedevs.org/aws)

## Team
Built as a hackathon project focused on making cybersecurity understandable for everyday internet users.

## License
MIT License
