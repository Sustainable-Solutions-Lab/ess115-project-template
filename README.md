# EarthSys 115 project repository

This is the home of one class research project. It holds everything about the project, from the first question to the finished story, and it travels with the project as it passes from group to group.

| Phase | Folder | What the group adds |
|---|---|---|
| 1. Question | `1-question/` | The research question and why it matters |
| 2. Literature review | `2-literature/` | What is known, what is not, and the sources |
| 3. Plan | `3-plan/` | Data, methods and expected result, ready for someone else to carry out |
| 4. Analysis | `4-analysis/` | Code, clean data, and one chart spec per figure |
| 5. Write-up | `story.md`, `METHODS.md` | A scrolling data story and a two-page methods note |
| Every handoff | `receipt-memos/` | The receiving group's one-page memo on what it inherited |
| Every phase | `AI_LOG.md` | What you asked an AI tool, and how you checked the answer (start from `AI_LOG_TEMPLATE.md`) |

Each folder has a short README that says what belongs in it.

**Starting your own project?** Delete `versions/`, `compare.html` and `log-snapshots/`, and replace `AI_LOG.md` with a copy of `AI_LOG_TEMPLATE.md`. Those files record how the example story was revised (open `compare.html` to see two versions side by side) and are not part of your project.

The repository starts with a complete example: *The best places to fight fire before it starts*, a story about where treating wildfire fuels pays off in California, with its data, charts and methods note. Read it to see what a finished project looks like, then replace it with your own.

---

## 1. GitHub in ten minutes

GitHub is where researchers, programmers and journalists keep projects that change over time. Every saved change (a **commit**) is recorded with who made it and a note on why. You can see the whole history of a project and undo mistakes.

### Phase 1 group: create the project's repository

