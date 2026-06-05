/***********************
 * 建筑物分割 + GHSL建筑高度（可视化 + 导出）
 * 修复要点：使用 Image(".../2018")；波段名 built_height
 ***********************/

/* ============ 参数 ============ */
var aoi = ee.FeatureCollection('projects/land-111/assets/chengguan');
var start = '2023-01-01';
var end   = '2023-12-31';
var cloudProbThresh = 40;     // s2cloudless 云概率阈值（越小越严格）
var minAreaM2 = 60;           // 最小面积过滤（m²），10m 分辨率下 1 像素≈100m²
var tileScale = 4;            // reduceToVectors 的 tilescale，内存不够可调大

/* ============ 数据：S2 SR + s2cloudless ============ */
var s2  = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
            .filterBounds(aoi).filterDate(start, end);
var s2c = ee.ImageCollection('COPERNICUS/S2_CLOUD_PROBABILITY')
            .filterBounds(aoi).filterDate(start, end);

// 把云概率集合按影像 ID 连接到 SR 集合
var joined = ee.ImageCollection(ee.Join.saveFirst('clouds').apply({
  primary: s2,
  secondary: s2c,
  condition: ee.Filter.equals({
    leftField: 'system:index',
    rightField: 'system:index'
  })
}));

// 去云 + 选择波段 + 归一化
function maskS2(img){
  var cloudProb = ee.Image(img.get('clouds')).select('probability');
  var isNotCloud = cloudProb.lt(cloudProbThresh);
  var scl = img.select('SCL');
  // 过滤阴影/云/雪（SCL: 3=shadow, 8=cloud, 9=cirrus, 10=snow）
  var sclMask = scl.neq(3).and(scl.neq(8)).and(scl.neq(9)).and(scl.neq(10));
  var mask = isNotCloud.and(sclMask);
  return img.updateMask(mask)
            .select(['B2','B3','B4','B8','B11','B12'],
                    ['blue','green','red','nir','swir1','swir2'])
            .divide(10000);
}

var s2clean = joined.map(maskS2).median().clip(aoi);

/* ============ 指数 ============ */
var ndvi  = s2clean.expression('(nir - red) / (nir + red)',
  {'nir': s2clean.select('nir'), 'red': s2clean.select('red')}).rename('ndvi');

var mndwi = s2clean.expression('(green - swir1) / (green + swir1)',
  {'green': s2clean.select('green'), 'swir1': s2clean.select('swir1')}).rename('mndwi');

var ndbi  = s2clean.expression('(swir1 - nir) / (swir1 + nir)',
  {'swir1': s2clean.select('swir1'), 'nir': s2clean.select('nir')}).rename('ndbi');

// IBI（Index-based Built-up Index）：NDBI 减去 (NDVI + MNDWI)/2
var ibi = ndbi.subtract(ndvi.add(mndwi).divide(2)).rename('ibi');

/* ============ 阈值 & 净化 ============ */
var builtMask = ibi.gt(0.05)          // IBI 主阈值（可调：0~0.15 常见）
                .and(ndvi.lt(0.35))   // 排除植被
                .and(mndwi.lt(0.00)); // 排除水体/湿地

builtMask = builtMask.focal_mode(1)   // 消噪
                     .focal_max(1)    // 膨胀
                     .focal_min(1);   // 腐蚀（闭运算）

var minPix = ee.Number(minAreaM2).divide(100); // 10m 像元≈100 m²
var cc = builtMask.connectedPixelCount(100, true);
builtMask = builtMask.updateMask(cc.gte(minPix));

/* ============ 矢量化 ============ */
var vectors = builtMask.selfMask().reduceToVectors({
  geometry: aoi,
  scale: 10,
  geometryType: 'polygon',
  eightConnected: true,
  maxPixels: 1e13,
  bestEffort: true,
  tileScale: tileScale
})
.map(function(f){
  var area = f.geometry().area();
  return f.set({'area_m2': area});
})
.filter(ee.Filter.gte('area_m2', minAreaM2));

/* =================================================================
   ============ GHSL 建筑高度（2018，100m）===========================
   ================================================================= */
// 正确：用具体影像路径，而不是集合；并使用波段 built_height
var ghsl2018 = ee.Image('JRC/GHSL/P2023A/GHS_BUILT_H/2018').select('built_height');

// 仅在建筑掩膜内取高度
var heightMasked = ghsl2018.updateMask(builtMask);

/* ============ 将高度统计到建筑多边形 ============ */
var statsReducer = ee.Reducer.mean()
  .combine(ee.Reducer.median(), '', true)
  .combine(ee.Reducer.max(), '', true)
  .combine(ee.Reducer.min(), '', true)
  .combine(ee.Reducer.stdDev(), '', true);

var heightStats = heightMasked.reduceRegions({
  collection: vectors,
  reducer: statsReducer,
  scale: 100,            // GHSL 像元 100m
  tileScale: tileScale
});

// 把“均值高度”写回矢量要素（字段 h_mean）
var vectorsWithH = vectors.map(function(f){
  var hDict = heightMasked.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: f.geometry(),
    scale: 100,
    maxPixels: 1e13
  });
  return f.set({'h_mean': hDict.get('built_height')});
});

/* ============ 显示 ============ */
Map.centerObject(aoi, 15);
Map.addLayer(s2clean, {bands: ['swir1','nir','red'], min:0, max:0.3}, 'S2 (SWIR1-NIR-RED)');
Map.addLayer(ibi, {min:-0.2, max:0.3, palette:['blue','white','red']}, 'IBI');
Map.addLayer(builtMask.updateMask(builtMask), {palette:['yellow']}, 'Built mask');

// GHSL 高度渲染
Map.addLayer(heightMasked, {
  min: 0, max: 60,
  palette: ['000000','0d0887','7e03a8','cc4778','f89540','f0f921']
}, 'Building height (GHSL, 2018)');

Map.addLayer(vectorsWithH, {color:'cyan'}, 'Buildings with h_mean');

/* ============ 导出：高度统计 CSV + 带均值高度的建筑矢量 ============ */
Export.table.toDrive({
  collection: heightStats,
  description: 'Building_Heights_Stats_GHSL2018',
  fileFormat: 'CSV'
});

Export.table.toDrive({
  collection: vectorsWithH,
  description: 'Buildings_WithHeightMean_GHSL2018',
  fileFormat: 'SHP'
});
