# AI log

Keep one entry for every time your group used an AI tool on this project (writing, code, data, charts, or finding sources). Short entries are fine. This log is part of your phase grade: we grade how you checked what the AI gave you, not whether you used it.

Copy the block below for each new entry, newest at the top.

---

### YYYY-MM-DD · Phase _ · who: _

**Tool:** (e.g., Claude, ChatGPT, Copilot)

**What we asked:** (paste the prompt, or summarize it in one or two sentences)

**What it gave us:** (one or two sentences; link the commit if it changed files)

**How we checked it:** (e.g., recomputed the number by hand from data/..., compared with the source table, back-of-envelope estimate, read the cited paper, ran the page and looked at the chart)

**What we kept, changed or threw out, and why:**

---

### 2026-11-24 · Phase 4 and 5 · who: teaching team (example entry)

**Tool:** Claude (Anthropic)

**What we asked:** Write a script that reads the 0.01-degree net-benefit grid and reports the share of area with a gain, the best tenth by area, and the split north and south of 38°N. Then draft the map spec and the story steps.

**What it gave us:** `4-analysis/code/aggregate_net_benefit.py`, the CSV files in `4-analysis/data/`, two chart specs and a draft of `story.md`.

**How we checked it:** Compared the share with a gain (60 percent) and the area of the best tenth (28,700 km²) with the preprint (60 percent; 28,000 km²). Checked that the ten tenths add up to the total area and that each number in the story matches a row in `summary_stats.csv`. Looked at the map beside the preprint's net-benefit figure. Back-of-envelope: 287,000 km² × $42,000 mean ≈ $12 billion, which matches the sum of the tenths.

**What we kept, changed or threw out, and why:** Kept the grid statistics. Found that our cutoff for the best tenth ($198,000 per km²) differs from the preprint's ($220,000); we kept our number, because it is what the map shows, and recorded the difference in `METHODS.md`. Removed a draft sentence comparing the best tenth with past treatments in dollar terms, because it mixed our number with the preprint's.

---
