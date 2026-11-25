"""Turn the 0.01-degree net-benefit grid into the small CSV files the story uses.

Input (not in this repository): Net_benefit_map_0.01d.nc, the grid behind the
Firefuels map at https://sustainablesolutions.stanford.edu/tools/firefuels
(Cheng et al., in review). One variable, Net_benefit, in thousands of dollars
per square kilometer: first-year benefits of treating a cell with the
lowest-cost method under the current climate, minus the one-time cost.

Run:  python aggregate_net_benefit.py /path/to/Net_benefit_map_0.01d.nc

Outputs, written to ../data/:
  net_benefit_grid_0.05deg.csv   map cells (25 fine cells averaged into one)
  net_benefit_deciles.csv        analyzed area split into tenths, best first
  net_benefit_by_latitude.csv    one-degree latitude bands
  summary_stats.csv              every number quoted in the story that comes from the grid

Needs: numpy, xarray, netCDF4.
"""
import csv
import sys
from pathlib import Path

import numpy as np
import xarray as xr

OUT = Path(__file__).resolve().parent.parent / "data"
COARSE = 5            # 5 x 5 fine cells -> 0.05 degree
MIN_FINE_CELLS = 5    # drop coarse cells with fewer analyzed fine cells than this
SPLIT_LAT = 38.0      # "north" in the story means north of this latitude

ds = xr.open_dataset(sys.argv[1])
net = ds["Net_benefit"].values.astype("float64")           # $k per km2
lat = ds["lat"].values.astype("float64")
lon = ds["lon"].values.astype("float64")
ok = np.isfinite(net)

# Area of each 0.01-degree cell in km2 (shrinks toward the north).
km_per_deg = 111.32
area = np.broadcast_to(
    (km_per_deg * 0.01) * (km_per_deg * 0.01 * np.cos(np.deg2rad(lat)))[:, None], net.shape
)
LAT = np.broadcast_to(lat[:, None], net.shape)

v, w, la = net[ok], area[ok], LAT[ok]
total_area = w.sum()

# Rank cells from highest to lowest net benefit and mark the best tenth of the AREA.
order = np.argsort(-v)
cum_share = np.cumsum(w[order]) / total_area
decile_sorted = np.minimum((cum_share * 10).astype(int), 9) + 1      # 1 = best tenth
decile = np.empty_like(decile_sorted)
decile[order] = decile_sorted
top = decile == 1

