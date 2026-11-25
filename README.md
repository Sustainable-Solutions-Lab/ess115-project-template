# EarthSys 115 story template

This repository is a starting point for your group's final project: a scrolling data story, in the style of the interactive pieces newspapers publish. As a reader scrolls, short paragraphs pass by and the chart beside them changes to show what each paragraph says.

The example story, *Fewer fires, more acres*, uses 43 years of US wildfire statistics. Replace it with your own.

You do not need to know how to code. Your story is three kinds of files:

| What | Where | Format |
|---|---|---|
| The words, and which chart each paragraph shows | `story/story.json` | JSON |
| Your data | `data/` | CSV (one header row, then one row per observation) |
| Your charts | `charts/` | Vega-Lite specs (JSON) |

Leave `index.html`, `css/` and `js/` alone unless your group decides to change the design.

---

## 1. Getting started on GitHub

GitHub is where researchers, programmers and journalists keep projects that change over time. Every saved change (a **commit**) is recorded with who made it and why, so you can see the history of your project and undo mistakes.

1. **Make an account** at [github.com](https://github.com/signup). Any email works; your Stanford email lets you apply for free [GitHub Education](https://education.github.com/) benefits.
2. **Make your group's copy.** Open the class template repository and click **Use this template → Create a new repository**. Give it a short name (for example `ess115-wildfire-smoke`), make it **Public**, and create it. Only one person in the group needs to do this.
3. **Add your teammates.** In your new repository, go to **Settings → Collaborators → Add people** and invite each group member by their GitHub username. Add the TAs too.
4. **Turn on the website.** Go to **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, then branch **main** and folder **/ (root)**, and click **Save**. After a minute or two, GitHub shows your site's address, something like `https://yourname.github.io/ess115-wildfire-smoke/`. That link is what you share.

### Making changes

You can work entirely in the browser:

- Click a file (for example `story/story.json`), then the pencil icon to edit it.
- When you are done, click **Commit changes**. Write a short message that says what you changed ("Add step about 2020 smoke days"), and commit straight to `main`.
- Your site updates about a minute later. Reload the page to see it.

To add a data file, open the `data` folder and choose **Add file → Upload files**.

If you prefer working on your own computer, install [GitHub Desktop](https://desktop.github.com/). Then **clone** the repository, edit the files in any text editor, **commit**, and **push**. Before you start each session, **pull**, so you have your teammates' latest changes.

### Seeing your changes before you commit (optional)

Opening `index.html` by double-clicking it will not work, because browsers block pages from loading local files. To preview on your own computer, run this in a terminal from the repository folder, then open <http://localhost:8000>:

```
python3 -m http.server 8000
```

### Handing the project to the next group

When your phase ends, give the next group's members collaborator access, or have them use **Use this template** on your repository. The commit history and `AI_LOG.md` go with the project, so the next group can see what you did and why.

---

## 2. Writing the story: `story/story.json`

The file has a `meta` section (headline, dek, byline) and a list of `blocks` that appear in order down the page. There are four kinds of block.

**Text**, a heading (optional) and paragraphs:

```json
{
  "type": "text",
  "heading": "Is it because there are more fires?",
  "body": ["First paragraph.", "Second paragraph."]
}
```

**Scrolly**, a sticky chart with steps that scroll past it:

```json
{
  "type": "scrolly",
  "chart": "acres-by-year",
  "title": "Acres burned by US wildland fires",
  "subtitle": "Millions of acres per year, 1983–2025",
  "note": "Source: National Interagency Fire Center",
  "steps": [
    { "text": "Each bar is one year.", "params": {} },
    { "text": "Since ==2000== the average has doubled.",
      "params": { "hl_start": 2000, "hl_end": 2025, "show_means": 2 } }
  ]
}
```

- `chart` is the name of a file in `charts/`, without `.json`.
- `params` set what the chart shows at that step. Each chart lists the params it understands at the top of its file. A param you leave out goes back to its default, so every step describes its full state.
- A step can switch to a different chart with its own `"chart": "..."`, and change the `title`, `subtitle` or `note` the same way.

**Chart**, a full-width chart that does not change:

```json
{
  "type": "chart",
  "chart": "fires-by-year",
  "title": "Number of US wildland fires",
  "caption": "One or two sentences on what the reader should see.",
  "table": "data/nifc_us_wildfires.csv"
}
```

Including `table` adds a "Show the data" button under the chart.

**Sources**, the footer, with sections for data, methods and credits. Every number in your story must trace back to something listed here.

### Formatting inside text

| Write | Get |
|---|---|
| `**bold**` | **bold** |
| `*italic*` | *italic* |
| `==2015==` | the word in the highlight color, to match the highlighted part of the chart |
| `[NIFC](https://www.nifc.gov)` | a link |

### Common JSON mistakes

If the page shows a red box instead of your story, it tells you the line with the problem. Usually it is one of these:

- A missing comma between two items, or an extra comma after the last item in a list.
- A straight double quote `"` inside your text. Use curly quotes (“ ”), or write `\"`.
- A missing closing `]` or `}`.

---

## 3. Data and charts

### Data

Put each dataset in `data/` as a CSV file. Keep the original download next to it if you cleaned it, and say in the sources footer where it came from and when you downloaded it.

### Charts

Charts are written in [Vega-Lite](https://vega.github.io/vega-lite/), a standard way to describe a chart as JSON. Open any file in `charts/` to see one. The easiest way to make a new chart:

1. Copy the existing chart closest to what you want, and rename it (for example `charts/smoke-days.json`).
2. Change `"url"` to point at your CSV, and change the field names to your column names.
3. Use it in `story.json` with `"chart": "smoke-days"`.

To try out changes quickly, paste a spec into the [Vega-Lite online editor](https://vega.github.io/editor/). Change the data `url` to the full address of your CSV on GitHub, which you get by opening the CSV file on GitHub and clicking **Raw**.

**Colors come from the design system.** Write `"token:accent"` for the highlight color, `"token:context"` for everything else, `"token:accent-2"` for a second series, and `"token:ink"` for lines and labels. Do not type hex codes into charts. Using tokens keeps every chart consistent and makes dark mode work.

**Making a chart change between steps.** Declare a param at the top of the chart with a default value:

```json
"params": [ { "name": "hl_start", "value": 0, "description": "First year to highlight" } ]
```

Then use it anywhere Vega-Lite accepts an expression, for example in a color condition (`"test": "datum.year >= hl_start"`), a filter (`{"filter": "datum.year == note_year"}`), or an axis range (`"domain": {"expr": "[x_min, x_max]"}`). The example charts show all three: highlighting a period, adding a layer, labeling one point, and zooming.

**Phase 4 (analysis) handoff format:** deliver each figure as a CSV in `data/` and a Vega-Lite spec in `charts/` that draws it. A picture of a chart cannot be restyled or checked; a spec plus its data can.

---

## 4. Using AI on this repository

AI assistants are good at editing JSON and Vega-Lite, and you are welcome to use them. Three rules:

1. **Ask for small, specific edits.** For example: "In `charts/smoke-days.json`, color the bars for 2020 with `token:accent`." Or: "Add a step to the first scrolly block that highlights 2010–2015." Paste in the file you want changed. Avoid "make my story better."
2. **Check every number against your data.** An AI will write a confident sentence with a wrong number in it. Before you commit any text with a number in it, find that number in your CSV or source yourself, or recompute it. A back-of-envelope estimate is a good second check. Then look at the chart in the browser and make sure it shows what the text says.
3. **Log it.** Add an entry to `AI_LOG.md` each time: what you asked, what you got, how you checked it, and what you kept. The log is part of your grade, and the next group will read it.

---

## Credits

Template by the EarthSys 115 teaching team, Stanford University. Charts use [Vega-Lite](https://vega.github.io/vega-lite/) (BSD-3 license). Fonts: Libre Franklin and Source Serif 4 from Google Fonts (SIL Open Font License). Example data: National Interagency Fire Center.
