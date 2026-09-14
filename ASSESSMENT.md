# Psynth — QA Automation Engineer Assessment

Thank you for taking this assessment.

You will work on **PsychAssess**, a small clinical dashboard: list client assessments, inspect scores, add notes, generate a narrative, and export a PDF.

This is not a request for complete coverage. We care about **what you choose to test, how you treat existing automation, how you investigate failures, and whether CI reflects the risk of a change.**

## Time

Spend about **2–3 hours**. There is no calendar deadline in this brief. Stop when the timebox is up; a smaller, reasoned delivery beats an unfinished rewrite.

## Setup

Follow the root [README](./README.md) to run the app (UI and API URLs are listed there).

Take a few minutes to click through the app and try the API before changing tests.

The Playwright suite (`tests/`) and GitHub Actions workflow live in this repo. Commands to run the app and the tests are in the README.

## What this repo already contains

Treat this as an inherited project, not a greenfield:

- The application (FastAPI + React)
- An existing **Playwright + TypeScript** suite under `tests/`
- A GitHub Actions workflow that runs the app and the tests
- A test-impact map (`test-impact.yml`) used — or meant to be used — to select tests on pull requests

The suite is **incomplete** and **not fully trustworthy**. Some tests may fail. Some may pass without proving much. That is part of the exercise. Do not assume a green run means the product is fine, and do not assume a red run means the test is wrong.

## Suggested timebox (not mandatory)

| Minutes | Focus |
| ---: | --- |
| 15 | Explore the app and API |
| 20 | Prioritize: what you will automate, what you will skip, and why |
| 50 | Review and improve existing tests; add the highest-value coverage |
| 25 | Investigate failures (local and CI) |
| 20 | PR impact selection + CI |
| 20 | `QUALITY_REPORT.md` and `AI_USAGE.md` |

If you run out of time, ship the report and the decisions you did make.

## What to do

### 1. Prioritize

You will not cover everything in 2–3 hours. Write down (in the report) what you automated, what you left out, and the risk that remains.

UI **and** API are in scope. Playwright `request` / API tests in the same project are enough; you do not need a second framework. UI-only coverage is not sufficient where the API can disagree with the UI.

### 2. Work with the existing automation

Read the tests before adding a large new suite.

- Keep or repair tests that can become useful.
- Improve anything that hurts confidence.
- Organize the suite the way you would in a repo you have to live with: shared setup, stable locators, less duplication. Keep it on Playwright + TypeScript.
- Add coverage where the gap is costly (not where it is easy).
- You may delete a test only if you explain why in the report.

### 3. Investigate failures

When something fails — locally or in CI — classify it. Typical buckets:

product · automation · test data · environment / CI · timing · unclear requirements

Do not “fix” a failure only by weakening the assertion unless you say so and why. Use CI artifacts (report, trace, logs) when a run is red.

### 4. PR impact and CI

CI currently runs a broad set of tests. On pull requests we want **the tests that match the risk of the diff**, not “always everything” and not “nothing.”

For a change, identify:

1. **Directly affected** tests
2. **Indirect** dependents
3. A **fallback** when impact is unclear (a small smoke path that still gives confidence). Unknown impact must not mean zero tests.
4. Infra or config changes (`docker-compose.yml`, Playwright config, workflow, seed data) should stay conservative (full suite or smoke + e2e), not skipped.

This must work with normal GitHub Actions. Do not depend on paid AI or extra SaaS.

**Example A** — a teammate’s PR touches:

```
backend/app/services/narrative_service.py
frontend/src/components/assessment/NarrativeSection.tsx
```

Wire the map and CI so the right tests run for that kind of change.

**Example B** (contrast) — a PR that only touches:

```
frontend/src/pages/AssessmentList.tsx
```

should not need narrative or PDF tests.

`test-impact.yml` is a starting point. It is not complete. Fix the map **and** the fallback, and make CI use them on pull requests.

The pipeline should still **fail when tests fail**, and should upload artifacts (HTML report, trace/screenshot on failure) even when the job is red.

### 5. Report

Fill in [`QUALITY_REPORT.md`](./QUALITY_REPORT.md). Short is fine. We read this as carefully as the tests.

If you use AI, fill in [`AI_USAGE.md`](./AI_USAGE.md). AI is allowed. You own every decision and every line you keep.

## Deliverables

Submit **one pull request on your fork** — into **your** `main`, not into Psynth-AI. Send us the PR link. That PR is the whole delivery.

1. Fork [this repo](https://github.com/Psynth-AI/psynth-qa-automation-engineer-assessment).
2. Clone your fork. Work on a branch.
3. Open a PR from that branch into **your fork’s** `main`.
4. Enable GitHub Actions on the fork (Actions tab → enable) so CI runs on the PR.
5. Send the PR URL (for example `https://github.com/YOUR_USER/psynth-qa-automation-engineer-assessment/pull/1`).

Do **not** open a pull request against `Psynth-AI/psynth-qa-automation-engineer-assessment`.

The PR must include:

1. Test changes (Playwright + TypeScript)
2. CI / impact-map changes so PR runs select tests with a fallback
3. `QUALITY_REPORT.md`
4. `AI_USAGE.md` (required if you used AI; still welcome if you did not)

Do not send a zip or a Google Doc. You do not need to rewrite the application or add authentication.

## If time remains

Go deeper on impact mapping or API coverage. That is optional, not a separate track.

## How we evaluate

- Decision quality over number of tests
- Whether existing automation got better, not just larger
- Failure classification (product vs test vs environment)
- API coverage where the UI cannot tell the whole story
- Honest CI: useful artifacts, green only when it should be
- Impact selection: direct, indirect, fallback
- A report that a teammate could act on
