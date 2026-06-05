# GEE Scripts

一个面向遥感、土地利用、农业和水文分析的 Google Earth Engine 脚本库。

本仓库用于沉淀可复用的 GEE JavaScript 示例。脚本优先保持简洁、可直接复制到 [Google Earth Engine Code Editor](https://code.earthengine.google.com/) 运行，并在文件顶部或 README 中说明研究区域、数据源、关键参数和导出结果。

## 目录结构

```text
.
├── scripts/          # 可直接在 GEE Code Editor 中运行的脚本
│   └── legacy/       # 历史版本或暂未整理完成的脚本
├── docs/             # 文档、脚本清单和维护规范
├── .gitignore
├── LICENSE
└── README.md
```

## 脚本清单

| 文件 | 主题 | 主要数据源 |
| --- | --- | --- |
| `scripts/dynamic_world_10m_land_cover.js` | 10 m 土地利用/覆盖分类合成 | Dynamic World |
| `scripts/sentinel2_building_extraction_ghsl_height.js` | 建筑物分割与建筑高度可视化/导出 | Sentinel-2, s2cloudless, GHSL |
| `scripts/gpm_extreme_precipitation_analysis.js` | 极端降水统计分析 | NASA GPM IMERG |
| `scripts/landsat_cropland_random_forest.js` | 耕地随机森林高精度反演 | Landsat 8/9, ESA WorldCover |
| `scripts/basin_irrigated_rainfed_cropland_ndvi.js` | 流域尺度灌溉/雨养耕地与 NDVI 时序分析 | HydroATLAS, GFSAD, MODIS/Landsat |
| `scripts/landsat_chlorophyll_a_random_forest_timeseries.js` | 叶绿素 a 随机森林拟合与时序分析 | Landsat 8/9 |
| `scripts/legacy/dynamic_world_10m_land_cover_legacy.txt` | 10 m 土地利用历史版本 | Dynamic World |

## 使用方式

1. 打开 [Google Earth Engine Code Editor](https://code.earthengine.google.com/)。
2. 从 `scripts/` 目录复制目标脚本内容到 Code Editor。
3. 修改脚本顶部的 AOI、时间范围、资产 ID 和导出开关等参数。
4. 点击 `Run` 运行脚本。
5. 如果脚本包含 `Export`，在 Earth Engine 的 `Tasks` 面板中手动启动导出任务。

## 维护建议

- 新脚本统一放在 `scripts/`，文件名使用英文小写和下划线，并以 `.js` 结尾。
- 每个脚本顶部建议写清楚：用途、数据源、研究区域、时间范围、主要输出、需要用户修改的参数。
- 不要提交个人账号密钥、下载后的大数据、导出栅格、矢量结果或临时缓存。
- 涉及私有 Earth Engine Asset 的脚本，建议在注释中说明用户需要替换的资产 ID。
- 如果代码来自论文、教程、公众号或公开资料，请在脚本注释中补充来源链接或出处。

## 许可

本仓库采用 MIT License。使用前请同时遵守 Google Earth Engine 及各数据集自身的使用条款。