# ---- 1. coarse map grid ----
dec_grid = np.full(net.shape, np.nan)
dec_grid[ok] = decile
rows = []
ny, nx = (net.shape[0] // COARSE) * COARSE, (net.shape[1] // COARSE) * COARSE
for i in range(0, ny, COARSE):
    for j in range(0, nx, COARSE):
        m = ok[i:i + COARSE, j:j + COARSE]
        n = int(m.sum())
        if n < MIN_FINE_CELLS:
            continue
        a = area[i:i + COARSE, j:j + COARSE][m]
        x = net[i:i + COARSE, j:j + COARSE][m]
        d = dec_grid[i:i + COARSE, j:j + COARSE][m]
        rows.append((
            round(lon[j:j + COARSE].mean(), 3), round(lat[i:i + COARSE].mean(), 3),
            round(float(np.average(x, weights=a)), 1),      # mean net benefit, $k/km2
            round(float(a[d == 1].sum() / a.sum()), 2),     # share of the cell in the best tenth
            n,
        ))
with open(OUT / "net_benefit_grid_0.05deg.csv", "w", newline="") as f:
    cw = csv.writer(f)
    cw.writerow(["lon", "lat", "net_k_per_km2", "top10_share", "fine_cells"])
    cw.writerows(rows)

# ---- 2. deciles ----
with open(OUT / "net_benefit_deciles.csv", "w", newline="") as f:
    cw = csv.writer(f)
    cw.writerow(["decile", "label", "area_km2", "mean_net_k_per_km2", "total_net_billion_usd"])
    for k in range(1, 11):
        m = decile == k
        label = "Best 10%" if k == 1 else ("Worst 10%" if k == 10 else f"{(k - 1) * 10}–{k * 10}%")
        cw.writerow([k, label, round(w[m].sum()), round(float(np.average(v[m], weights=w[m])), 1),
                     round(float((v[m] * w[m]).sum() / 1e6), 2)])

# ---- 3. latitude bands ----
with open(OUT / "net_benefit_by_latitude.csv", "w", newline="") as f:
    cw = csv.writer(f)
    cw.writerow(["lat_band_south_edge", "area_km2", "share_positive", "mean_net_k_per_km2", "top10_area_km2"])
    for lo in range(32, 42):
        m = (la >= lo) & (la < lo + 1)
        if m.sum() == 0:
            continue
        cw.writerow([lo, round(w[m].sum()), round(float(w[m & (v > 0)].sum() / w[m].sum()), 3),
                     round(float(np.average(v[m], weights=w[m])), 1), round(w[m & top].sum())])

# ---- 4. the numbers the story quotes ----
north = la >= SPLIT_LAT
pos = v > 0
stats = [
    ("analyzed_area_km2", round(total_area), "km2", "Area of the study area: all grid cells with a chance of burning"),
    ("share_area_positive", round(float(w[pos].sum() / total_area), 3), "fraction", "Area where benefits exceed costs"),
    ("top10_area_km2", round(w[top].sum()), "km2", "Area of the best tenth"),
    ("top10_threshold_k_per_km2", round(float(v[top].min()), 1), "$k/km2", "Lowest net benefit inside the best tenth"),
    ("top10_mean_k_per_km2", round(float(np.average(v[top], weights=w[top])), 1), "$k/km2", "Mean net benefit in the best tenth"),
    ("top10_total_net_billion_usd", round(float((v[top] * w[top]).sum() / 1e6), 2), "$ billion", "Net benefit of treating the whole best tenth once"),
    ("positive_total_net_billion_usd", round(float((v[pos] * w[pos]).sum() / 1e6), 2), "$ billion", "Net benefit of treating every area where benefits exceed costs"),
    ("negative_total_net_billion_usd", round(float((v[~pos] * w[~pos]).sum() / 1e6), 2), "$ billion", "Net loss from treating every area where costs exceed benefits"),
    ("top10_share_of_positive_total", round(float((v[top] * w[top]).sum() / (v[pos] * w[pos]).sum()), 3), "fraction", "Best tenth as a share of all positive net benefit"),
    ("mean_net_all_k_per_km2", round(float(np.average(v, weights=w)), 1), "$k/km2", "Mean net benefit over the whole analyzed area"),
    ("min_net_k_per_km2", round(float(v.min()), 1), "$k/km2", "Lowest cell"),
    ("max_net_k_per_km2", round(float(v.max()), 1), "$k/km2", "Highest cell"),
    ("north_share_of_top10_area", round(float(w[top & north].sum() / w[top].sum()), 3), "fraction", f"Share of the best tenth that lies north of {SPLIT_LAT:g} N"),
    ("north_share_of_analyzed_area", round(float(w[north].sum() / total_area), 3), "fraction", f"Share of the analyzed area north of {SPLIT_LAT:g} N"),
    ("north_share_area_positive", round(float(w[north & pos].sum() / w[north].sum()), 3), "fraction", f"North of {SPLIT_LAT:g} N: area where benefits exceed costs"),
    ("south_share_area_positive", round(float(w[~north & pos].sum() / w[~north].sum()), 3), "fraction", f"South of {SPLIT_LAT:g} N: area where benefits exceed costs"),
    ("north_mean_net_k_per_km2", round(float(np.average(v[north], weights=w[north])), 1), "$k/km2", f"Mean net benefit north of {SPLIT_LAT:g} N"),
    ("south_mean_net_k_per_km2", round(float(np.average(v[~north], weights=w[~north])), 1), "$k/km2", f"Mean net benefit south of {SPLIT_LAT:g} N"),
    ("years_to_treat_top10_at_4000_km2_per_year", round(float(w[top].sum() / 4000), 1), "years", "Best tenth divided by the planned 4,000 km2 per year"),
]
with open(OUT / "summary_stats.csv", "w", newline="") as f:
    cw = csv.writer(f)
    cw.writerow(["stat", "value", "unit", "what_it_is"])
    cw.writerows(stats)

for s in stats:
    print(f"{s[0]:45s} {s[1]}")
print(len(rows), "map cells")
flag = [r for r in rows if r[3] >= 0.5]
print("map cells drawn as best tenth:", len(flag), "of", len(rows))
