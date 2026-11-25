---
kicker: EarthSys 115 · Example story
title: The best places to fight fire before it starts
dek: Clearing wildfire fuels pays for itself on 60 percent of California's fire-prone land. But the biggest returns are packed into a tenth of it, mostly in the north, and the reason is smoke.
byline: By **the EarthSys 115 teaching team**, from research by Jing Cheng and colleagues
date: Winter 2027
---

<!-- This is the example story. Replace the words, charts and data with your own.
     README.md explains every part of this file. -->

California spends hundreds of millions of dollars a year thinning forests and setting prescribed burns so that wildfires, when they come, are smaller and less destructive. State and federal agencies plan to treat about 4,000 square kilometers a year. Far more land than that could use it.

So where should the crews go first? A team led by Jing Cheng at Stanford estimated, for every square kilometer of the state that can burn, what treatment would cost and what it would save. Scroll to see what they found.

:::scrolly
chart: treatment-map
title: Net benefit of treating wildfire fuels
subtitle: First-year benefits minus one-time cost, by 5-km cell
note: Data: Cheng et al., in review. Hover or tap for values.

::step
mode: 0
legend: context = Land included in the study

The study covers about **287,000 square kilometers**, roughly two-thirds of California. Blank areas, including most of the Central Valley and parts of the southeastern desert, are not in the data.

::step
mode: 1
legend: pos = Benefits exceed costs | neg = Costs exceed benefits

For each place, the researchers compared the cost of the cheapest treatment with what it would save in its first year: buildings not destroyed, and smoke not breathed. Benefits come out ahead on ==pos:60 percent== of the land. On the other ==neg:40 percent==, treatment costs more than it returns.

::step
mode: 2
legend: neg-high = Loss over $100k | neg-low = Loss | pos-low = Gain | pos-mid = Over $100k | pos-high = Over $200k per km²

The size of the payoff varies enormously, from a loss of about $400,000 per square kilometer to a gain of more than $1 million. Neighboring valleys can land on opposite sides of zero.

::step
mode: 3
legend: pos-high = Best tenth of the land | context = Everything else

Now rank every square kilometer and keep only the ==pos-high:best tenth==: 28,700 square kilometers. Treating any of it returns at least $198,000 per square kilometer more than it costs, and **$260,000** on average.

::step
mode: 3
split_lat: 38
show_places: yes
legend: pos-high = Best tenth of the land | context = Everything else

That tenth is not spread evenly. **86 percent** of it lies north of the 38th parallel, a line that runs just above San Francisco. The north holds only 44 percent of the land in the study.

::step
mode: 2
show_places: yes
x_min: -124.75
x_max: -119.35
y_min: 37.3
y_max: 42.25
subtitle: First-year benefits minus one-time cost, Northern California
legend: neg-high = Loss over $100k | neg-low = Loss | pos-low = Gain | pos-mid = Over $100k | pos-high = Over $200k per km²

Up close, the highest returns follow the forests: the northwestern coast ranges and the western slope of the Sierra Nevada, upwind of large population centers.

::step
mode: 1
show_places: yes
split_lat: 38
legend: pos = Benefits exceed costs | neg = Costs exceed benefits

South of the line the picture flips. Benefits exceed costs on only ==pos:39 percent== of the land there, compared with ==pos:88 percent== in the north. Steep, dry terrain makes treatment expensive, and around the deserts there are few people or buildings nearby to protect.

:::

## Why the north? Follow the smoke

A wildfire's damage does not stop at the fire line. Smoke from a fire in a remote forest can drift over millions of people, and the study counts the resulting hospital visits and early deaths as costs of that fire. When the authors looked closely at a forested part of Plumas and Sierra counties, avoided smoke accounted for **82 percent** of the benefits in the highest-ranked areas. Even in the parts of Los Angeles and Santa Barbara they examined, where homes are close to the fuel, smoke made up 77 and 69 percent.

