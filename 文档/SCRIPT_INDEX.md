# 脚本索引

| 脚本 | 中文主题 | 用途 | 运行前需要检查 |
| --- | --- | --- | --- |
| `脚本/dynamic_world_10m_land_cover.js` | 10 m 土地利用 | 生成指定年份 Dynamic World 众数合成图并导出土地覆盖栅格。 | `region`、`start`、`end`、导出文件夹和文件名 |
| `脚本/sentinel2_building_extraction_ghsl_height.js` | 建筑物分割 | 基于 Sentinel-2 指数提取建设用地，并叠加 GHSL 建筑高度进行可视化/导出。 | `aoi`、`start`、`end`、云概率阈值、最小面积 |
| `脚本/gpm_extreme_precipitation_analysis.js` | 极端降水 | 使用 IMERG 统计极端降水日、平均降水和最大降水等指标。 | `ASSET_FC_ID`、属性筛选、日期范围、降水阈值、导出开关 |
| `脚本/landsat_cropland_random_forest.js` | 耕地反演 | 使用 Landsat 指数和 ESA WorldCover 标签训练随机森林耕地分类器。 | 训练区、研究区、日期范围、采样数量 |
| `脚本/basin_irrigated_rainfed_cropland_ndvi.js` | 灌溉/雨养耕地 NDVI | 在流域尺度比较灌溉耕地与雨养耕地空间分布及 NDVI 时序差异。 | 流域中心点、NDVI 时间范围、导出开关 |
| `脚本/landsat_chlorophyll_a_random_forest_timeseries.js` | 叶绿素 a | 通过经验公式和随机森林回归估算叶绿素 a，并分析时序变化。 | 研究区、日期范围、采样点和训练变量 |

## 公开仓库检查项

- 已删除脚本中的无关引流文字。
- 私有 Earth Engine Asset 路径不应提交到公开仓库。
- 公开示例优先使用矩形研究区、公开 FeatureCollection 或明确的占位参数。
- 修改脚本后建议在 GEE Code Editor 中至少运行一次，因为 Earth Engine API 无法完全通过本地 JavaScript 语法检查验证。
