# GEE 遥感脚本库

这是一个整理 Google Earth Engine JavaScript 脚本的仓库，主要覆盖土地利用、农业遥感、水文分析、建筑物提取和水质反演等常见场景。

脚本以“可复制到 GEE Code Editor 直接运行”为目标。公开版本会尽量使用公开数据集和示例研究区，涉及个人 Earth Engine Asset 的位置已改为示例区域或待替换配置。

## 目录结构

```text
.
├── 脚本/             # 可直接在 GEE Code Editor 中运行的脚本
│   └── 历史版本/     # 旧版或暂未完全整理的脚本
├── 文档/             # 脚本索引和维护规范
├── .gitignore
├── LICENSE
└── README.md
```

## 脚本清单

| 文件 | 主题 | 主要数据源 |
| --- | --- | --- |
| `脚本/dynamic_world_10m_land_cover.js` | 10 m 土地利用/覆盖分类合成 | Dynamic World |
| `脚本/sentinel2_building_extraction_ghsl_height.js` | 建筑物分割与建筑高度可视化/导出 | Sentinel-2, s2cloudless, GHSL |
| `脚本/gpm_extreme_precipitation_analysis.js` | 极端降水统计分析 | NASA GPM IMERG, GAUL |
| `脚本/landsat_cropland_random_forest.js` | 耕地随机森林高精度反演 | Landsat 8/9, ESA WorldCover |
| `脚本/basin_irrigated_rainfed_cropland_ndvi.js` | 流域尺度灌溉/雨养耕地与 NDVI 时序分析 | HydroATLAS, GFSAD, MODIS/Landsat |
| `脚本/landsat_chlorophyll_a_random_forest_timeseries.js` | 叶绿素 a 随机森林拟合与时序分析 | Landsat 8/9 |
| `脚本/历史版本/dynamic_world_10m_land_cover_legacy.txt` | 10 m 土地利用历史版本 | Dynamic World |

## 使用方式

1. 打开 [Google Earth Engine Code Editor](https://code.earthengine.google.com/)。
2. 从 `脚本/` 目录复制目标脚本内容到 Code Editor。
3. 修改脚本顶部的研究区、时间范围、导出开关等参数。
4. 点击 `Run` 运行脚本。
5. 如果脚本包含 `Export`，在 Earth Engine 的 `Tasks` 面板中手动启动导出任务。

## 维护建议

- 新脚本统一放在 `脚本/` 目录。
- 文件名建议使用英文小写、数字和下划线，并以 `.js` 结尾，避免跨平台路径问题。
- 每个脚本顶部建议写清楚用途、数据源、研究区、时间范围、主要输出和需要用户修改的参数。
- 不提交账号密钥、私有 Asset 路径、导出结果、大体积数据或临时缓存。
- 如果脚本改自论文、教程或公开资料，请在注释中补充来源链接或出处。

## 许可

本仓库采用 MIT License。使用前请同时遵守 Google Earth Engine 及各数据集自身的使用条款。
