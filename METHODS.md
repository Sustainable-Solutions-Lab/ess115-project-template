# Methods and sources

**Story:** The best places to fight fire before it starts
**Authors of this note:** EarthSys 115 teaching team (example for the class)
**Date:** November 24, 2026

*This is the two-page methods and sources note that goes with a finished story. Yours should have the same six sections.*

## 1. Question

Where in California does treating wildfire fuels return the most benefit relative to its cost, and how concentrated are those places?

## 2. Data

| Dataset | What it is | Source | Where it lives |
|---|---|---|---|
| Net-benefit grid | Net benefit of fuel treatment, in thousands of dollars per km², on a 0.01-degree grid (about 1 km). First-year benefits (avoided building loss and avoided smoke-related illness and death) minus the one-time cost of the lowest-cost treatment, under the current climate. The grid covers the land where the modeled probability of burning is above zero: 292,879 cells. The Central Valley and the low desert fall outside it because they are not at risk of wildfire, not because data are missing. | Cheng et al., *Prioritizing wildfire fuel management in California*, EarthArXiv preprint, [doi:10.31223/x5j15m](https://eartharxiv.org/repository/view/9858/). The grid is the one behind the lab's [Firefuels map](https://sustainablesolutions.stanford.edu/tools/firefuels). Obtained from the authors, November 2026. | Not in this repository (ask the authors). Our summaries of it are in `4-analysis/data/`. |
| California outline | State boundary | U.S. Census Bureau cartographic boundary files, 1:10,000,000, through the `us-atlas` package, version 3.0.1 | `4-analysis/data/california_outline.csv` |
| City locations | Six cities, for orientation only | Standard published coordinates | `4-analysis/data/places.csv` |

The preprint is in review and has not yet been peer reviewed. Its numbers may change.

## 3. Methods

All calculations are in `4-analysis/code/aggregate_net_benefit.py`. Every number we computed is listed in `4-analysis/data/summary_stats.csv`.

1. **Area.** Grid cells are equal in degrees, not in area, so we gave each cell an area of 1.2392 km² × cos(latitude). All shares and averages are weighted by area. The cells in the study area add up to 287,003 km², which is 68 percent of California's 423,970 km².
2. **Gain or loss.** A cell counts as a gain when its net benefit is above zero. That is 60.4 percent of the area.
3. **Best tenth.** We sorted cells from highest to lowest net benefit and took cells until they added up to 10 percent of the area (28,700 km²). The lowest value in that set is $197,600 per km² and the area-weighted mean is $260,300. We repeated this for each tenth to make the bar chart.
4. **Totals.** For any set of cells, the total net benefit is the sum of net benefit × area. The best tenth totals $7.47 billion. All cells with a gain total $18.91 billion, so the best tenth holds 39.5 percent of it. The worst tenth totals a loss of $3.92 billion.
5. **North and south.** We split the state at 38°N. North of the line is 44.4 percent of the study area and 85.9 percent of the best tenth. Gains cover 87.5 percent of the area in the north and 38.8 percent in the south.
6. **Time to treat.** 28,700 km² divided by the 4,000 km² per year that agencies plan to treat (a figure from the preprint) is 7.2 years.
7. **Map.** To keep the map fast on a phone, we averaged the grid into 0.05-degree cells (5 × 5 original cells, area-weighted), dropping map cells with fewer than five original cells. A map cell is shaded as "best tenth" when at least 40 percent of its area is in the best tenth, a cutoff chosen so the shaded cells cover 10 percent of the map.

**Numbers we did not compute.** These come straight from the preprint: current treatment spending and the planned 4,000 km² per year; the share of benefits from avoided smoke (82, 77 and 69 percent in the top-ranked areas of three mapped regions); prescribed burning as the lowest-cost treatment on 62 percent of burnable land; the more than 6.5-fold gain from re-prioritizing; net costs in more than 60 percent of past treatments in the mapped parts of Los Angeles and Santa Barbara; the 15 percent rise in average net benefits by 2050 under a moderate warming scenario; and the uncertainty of about ±36 percent.

## 4. Assumptions

- We took the grid as given. We did not rerun or check the authors' cost, fire, smoke or health models.
- "Net benefit" compares one year of benefits with the full one-time cost of treatment, as the authors define it.
- We treated every cell in the study area (every cell with a probability of burning above zero) as land that could be treated. We did not remove places where treatment is not allowed or not practical.
- The 38°N line is our choice. It is a round number near San Francisco, picked before we looked at the split.

## 5. Uncertainties and limits

- **A difference from the preprint.** The preprint reports that the top 10 percent of areas have net benefits above $220,000 per km². From the grid we get a cutoff of $198,000 and a mean of $260,000. The area of the top tenth (28,700 km² here, 28,000 km² in the preprint) and the share of land with a gain (60 percent in both) agree. We have not resolved the difference. It may reflect a different version of the grid or a different way of ranking. The story uses our numbers for anything about the best tenth and says so.
- The authors estimate about ±36 percent uncertainty on net benefits. We did not carry that through to our totals, so the dollar totals should be read as central estimates.
- Ranking is more reliable than the dollar values. A cell near the cutoff could fall on either side of it.
- The extreme values (a loss of $400,000 and a gain of $1.1 million per km²) are single cells.
- Averaging to 0.05 degrees hides variation within each map cell. The statistics use the full-resolution grid; only the map is averaged.
- One year of benefits understates the value of treatments that last several years. The grid also leaves out damage to ecosystems, water supplies and infrastructure other than buildings.

## 6. Credits and AI use

- **Research:** Jing Cheng, Michael L. Goulden, Jim Randerson, Shane Coffield, A. Park Williams, Qiang Zhang, Michael D. Mastrandrea, Michael W. Wara and Steven J. Davis.
- **Analysis of the grid, charts and story:** EarthSys 115 teaching team.
- **Groups that worked on this project:** in your note, list every group and what it contributed (Phase 1 question, Phase 2 literature review, Phase 3 plan, Phase 4 analysis, Phase 5 story).
- **AI use:** The teaching team used Claude (Anthropic) to write the aggregation script, the chart specs and a first draft of the story. Every number in the story was checked against `summary_stats.csv` or the preprint. See `AI_LOG.md`.
