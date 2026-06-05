# 贡献和脚本整理规范

## 新增脚本

新增脚本请放入 `scripts/` 目录，并使用英文小写、数字和下划线命名，例如：

```text
sentinel2_ndvi_timeseries.js
landsat_cropland_random_forest.js
gpm_extreme_precipitation_analysis.js
```

## 新增文档

新增文档请放入 `docs/` 目录，并使用英文小写、数字和下划线命名，例如：

```text
gee_export_notes.md
dataset_notes.md
method_comparison.md
```

如果文档对应某个脚本，建议在文档开头写清楚关联脚本、适用场景和更新时间。

## 推荐脚本头部

```javascript
/*******************************************************
 * 标题：
 * 用途：
 * 数据源：
 * 研究区：
 * 时间范围：
 * 主要输出：
 * 备注：
 *******************************************************/
```

## 提交前检查

- 脚本能否在 GEE Code Editor 中打开并完成基础语法检查。
- 可修改参数是否集中放在脚本顶部。
- 是否移除了个人临时路径、无关测试代码和引流文字。
- 是否移除了私有 Earth Engine Asset 路径、账号凭据、token、密钥等敏感信息。
- 是否避免提交导出栅格、矢量结果、压缩包和大体积数据文件。
