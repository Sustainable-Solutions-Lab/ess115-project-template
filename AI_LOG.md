# AI log: the example story

This is the real log of how the example story in this repository, *The best places to fight fire before it starts*, was made and revised with an AI tool. It is kept by the teaching team as the example of the log we expect from you. Every request for a change gets an entry, whether it changes the substance (a number, a claim, a method) or only the look (a color, a font, a layout).

How to read it:

- Entries are newest first. Each one names the version it produced; versions are git tags, so you can see exactly what changed with `git diff v0.1 v0.2` or on GitHub under "Tags".
- "What was asked" quotes the request as it was made.
- "How it was checked" says who or what did the checking. A check run by the AI on its own work is weaker than a check by a person, so the two are kept apart.
- "Not yet checked" is the most important line. It tells the next reader what they should not yet trust.
- Pictures of the page at each version are in `log-snapshots/`.

When your group starts its own project, replace this file with a copy of `AI_LOG_TEMPLATE.md`.

---

### 2026-11-24 · Process · who: S. Davis (instructor) · version: v0.1 (no change to the story)

**Kind of change:** process

**Tool:** Claude (Anthropic), in Claude Code

**What was asked:** "I'd like to set a good example for the students and make a log that shows this current version and the substantive and aesthetic changes I will ask you for going forward as we polish it."

**What it gave us:** This file, rewritten from a single example entry into a full log; `AI_LOG_TEMPLATE.md`, the blank version for students; the tag `v0.1` on the current story; and `log-snapshots/v0.1-top.png`, a picture of the top of the page at this version.

**How it was checked:** By the AI: the quoted requests below were copied from the conversation in which they were made, and the commit hashes were read from `git log`. By a person: not yet.

**What we kept, changed or threw out, and why:** The earlier example entry is kept, expanded, as the v0.1 entry below.

**Not yet checked:** The instructor has not yet read this log against his own memory of what he asked.

---

### 2026-11-24 · Phases 4 and 5 · who: S. Davis (instructor) · version: v0.1 (commit `7a292d9`)

**Kind of change:** substantive (new topic, new data, new story) and aesthetic (a map as the main graphic)

**Tool:** Claude (Anthropic), in Claude Code

**What was asked:** "Let's update the example scroll-story to be about Jing Cheng's where to treat wildfire fuels analysis (we have a tool started for it). Should be a research output like I'd want them to make. Go ahead and start a git repo for it that will be shared with students and ready to be cloned for their own."

**What it gave us:** `4-analysis/code/aggregate_net_benefit.py`, which reads the study's 0.01-degree net-benefit grid and writes the CSV files in `4-analysis/data/`; two chart specs (the California map and the bar chart by tenth of land); `story.md`; `METHODS.md`; and the phase folders. The story file format changed from JSON to Markdown, because a stray comma in JSON breaks the whole page.

**How it was checked:**

- By the AI, against the preprint: the share of land where benefits exceed costs (60 percent in both) and the area of the best tenth (28,700 km² from the grid; 28,000 km² in the preprint).
- By the AI, internal consistency: the ten tenths add up to the total area, and each number in the story matches a row in `4-analysis/data/summary_stats.csv`.
- By the AI, back-of-envelope: 287,000 km² × $42,000 mean net benefit ≈ $12 billion, which matches the sum of the tenths.
- By the AI, in a headless browser: the page loads with no errors on desktop and phone widths, in light and dark mode, and when served from a subfolder.
- By a person: the instructor has seen the list of headline numbers and where each came from. Nobody has yet read the story line by line against the preprint.

**What we kept, changed or threw out, and why:**

- Kept the statistics computed from the grid.
- Found a disagreement and kept it visible: the grid gives a cutoff of $198,000 per km² for the best tenth of land, and the preprint says $220,000. The story uses the grid's number, because that is what the map shows, and `METHODS.md` records the difference.
- Threw out a draft sentence that compared the best tenth with past treatments in dollars. It set a number computed from the grid beside a number from the preprint, and the ratio of the two did not match the preprint's own "more than 6.5-fold" claim.
- The numbers on smoke (82 percent of benefits in the top-ranked areas), treatment type and future climate are quoted from the preprint as text, because the grid we had holds only one layer.

**Not yet checked:**

- Which cutoff for the best tenth is current, $198,000 or $220,000. The study's lead author should say.
- The split at 38°N ("86 percent of the best tenth lies in the north") is our choice of line, not the preprint's. A different line gives a different number.
- The map is averaged to cells about 5 km across, and a cell is shaded as "best tenth" when at least 40 percent of it qualifies. Nobody has compared the coarse map with the full-resolution one by eye.
- The study's lead author has not yet seen the story.
- The preprint is still in review, so its numbers may change.

---

### 2026-11-24 · Template · who: S. Davis (instructor) · version: v0.0 (commit `b3910d0`)

**Kind of change:** aesthetic and structural (the design system and the scrolling mechanics), with a placeholder story

**Tool:** Claude (Anthropic), in Claude Code

**What was asked:** "One idea was to drop the paper requirement and instead have them try 'scrollytelling' with help from AI. My idea was to establish an example codebase and design system in the vein of these," followed by links to three interactive stories from The New York Times (on ventilation in schools, flash floods in Nepal, and the Los Angeles fires).

**What it gave us:** The page (`index.html`, `css/`, `js/`): a graphic that stays in view while short text steps scroll past and change it, a type scale, a color palette, and a chart theme. The placeholder story, "Fewer fires, more acres," used the National Interagency Fire Center's annual totals of US wildfires and acres burned, 1983 to 2025.

**How it was checked:** By the AI: every number in the placeholder text was matched to the downloaded table; the palette was run through a colorblind-safety check in light and dark mode; the page was loaded in a headless browser at desktop and phone widths. By a person: the instructor received the preview link, and then asked for a different example.

**What we kept, changed or threw out, and why:** Kept the page, the design system and the idea that students edit only content files. Threw out the placeholder story in v0.1: national statistics are easy to chart but are not a research result, and the example should look like the kind of output we want from a class project.

**Not yet checked:** The instructor has not yet asked for any changes to the look of the page. Those will appear above as they are made.

---
