# DominoGuard

DominoGuard is a privacy-first cybersecurity simulator that helps people understand the **cascade risk** created by connected accounts.

A user does not give us a password. They choose the accounts/services they rely on and a threat scenario. DominoGuard builds a synthetic dependency graph, simulates a plausible account-takeover cascade, calculates an explainable risk score, and returns a prioritized recovery playbook.

## Hackathon fit

Built for WeMakeDevs x AWS First Commit (Sept 17–20, 2026).

The current official event rules require a new project to be built during the hackathon, use AWS, submit a public repository, and submit a YouTube demo of at most 3 minutes. Judging emphasizes real-world impact, AWS usage, learning, working execution, and the demo video.

## Architecture

- **Next.js 14 + Tailwind + Framer Motion** — frontend dashboard
- **Node.js + Express + TypeScript** — API and orchestration
- **Amazon Bedrock** — three specialist reasoning stages when credentials/model access are available
- **Amazon Amplify Hosting** — frontend deployment target
- **AWS App Runner** — backend deployment target
- **CloudWatch** — application logs in deployment
- **No passwords, tokens, or account credentials are collected**
- **No database in MVP** — keeps the demo privacy-first and the deployment cheap

## AI stages

1. **Mapper**: turns user-selected services into a structured synthetic dependency graph.
2. **Red-Team Simulator**: reasons over the graph and threat scenario to produce a step-by-step cascade and score.
3. **Remediator**: turns the cascade into an ordered three-step recovery playbook.

The API uses deterministic fallback logic when Bedrock is unavailable, so the core demo remains functional. During the judged demo, run once with Bedrock enabled and show the agent trace so AWS usage is visible.

## Safety / positioning

This is a defensive simulation, not a breach checker and not an offensive tool. It does not claim that a named bank can actually be bypassed from a stolen email password. Attack paths are illustrative and based only on the dependencies the user configures.

## Local run

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Backend: `http://localhost:4000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:3000`

Set `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000` in `frontend/.env.local` if needed.

## Demo path

Use the default demo profile and run **Primary email password leaked**. The UI should show the score, root cause, cascade nodes, why each hop matters, and a 3-step lockdown sequence.

## Environment variables

Backend:

- `PORT` — default `4000`
- `AWS_REGION` — default `us-east-1`
- `BEDROCK_MODEL_ID` — default `anthropic.claude-3-haiku-20240307-v1:0`
- `USE_BEDROCK` — `true` or `false`
- Standard AWS credentials are resolved using the AWS SDK default credential chain.

Frontend:

- `NEXT_PUBLIC_API_BASE_URL` — backend URL
