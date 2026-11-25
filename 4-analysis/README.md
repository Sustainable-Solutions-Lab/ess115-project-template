# Phase 4: Analysis

**What goes here:** everything needed to reproduce the results, and the figures the story is built from.

| Folder | Contents |
|---|---|
| `code/` | Scripts or notebooks that turn raw data into the files in `data/`. Say at the top of each one what it needs and how to run it. |
| `data/` | Small, clean CSV files, one header row. Large or restricted raw files stay out of the repository; say in `METHODS.md` where to get them. |
| `charts/` | One Vega-Lite spec (`.json`) per figure. The story reads its charts from here. |

Also write `results.md` in this folder: what you found, in plain sentences, with each number tied to a file in `data/`. Say which parts of the plan you changed and why.

**Hand off figures as data plus a chart spec, never as a picture.** The write-up group needs to restyle your charts and check your numbers, and neither is possible with a PNG.

---

*Example:* `code/aggregate_net_benefit.py` reads the study's 0.01-degree net-benefit grid and writes the map cells, the ranked tenths, the latitude bands and `data/summary_stats.csv`, which lists every number the story computes.
