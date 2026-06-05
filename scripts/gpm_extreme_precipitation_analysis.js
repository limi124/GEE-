/////////////////////////////////////// …… /////////////////////////
完整代码关注全域智图公众号
/////////////////////////////////////// …… /////////////////////////
完整代码关注全域智图公众号
/////////////////////////////////////// …… /////////////////////////
完整代码关注全域智图公众号
/////////////////////////////////////// …… /////////////////////////
完整代码关注全域智图公众号
/**** 极端降水分析（ROI 来自你资产里的矢量数据） ****/
/* 数据源：NASA/GPM_L3/IMERG_V07  (precipitation, mm/hr) */

// ===================== 参数区（只改这里） =====================
var ASSET_FC_ID   = 'projects/land-111/assets/8province'; // ← 必填：你的 FeatureCollection 资产ID
var USE_PROPERTY  = false;           // 是否按属性筛选资产里的要素
var PROPERTY_NAME = 'NAME';          // 属性名（当 USE_PROPERTY=true 时生效）
var PROPERTY_VAL  = 'Beijing';       // 属性值（当 USE_PROPERTY=true 时生效）

var START_DATE = '2024-01-01';       // 起始（含）
var END_DATE   = '2025-01-01';       // 结束（不含）
var THRESH_MM  = 50;                 // 极端降水阈值（mm/day）
var SCALE_M    = 10000;              // 统计/导出的标称分辨率（米）
var CRS        = 'EPSG:4326';        // 导出坐标系

var DO_EXPORT  = false;              // 是否导出结果到 Google Drive
var EXPORT_FOLDER = 'GEE_exports';   // 导出文件夹名
// ============================================================


// ========== 加载 ROI ==========
var fc = ee.FeatureCollection(ASSET_FC_ID);
if (USE_PROPERTY) {
  fc = fc.filter(ee.Filter.eq(PROPERTY_NAME, PROPERTY_VAL));
}

// 兜底：若筛选为空，则报提示并直接用全集合
var sizeOk = fc.size().gt(0);
fc = ee.FeatureCollection(ee.Algorithms.If(sizeOk, fc, ee.FeatureCollection(ASSET_FC_ID)));
print('ROI feature count =', fc.size());

// dissolve 成一个面作为分析区域
var roi = fc.geometry();  // union
// 为显示边界，paint 一下
var roiEdge = ee.Image().paint(roi, 0, 2);
Map.addLayer(roiEdge, {palette:['#000000']}, 'ROI boundary', true);
Map.centerObject(roi, 5);

// 一个示例点（ROI 质心），用于点位时序图
var pt = roi.centroid(10);
Map.addLayer(pt, {color:'red'}, 'ROI centroid', false);


// ========== 加载 IMERG 并聚合到“日累计(mm)” ==========
var imerg = ee.ImageCollection('NASA/GPM_L3/IMERG_V07')
  .select('precipitation')           // mm/hr
  .filterDate(START_DATE, END_DATE);

var nHalfHours = imerg.size();
print('IMERG slots (half-hour or hourly depending on product):', nHalfHours);












/////////////////////////////////////// …… /////////////////////////
完整代码关注全域智图公众号
/////////////////////////////////////// …… /////////////////////////
完整代码关注全域智图公众号
/////////////////////////////////////// …… /////////////////////////
完整代码关注全域智图公众号
/////////////////////////////////////// …… /////////////////////////
完整代码关注全域智图公众号/////////////////////////////////////// …… /////////////////////////
完整代码关注全域智图公众号
/////////////////////////////////////// …… /////////////////////////
完整代码关注全域智图公众号
/////////////////////////////////////// …… /////////////////////////
完整代码关注全域智图公众号
/////////////////////////////////////// …… /////////////////////////
完整代码关注全域智图公众号/////////////////////////////////////// …… /////////////////////////
完整代码关注全域智图公众号
/////////////////////////////////////// …… /////////////////////////
完整代码关注全域智图公众号
/////////////////////////////////////// …… /////////////////////////
完整代码关注全域智图公众号
/////////////////////////////////////// …… /////////////////////////
完整代码关注全域智图公众号












// ========== 可选：导出 ==========
if (DO_EXPORT) {
  // 重要指标打包导出（多波段）
  var pack = ee.Image.cat([
    meanDaily.rename('mean_daily_mm'),
    maxDaily.rename('max_daily_mm'),
    heavyDays.rename('heavy_days'),
    max3.rename('max_3day_mm'),
    peakDate.rename('peak_date_ms')
  ]).clip(roi).toFloat();

  Export.image.toDrive({
    image: pack,
    description: 'extreme_precip_metrics',
    region: roi,
    scale: SCALE_M,
    crs: CRS,
    maxPixels: 1e13,
    folder: EXPORT_FOLDER
  });

  // 月累计多波段导出（波段名为 YYYY-MM）
  var merged = monthsIC.iterate(function(img, acc){
    return ee.Image(acc).addBands(ee.Image(img));
  }, ee.Image([]));
  merged = ee.Image(merged).clip(roi).toFloat();

  Export.image.toDrive({
    image: merged,
    description: 'monthly_sums_mm',
    region: roi,
    scale: SCALE_M,
    crs: CRS,
    maxPixels: 1e13,
    folder: EXPORT_FOLDER
  });

  // 点位日序列 CSV
  var dailyCSV = ee.FeatureCollection(dailyIC.map(function(img){
    var val = img.select('precipitation').reduceRegion({
      reducer: ee.Reducer.first(),
      geometry: pt,
      scale: SCALE_M
    }).get('precipitation');
    return ee.Feature(null, {
      'date': ee.Date(img.get('system:time_start')).format('YYYY-MM-dd'),
      'precip_mm': val
    });
  }));
  Export.table.toDrive({
    collection: dailyCSV,
    description: 'point_daily_precip_csv',
    fileFormat: 'CSV',
    folder: EXPORT_FOLDER
  });
}