1. **Make an account** at [github.com/signup](https://github.com/signup). Any email works.
2. Open the class template repository and click **Use this template → Create a new repository**. Choose a short name (for example `ess115-smoke-days`). One person does this; the repository belongs to their account.
3. **Add your group.** Go to **Settings → Collaborators → Add people** and invite each member by GitHub username. Add your TA as well.

### Making changes

You can work entirely in the browser:

- Open a file (for example `story.md`) and click the pencil icon to edit it.
- When you are done, click **Commit changes**. Write a short message saying what you changed ("Add step about 2020 smoke days") and commit to `main`.
- To add a file, open the folder it belongs in and choose **Add file → Upload files** or **Create new file**.

If you would rather work on your own computer, install [GitHub Desktop](https://desktop.github.com/). **Clone** the repository, edit files in any text editor, then **commit** and **push**. **Pull** before each work session to get your teammates' changes.

### Handing the project to the next group

At each handoff, the project moves to a group that has not seen it before. Either of these works:

- **Add them as collaborators (simplest).** The sending group invites every member of the receiving group under **Settings → Collaborators**. Everyone keeps working in the same repository and the history stays in one place.
- **Fork it.** The receiving group clicks **Fork** on the repository page to make its own copy, history included, and works there. Use this if the sending group's owner is hard to reach. Tell your TA the new address.

Before you hand off, make sure everything is committed, your phase folder has its deliverable, and `AI_LOG.md` is up to date. The receiving group then writes its receipt memo (see `receipt-memos/`).

### Phase 5 group: publish the story

Go to **Settings → Pages**. Under *Build and deployment* choose **Deploy from a branch**, branch **main**, folder **/ (root)**, and save. After a minute or two GitHub shows your story's address, something like `https://yourname.github.io/ess115-smoke-days/`. That link is what you share. The site updates about a minute after each commit.

### Previewing on your own computer (optional)

Double-clicking `index.html` will not work, because browsers do not let a page read files from your disk. Instead, open a terminal in the repository folder, run the line below, and go to <http://localhost:8000>.

```
python3 -m http.server 8000
```

---

## 2. Writing the story: `story.md`

The story is one text file. You write paragraphs as you would anywhere, and mark the special parts with a few plain symbols. Open `story.md` beside this section to follow along.

### The top section

The file starts with the headline and byline, between two lines of three dashes:

```
---
kicker: EarthSys 115 · Winter 2027
title: Your headline
dek: One or two sentences that say what you found.
byline: By **Your Names**
date: March 2027
hero: images/hero.jpg
hero_alt: What the photo shows, for readers who cannot see it
hero_credit: Where and when it was taken. Photo: who took it, and the license
hero_focus: 50% 35%
---
```

The four `hero` lines put a photo behind the headline. They are optional; leave them out for a plain headline.

- Put the photo in `images/`. Resize it first to about 2,000 pixels wide and under 500 KB, so the page loads quickly on a phone.
- **Use only photos you have the right to publish**, such as your own, or ones with a Creative Commons or public-domain license (Wikimedia Commons, Unsplash, NASA and NOAA are good places to look). Always write the credit. A photo you found in a search engine is not yours to use.
- `hero_focus` says which part of the photo to keep in view when it is cropped to fit the screen: across, then down. `50% 35%` means the middle, a third of the way down.

### Paragraphs and headings

Leave a blank line between paragraphs. Start a line with `## ` to make a section heading.

### A scrolling section

This is the heart of the story: a chart that stays on screen while short steps of text scroll past, changing the chart as they go.

```
:::scrolly
chart: treatment-map
title: Net benefit of treating wildfire fuels
subtitle: First-year benefits minus one-time cost
note: Data: Cheng et al., in review.

::step
mode: 1
legend: pos = Benefits exceed costs | neg = Costs exceed benefits

Benefits come out ahead on ==pos:60 percent== of the land.

::step
mode: 3

Now keep only the best tenth.

:::
```

- `:::scrolly` opens the section and a line with only `:::` closes it.
- `chart:` is the name of a file in `4-analysis/charts/`, without `.json`.
- Each `::step` starts a new step. Directly under it, list that step's **settings**, one per line. Then leave a blank line and write the text.
- The settings a chart understands are listed at the top of its file (look for `"params"`). Here `mode: 1` tells the map to color gains and losses. A setting you leave out goes back to its default, so each step describes its whole state.
- A step can also change the `title`, `subtitle`, `note` or `legend`, or switch to a different `chart`. Make the title true of what the reader can see at that step: if a step shows only the study area, do not title it with the result.
- The chart never moves when a step changes it. The page sets aside room for the longest title and legend of any step in the section, and gives the chart one size for the whole section.
- `legend:` makes the color key above the chart. Each entry is a color name from the design system, an equals sign, and a label. Separate entries with `|`.

Good steps are short: one idea, two or three sentences, and a chart that shows exactly that idea.

### A single chart

```
:::chart
chart: net-benefit-by-tenth
title: The best tenth returns far more than the rest
note: Computed from the study's net-benefit grid.
table: 4-analysis/data/net_benefit_deciles.csv

A sentence or two on what the reader should see.
:::
```

`table:` adds a "Show the data" button under the chart.

### Sources

End the story with a `:::sources` block. Inside it, `### ` makes a small heading and `- ` makes a list item. Every number in the story must trace back to something listed here.

### Formatting inside text

| Write | Get |
|---|---|
| `**bold**` | **bold** |
| `*italic*` | *italic* |
| `[Firefuels map](https://...)` | a link |
| `==2015==` | the words in the accent color |
| `==pos:60 percent==` | the words in the color named `pos`, to match that color in the chart |

### If something breaks

If you see a box that says **There is a mistake in your story**, it names the line and says what to fix. The usual causes are a block that was never closed with `:::`, or a step with no blank line between its settings and its text.

---

## 3. Data and charts: `4-analysis/`

### Data

Put each dataset in `4-analysis/data/` as a CSV file with one header row. Keep the code that made it in `4-analysis/code/`. Say in `METHODS.md` where the raw data came from and when you got it.

### Charts

Charts are written in [Vega-Lite](https://vega.github.io/vega-lite/), a standard way to describe a chart in a text file. To make a new one:

1. Copy the existing chart closest to what you want and rename it (for example `4-analysis/charts/smoke-days.json`).
2. Change `"url"` to point at your CSV and change the field names to your column names.
3. Use it in `story.md` with `chart: smoke-days`.

The [Vega-Lite online editor](https://vega.github.io/editor/) is a quick place to experiment. Its example gallery covers most chart types.

**Colors come from the design system.** In a chart file, write `token:accent` for the highlight color, `token:context` for everything that is not the point, `token:pos` and `token:neg` for gains and losses, and `token:ink` for lines and labels. The full list is at the top of `css/design.css`. Do not type color codes into charts: the named colors keep every chart consistent, are chosen to be readable by colorblind readers, and switch for dark mode.

**Making a chart change between steps.** Give the chart a setting with a default value:

```json
"params": [ { "name": "hl_year", "value": 0, "description": "Year to highlight (0 = none)" } ]
```

Then use it wherever Vega-Lite takes an expression, such as a color (`datum.year == hl_year ? 'token:accent' : 'token:context'`) or a filter (`{"filter": "datum.year <= hl_year"}`). The example map shows four uses: switching what the colors mean, adding a line, adding labels, and zooming. Keep the axes and the size of the plot the same in every step (set the axis range yourself, as the examples do), so that only the thing you are pointing at changes.

**Tooltips.** Add a `tooltip` to a chart and readers can hover over a mark, or tap it on a phone, to see its value. Say so in the chart's `note` only after you have tried it on your own phone.

**Maps.** `treatment-map.json` draws a map from a CSV of grid cells (longitude, latitude, value) and a CSV outline. To map your own gridded data, copy it and point it at your files. Keep map data under about 15,000 rows so it stays fast on a phone.

---

## 4. The methods note: `METHODS.md`

The story is for a general reader. `METHODS.md` is the two-page note for a skeptical one. It covers your data, methods, assumptions, uncertainties and credits. The example in this repository shows the level of detail expected, including a place where our numbers differ from the source and what we did about it.

---

## 5. Using AI on this project

AI assistants are good at editing these files, and you are welcome to use them. Three rules:

1. **Ask for small, specific edits.** For example: "In `4-analysis/charts/smoke-days.json`, color the bar for 2020 with `token:accent`." Or: "Add a step to the first scrolly section of `story.md` that sets `hl_year` to 2018." Paste in the file you want changed. Avoid "make my story better."
2. **Check every number against your data.** An AI will write a confident sentence with a wrong number in it. Before you commit any text that contains a number, find that number in your CSV or source, or recompute it yourself. A back-of-envelope estimate is a good second check. Then open the page and make sure the chart shows what the sentence says.
3. **Log it.** Add an entry to `AI_LOG.md` each time: what you asked, what you got, how you checked it, and what you kept. The log is part of your grade, and the next group will read it. The `AI_LOG.md` that comes with this repository is the teaching team's real log for the example story, including each change the instructor asked for; use it as your model, then replace it with a copy of `AI_LOG_TEMPLATE.md`.

---

## For instructors and anyone hosting a story elsewhere

The story is plain static files with relative paths only, so a finished story works from any folder on any web server (for example `https://example.org/teaching/2027/smoke-days/`). Copy `index.html`, `story.md`, `css/`, `js/`, `images/`, `4-analysis/data/` and `4-analysis/charts/`. The folder address must end with a slash. Fonts and the chart library load from public CDNs, so the page needs an internet connection.

## Credits

Template by the EarthSys 115 teaching team, Stanford University. Charts use [Vega-Lite](https://vega.github.io/vega-lite/) (BSD-3 license). Fonts: Libre Franklin and Source Serif 4 (SIL Open Font License). Example research: Cheng et al., *Prioritizing wildfire fuel management in California*, [EarthArXiv](https://eartharxiv.org/repository/view/9858/), in review.
