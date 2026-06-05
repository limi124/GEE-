# 贡献和脚本整理规范

## 新增脚本

新增脚本时请放入 `scripts/`，并使用以下命名方式：

```text
数据源_任务_区域或方法.js
```

建议使用英文小写、数字和下划线，例如：

```text
sentinel2_ndvi_timeseries.js
landsat_cropland_random_forest.js
gpm_extreme_precipitation_analysis.js
```

## 脚本头部模板

每个脚本建议在开头保留以下信息：

```javascript
/*******************************************************
 * Title:
 * Purpose:
 * Data:
 * AOI:
 * Time range:
 * Outputs:
 * Notes:
 *******************************************************/
```

## 提交前检查

- 脚本能否在 GEE Code Editor 中打开并至少完成语法检查。
- 是否把可修改参数集中放在脚本顶部。
- 是否移除了个人临时路径、无关测试代码和大段重复广告文本。
- 是否说明了需要替换的私有 Earth Engine Asset ID。
- 是否避免提交导出结果、大体积数据文件和账号凭据。
