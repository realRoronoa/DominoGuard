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

The simulation is illustrative. It does not perform an attack, verify that a real account has been breached, or claim that a specific service can be bypassed.

## Core User Flow
Select digital services ↓ Choose threat scenario ↓ Run AI simulation ↓ Build dependency graph ↓ Simulate cascade ↓ Calculate blast radius ↓ Generate recovery playbook

## AI Architecture
DominoGuard uses three specialist reasoning stages.

1. **Mapper**
Role: Build the graph
The Mapper converts the user's selected services into a structured synthetic dependency graph. It identifies relationships such as recovery paths and trusted connections between services.

2. **Red-Team Simulator**
Role: Model the cascade
The simulator receives the dependency graph and selected threat scenario. It produces a defensive, step-by-step cascade and calculates the blast-radius score.
No real attack is executed.

3. **Remediator**
Role: Recommend recovery actions
The Remediator analyzes the simulated cascade and produces a prioritized three-step lockdown sequence.

## AWS Architecture
```
┌──────────────────────┐   │ Next.js UI │   │ AWS Amplify Host │   └──────────┬───────────┘
                             │ POST /simulate │
┌──────────▼───────────┐   │ Express / Node.js │   │ TypeScript │   │ AWS App Runner │   └──────────┬───────────┘
                             │
                      ┌─────────▼─────────┐
                      │ Amazon Bedrock    │
                      │ AI reasoning      │
                      └─────────┬─────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
    ┌─────▼─────┐         ┌──────▼──────┐         ┌────▼─────┐
    │  Mapper   │   →     │  Red-Team   │   →     │Remediator│
    │   Agent   │         │  Simulator  │         │  Agent   │
    └───────────┘         └─────────────┘         └──────────┘
```

**AWS services used / deployment targets**
* Amazon Bedrock — AI reasoning for the specialist agent stages.
* AWS App Runner — backend deployment target.
* AWS Amplify Hosting — frontend deployment target.
* Amazon CloudWatch — application/deployment logging when configured.

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

The email field is used only as a demo identity input in the current MVP. The simulation itself is based on the services selected by the user.

**Important limitation**
DominoGuard is a simulation and decision-support tool, not a breach-detection service. Its attack paths are illustrative and depend on the configured service relationships.

## Supported Services
The current MVP supports:

| Service ID | Example Service |
| ---------- | --------------- |
| email | Primary email |
| instagram | Instagram |
| whatsapp | WhatsApp |
| bank | Banking / financial account |
| google | Google services |
| amazon | Amazon |

## Supported Threat Scenarios

| Scenario | Description |
| -------- | ----------- |
| email_compromise | Primary email account is assumed compromised through phishing or credential exposure. |
| sim_swap | Phone/SIM trust is treated as the initial weak point. |
| oauth_hijack | A connected session/OAuth relationship is treated as the initial weak point. |

These scenarios model possible consequences; they do not execute real-world attacks.

## Tech Stack

**Frontend**
* Next.js 14
* React 18
* TypeScript
* Tailwind CSS
* Framer Motion
* Lucide React

**Backend**
* Node.js
* Express 5
* TypeScript
* Zod
* AWS SDK for JavaScript
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
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── FootprintForm.tsx
│   │   │   ├── ThreatSelector.tsx
│   │   │   ├── RiskGauge.tsx
│   │   │   ├── CascadeGraph.tsx
│   │   │   └── Playbook.tsx
│   │   └── types/
│   │       └── index.ts
│   ├── amplify.yml
│   ├── next.config.mjs
│   ├── package.json
│   └── tailwind.config.ts
│
├── backend/
│   ├── src/
│   │   ├── agents/
│   │   │   ├── graphAgent.ts
│   │   │   ├── redTeamAgent.ts
│   │   │   └── remediationAgent.ts
│   │   ├── config/
│   │   │   └── aws.ts
│   │   ├── controllers/
│   │   │   └── simulateController.ts
│   │   ├── routes/
│   │   │   └── simulateRoute.ts
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
`{ "ok": true, "service": "dominoguard-backend" }`

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
Create `backend/.env` from `.env.example`.
```env
PORT=4000
AWS_REGION=us-east-1
USE_BEDROCK=true
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
```
AWS credentials are resolved using the standard AWS SDK credential chain.

**Frontend**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

## Running Without Bedrock
For local development or if Bedrock access is not available:
`USE_BEDROCK=false`
The backend uses deterministic fallback logic for the mapper, simulator, and remediation stages.
This keeps the application demoable even when AI model access is unavailable.

## API

**GET /health**
Checks whether the backend is running.

**POST /api/v1/simulate**
Runs the DominoGuard simulation.
Example request:
```json
{
  "email": "demo@example.com",
  "services": [
    "email",
    "instagram",
    "whatsapp",
    "bank",
    "google",
    "amazon"
  ],
  "scenario": "email_compromise"
}
```

Example response shape:
```json
{
  "score": 82,
  "severity": "CRITICAL",
  "headline": "One compromised hub can expose several downstream paths.",
  "rootCause": "Primary email is the initial recovery hub in this simulation.",
  "cascade": [],
  "playbook": [],
  "agentTrace": [
    { "name": "Mapper", "status": "complete" },
    { "name": "Red-Team Simulator", "status": "complete" },
    { "name": "Remediator", "status": "complete" }
  ]
}
```
The actual cascade and playbook arrays contain the generated simulation nodes and defensive actions.

## Demo Flow
For the strongest product demonstration:
1. Start with the default account footprint.
2. Select Primary email password leaked.
3. Click Run AI Red-Team Simulation.
4. Show the risk score and severity.
5. Walk through the animated account cascade.
6. Explain why each hop matters.
7. Finish with the three-step recovery playbook.
8. Show the AI agent trace and AWS-backed execution when Bedrock is enabled.

The key demo message is:
DominoGuard turns an abstract cybersecurity problem into a visible chain of consequences and concrete defensive actions.

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
* The breach history is not a live breach-verification system.
* Risk scores are simulation scores, not insurance, financial, or security guarantees.
* Service relationships are simplified for demonstration.
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