That is why dense northern forests rank so high: they carry heavy fuel loads, their fires are large and smoky, and the smoke reaches populated areas downwind. It also changes the usual argument about prescribed fire. Burning on purpose makes smoke too, and the study charges that smoke against the treatment. Prescribed burning still comes out as the cheapest option on 62 percent of the burnable land.

## A tenth of the land, two-fifths of the payoff

:::chart
chart: net-benefit-by-tenth
title: The best tenth returns far more than the rest
subtitle: Mean net benefit, in thousands of dollars per square kilometer treated
note: Computed from the study's net-benefit grid. Each bar covers about 28,700 km².
table: 4-analysis/data/net_benefit_deciles.csv

Treating the entire best tenth once would return about $7.5 billion more than it costs. That is 40 percent of the net benefit available from all the land where treatment pays, on one-tenth of the area. Treating the worst tenth would lose about $3.9 billion.
:::

At the pace agencies are planning, 4,000 square kilometers a year, the best tenth could be treated in about seven years. The authors compared their ranking with where crews have worked in the past and concluded that choosing sites this way could raise the net benefits of treatment more than **6.5-fold**. In the parts of Los Angeles and Santa Barbara they mapped in detail, more than 60 percent of past treatments cost more than they returned.

Climate change strengthens the case. Under a moderate warming scenario, the study projects that average net benefits will be 15 percent higher by 2050, and that the best places will shift further north.

## What this does not tell you

These are model estimates, and the paper is still in peer review. The authors put the uncertainty on net benefits at roughly plus or minus 36 percent. They count one year of benefits against the full cost of a treatment, which understates the payoff where a treatment keeps working for several years. They leave out things that are hard to price, such as power lines, watersheds, wildlife and giant sequoias. And a high-ranked place may still be hard to treat: prescribed burns need permits, the right weather and trained crews.

The ranking is a way to choose among possible sites. It is not a plan. You can explore every square kilometer yourself with the lab's [Firefuels map](https://sustainablesolutions.stanford.edu/tools/firefuels).

:::sources
### Data and sources
- Cheng, J., Goulden, M. L., Randerson, J., Coffield, S., Williams, A. P., Zhang, Q., Mastrandrea, M. D., Wara, M. W. and Davis, S. J. [Prioritizing wildfire fuel management in California](https://eartharxiv.org/repository/view/9858/). EarthArXiv preprint, doi:10.31223/x5j15m. In review; not yet peer reviewed.
- Net-benefit grid (0.01 degrees, lowest-cost treatment, current climate) from the [Firefuels map](https://sustainablesolutions.stanford.edu/tools/firefuels), Sustainable Solutions Lab, Stanford University.
- California outline: U.S. Census Bureau cartographic boundaries, via the us-atlas package.

### Which numbers come from where
Computed by us from the grid (see `4-analysis/data/summary_stats.csv`): the area studied, the 60 and 40 percent split, the range of values, everything about the best tenth, the north and south comparisons, the bar chart, the $7.5 and $3.9 billion totals, and the seven-year estimate.

Taken from the preprint: current spending and the planned 4,000 square kilometers a year, the reasons treatment costs more than it returns in parts of the south, the smoke shares (82, 77 and 69 percent), prescribed burning as the cheapest option on 62 percent of burnable land, the 6.5-fold improvement, the 60 percent of past treatments with net costs in two mapped regions, the 15 percent increase by 2050, and the uncertainty of plus or minus 36 percent.

### Methods
The map shows 0.05-degree cells, each the area-weighted mean of up to 25 cells of the original grid. A map cell is drawn as part of the best tenth when at least 40 percent of its area is. Our full methods and sources note is in `METHODS.md`.

### Credits
Research: Jing Cheng and co-authors (above). Story, charts and analysis of the grid: the EarthSys 115 teaching team, as an example for the class. Replace this section with the names of your group and of every group that worked on your project before you.
:::
