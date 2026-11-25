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

### 2026-11-24 · Publishing · who: S. Davis (instructor) · version: v0.2 (no change to the story)

**Kind of change:** process (the repository is made public and the story is published with GitHub Pages)

**Tool:** Claude (Anthropic), in Claude Code

**What was asked:** "Rather than doing this in artifacts, should we enable the git pages so it looks like what the students will make? Or put it on my website?" The AI recommended GitHub Pages, and named two things to settle first: whether the license for the hero photo allows it to be published, and whether the study's lead author agreed to the story being shared. The instructor answered: "License for image is fine for the lower res version, and Jing and I are fine with sharing the fire story."

**What it gave us:** The repository was made public, because the organization's plan only publishes Pages sites from public repositories, and Pages was turned on for the `main` branch. The story is at https://sustainable-solutions-lab.github.io/ess115-project-template/ and the comparison of versions is at https://sustainable-solutions-lab.github.io/ess115-project-template/compare.html.

**How it was checked:**

- By a person: the instructor confirmed the photo license and the agreement of the study's lead author. These were decisions only a person could make; the AI raised them and waited.
- By the AI, before the repository became public: every file in every past version was listed and scanned for anything that should not be public (manuscript files, raw study data, private file paths). None was found. The repository holds only aggregated data and the script that made it.
- By the AI, after publishing: the live story and the comparison page were loaded at desktop and phone widths, with no failed requests.

**What we kept, changed or threw out, and why:** Nothing in the story changed. The copy of the photo in the repository is 2,000 pixels wide, cut down from the licensed file.

**Not yet checked:**

- Whether 2,000 pixels wide is what the instructor meant by "the lower res version" of the photo.
- Tapping for values on a real phone.
- The open items from v0.1 below (the cutoff for the best tenth, the choice of 38°N, the coarse map).

---

### 2026-11-24 · Phase 5 · who: S. Davis (instructor) · version: v0.2

**Kind of change:** aesthetic (hero photo, centered charts, charts that hold still) and substantive (why parts of the map are blank, the title of the first map, the claim that readers can tap for values)

**Tool:** Claude (Anthropic), in Claude Code

**What was asked:** "I'd like to have a hero image at the top, in this case one from my stock of fire photos in Dropbox should work well. The one with the bay bridge in red sky would be good. Figures should be centered on the page and if colors or lines appear on the figure as the user scrolls it ought not to jittery. As it is now the addition of entries in the legend cause the California map to jump around. The title of the first map is confusing because no colors are visible until scrolling, so 'benefits minus one-time cost' is not true. The reason that the Central Valley and desert are excluded is that they are not at risk of wildfire, not a lack of data. Captions all say hover for values, but at least on my phone. I can't seem to get any values to come up when I tap or hover over the map. instead of 'for each place, let's say 'in each location.'"

**What it gave us:**

- A photo behind the headline (`images/hero.jpg`), set by four `hero` lines at the top of `story.md` so any story can have one. The photo is a cropped, reduced copy of a licensed stock photo; the credit under it was read from the original file's metadata.
- Charts centered on the page. The text steps now pass down the left margin on wide screens and over the chart on narrow ones.
- Charts that do not move. The page sets aside room for the longest title, legend and note of any step, and gives the chart one size for the whole section. This is built into the page, so it applies to every story made from the template.
- A first map step with its own title ("Where wildfire can burn") and no claim about values. The net-benefit title appears with the colors.
- New wording for the study area in the story, the legend and `METHODS.md`.
- Tapping a chart on a touch screen now shows the value. The first version only worked with a mouse.
- "For each place" is now "In each location."
- `compare.html`, which shows any two versions side by side, with frozen copies in `versions/`. [Compare v0.1 and v0.2](compare.html).

**How it was checked:**

- By the AI, in a headless browser, at desktop, tablet and phone widths, in light and dark mode: the position and size of the map were measured at every one of the seven steps and are identical to the pixel at each width; the center of every chart is the center of the page; the page has no errors and does not scroll sideways.
- By the AI, with a simulated touch screen: a tap on the map and a tap on the bar chart each bring up the value, and a tap elsewhere removes it.
- By the AI, against the preprint: the study describes its area as the places where the probability of burning is greater than zero, which matches the instructor's correction.
- By the AI: the original photo file is unchanged (same checksum before and after).
- By a person: not yet. The instructor has not yet seen v0.2, and nobody has tried the tap on a real phone.

**What we kept, changed or threw out, and why:**

- **Corrected an error the AI made, and a person caught.** v0.1 said the blank parts of the map "are not in the data." The AI had inferred that from the empty cells in the grid without checking why they were empty. The instructor, who knows the study, supplied the real reason: the Central Valley and the desert are not at risk of wildfire, so the study does not include them. An empty cell can mean "not measured" or "not applicable," and the data alone do not say which. This is the kind of error to watch for in your own project.
- Changed the legend label from "Land included in the study" to "Land at risk of wildfire."
- Kept the promise that readers can tap for values, because it now works in testing, and took it off the first map step, where no values are shown.
- Kept every number. No statistic changed in this version.

**Not yet checked:**

- Whether the tap works on the instructor's own phone. A simulated touch screen is not a real one.
- The right to publish the photo. It is a Reuters photo licensed through Alamy. The license the instructor bought may not cover a public repository or student copies of it. Replace the photo or confirm the license before this repository is made public.
- Still open from v0.1: which cutoff for the best tenth is current, $198,000 or $220,000 per km². The study's lead author should say.
- Still open from v0.1: the split at 38°N is our choice of line, not the preprint's.
- Still open from v0.1: nobody has compared the coarse map (cells about 5 km across) with the full-resolution one by eye.
- Still open from v0.1: the study's lead author has not yet seen the story, and nobody has read it line by line against the preprint.
- Still open from v0.1: the preprint is in review, so its numbers may change.

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
