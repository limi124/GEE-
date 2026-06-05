# Script Index

| Script | 中文主题 | Purpose | User parameters to check |
| --- | --- | --- | --- |
| `scripts/dynamic_world_10m_land_cover.js` | 10 m 土地利用 | Generate a yearly Dynamic World mode composite and export land-cover raster. | `region`, `start`, `end`, export folder/name |
| `scripts/sentinel2_building_extraction_ghsl_height.js` | 建筑物分割 | Extract built-up areas with Sentinel-2 spectral indices and visualize/export GHSL building height. | `aoi`, `start`, `end`, cloud threshold, minimum area |
| `scripts/gpm_extreme_precipitation_analysis.js` | 极端降水 | Analyze extreme precipitation days and rainfall statistics from IMERG. | `ASSET_FC_ID`, date range, threshold, export switch |
| `scripts/landsat_cropland_random_forest.js` | 耕地反演 | Train a random forest cropland classifier with Landsat indices and ESA WorldCover labels. | Training/study regions, date range, sample size |
| `scripts/basin_irrigated_rainfed_cropland_ndvi.js` | 灌溉/雨养耕地 NDVI | Compare irrigated and rainfed cropland distribution and NDVI time series at basin scale. | Basin center, NDVI date range, export switches |
| `scripts/landsat_chlorophyll_a_random_forest_timeseries.js` | 叶绿素 a | Estimate chlorophyll-a with empirical formula and random forest regression, then analyze time series. | Study geometry, date range, sampling/training variables |

## Known cleanup tasks

- Some scripts contain repeated promotional placeholder text. Remove those lines before claiming the script is production-ready.
- Some scripts depend on private Earth Engine assets under `projects/land-111/assets/...`; users outside that account need to replace those IDs.
- Run each script once in GEE Code Editor after editing because Earth Engine APIs cannot be fully validated by local JavaScript tooling.
