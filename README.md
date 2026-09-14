# PsychAssess — QA Automation Engineer Assessment

Take-home application under test. **Read [ASSESSMENT.md](./ASSESSMENT.md) first** — that file is the assignment.

This README covers how to run the app, how to run Playwright, and **how to submit**.

PsychAssess is a clinical dashboard: list assessments, open a client, add notes, generate a narrative, export a PDF.

### How to submit

The deliverable is **one pull request on your fork**, into **your** `main` — not into Psynth-AI. Then send us the PR link.

1. Fork https://github.com/Psynth-AI/psynth-qa-automation-engineer-assessment and clone **your** fork (see [§2](#2-fork-then-clone-your-fork)).
2. Push your work on a branch.
3. Open a PR from that branch into **your fork’s** `main`.
4. Enable GitHub Actions on the fork (Actions tab → enable) so CI runs.
5. Send the PR URL, e.g. `https://github.com/YOUR_USER/psynth-qa-automation-engineer-assessment/pull/1`.

Do **not** open a PR against `Psynth-AI/psynth-qa-automation-engineer-assessment`. Details are in [ASSESSMENT.md](./ASSESSMENT.md). Do not send a zip or a doc instead of the PR.

---

## 1. What you need

| Tool | Version |
|---|---|
| Git | any recent |
| Docker Desktop | if you use the Docker path |
| Python | 3.10 or newer (local path) |
| Node.js | 20 or newer (local path and Playwright) |
| npm | comes with Node |

Check:

```bash
git --version
docker compose version    # Docker path
python3 --version         # Local path
node --version            # Local path + tests
```

---

## 2. Fork, then clone **your** fork

Work in your copy. Do not clone `Psynth-AI/...` as your working copy, and do not open a PR against Psynth-AI.

1. Fork https://github.com/Psynth-AI/psynth-qa-automation-engineer-assessment (GitHub: **Fork**).
2. Clone **your** fork (replace `YOUR_USER`):

```bash
git clone https://github.com/YOUR_USER/psynth-qa-automation-engineer-assessment.git
cd psynth-qa-automation-engineer-assessment
```

All commands below assume you are in that directory unless a step says `cd`.

---

## 3. Run the app (pick one)

### Option A — Docker (simplest)

One terminal, from the repo root:

```bash
docker compose up --build
```

Wait until both services are up (frontend + backend). Leave this terminal running.

**Check:**

1. Browser: **http://localhost:5173** (see [URLs](#5-urls--cors) — do not use `127.0.0.1`).
2. You should see the heading **Assessments** and a table of **5 clients** (Alex Thompson first).
3. API docs: http://localhost:8000/docs — `GET /api/assessments` should return 5 items.

Stop with `Ctrl+C`, then `docker compose down`.

If port 8000 or 5173 is already taken, skip Docker and use [Option B](#option-b--local-two-terminals) with another API port.

### Option B — Local (two terminals)

**Terminal 1 — API**

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

You should see Uvicorn listening on `127.0.0.1:8000`. Leave it running.

Open http://localhost:8000/docs — the page should load.

If `Address already in use` on 8000, use 8001 (or any free port):

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

Then point the frontend and Playwright at that port (next steps).

**Terminal 2 — UI**

Default API on 8000:

```bash
cd frontend
npm install
npm run dev
```

If the API is on **8001** (or anything other than 8000):

```bash
cd frontend
npm install
VITE_API_URL=http://localhost:8001/api npm run dev
```

Windows (PowerShell):

```powershell
cd frontend
npm install
$env:VITE_API_URL="http://localhost:8001/api"; npm run dev
```

Vite should print a local URL on port **5173**.

**Check:** http://localhost:5173 — heading **Assessments**, **5 clients**. If the table is empty, you are almost certainly on `127.0.0.1` or the UI cannot reach the API (wrong `VITE_API_URL` or API not running).

---

## 4. Run Playwright

The app must already be running (Option A or B). Open a **new** terminal at the **repo root** (not `frontend/` or `backend/`).

```bash
npm install
npx playwright install chromium
npx playwright test
```

**If the API is not on 8000:**

```bash
BASE_URL=http://localhost:5173 API_URL=http://localhost:8001 npx playwright test
```

| Variable | Meaning | Default |
|---|---|---|
| `BASE_URL` | UI origin | `http://localhost:5173` |
| `API_URL` | API origin **without** `/api` | `http://localhost:8000` |

Windows (PowerShell), API on 8001:

```powershell
$env:BASE_URL="http://localhost:5173"; $env:API_URL="http://localhost:8001"; npx playwright test
```

Useful:

```bash
npx playwright test --ui          # interactive
npx playwright show-report        # last HTML report
```

The suite lives in `tests/` (UI under `tests/e2e/`, API under `tests/api/`). It is inherited automation: incomplete, and **not all tests are expected to pass**. Treat failures as part of the assignment — see [ASSESSMENT.md](./ASSESSMENT.md).

GitHub Actions runs the same command after `docker compose up`. Reports, traces, and screenshots upload whether the job is green or red.

---

## 5. URLs / CORS

| What | URL |
|---|---|
| UI | **http://localhost:5173** |
| API | http://localhost:8000 |
| Swagger | http://localhost:8000/docs |

Use **`localhost`**, not `127.0.0.1`. The API CORS allow-list is `http://localhost:5173` (and `http://localhost:3000`). If you open `http://127.0.0.1:5173`, the UI loads but the assessment list stays empty.

---

## 6. If something fails

| Symptom | Likely cause |
|---|---|
| UI loads, table says **No assessments found** | Opened `127.0.0.1` instead of `localhost`, or frontend cannot reach the API |
| `bind: address already in use` / Uvicorn `Address already in use` | Port 8000 or 5173 taken — pick another port and set `VITE_API_URL` / `API_URL` |
| Playwright: `net::ERR_CONNECTION_REFUSED` | App not running, or `BASE_URL` / `API_URL` do not match the ports you used |
| Docker frontend up, API calls fail | API container not healthy — check `docker compose logs backend` |
| `npm` / `playwright` not found | Run `npm install` and `npx playwright install chromium` from the **repo root** |

---

## 7. What this repo contains

| Path | Role |
|---|---|
| [ASSESSMENT.md](./ASSESSMENT.md) | The assignment |
| `QUALITY_REPORT.md`, `AI_USAGE.md` | What you fill in and submit |
| `backend/` | FastAPI, in-memory data from `sample_data.json` |
| `frontend/` | React + Vite UI |
| `tests/` | Playwright (e2e + API) |
| `test-impact.yml`, `scripts/select-tests.js` | Starting point for PR test selection |
| `.github/workflows/playwright.yml` | CI |

Extra app notes (not required to start): [backend/README.md](./backend/README.md), [frontend/README.md](./frontend/README.md).
