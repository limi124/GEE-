欢迎关注全域智图公众号获取更多源码
/*******************************************************
 * Cropland / Irrigated / Rainfed Extraction + NDVI Analysis
 * Fully self-contained (public datasets only)
 * ROI automatically derived from HydroATLAS basin
 * Default location: near Xuzhou, China
 *******************************************************/
/* =====================
   A. Adjustable Parameters
   ===================== */
var CENTER_LON = 117.25;     // ROI center longitude
var CENTER_LAT = 34.26;      // ROI center latitude
 /////////////////////////////////////// …… /////////////////////////
完整代码关注全域智图公众号
/////////////////////////////////////// …… /////////////////////////
完整代码关注全域智图公众号
/////////////////////////////////////// …… /////////////////////////
完整代码关注全域智图公众号
/////////////////////////////////////// …… //////////////////////////////////////////////////////////////// …… /////////////////////////
完整代码关注全域智图公众号
/////////////////////////////////////// …… /////////////////////////
完整代码关注全域智图公众号
/////////////////////////////////////// …… /////////////////////////
完整代码关注全域智图公众号
/////////////////////////////////////// …… //////////////////////////////////////////////////////////////// …… /////////////////////////
完整代码关注全域智图公众号
/////////////////////////////////////// …… /////////////////////////
完整代码关注全域智图公众号
/////////////////////////////////////// …… /////////////////////////
完整代码关注全域智图公众号
/////////////////////////////////////// …… //////////////////////////////////////////////////////////////// …… /////////////////////////
完整代码关注全域智图公众号
/////////////////////////////////////// …… /////////////////////////
完整代码关注全域智图公众号
/////////////////////////////////////// …… /////////////////////////
完整代码关注全域智图公众号
/////////////////////////////////////// …… /////////////////////////
// NDVI time range
var NDVI_START = '2020-01-01';
var NDVI_END   = '2025-01-01';
 
// Export switches
var EXPORT_RASTER = false;
var EXPORT_VECTOR = false;
 
// Export settings
var OUT_SCALE  = 100;        // resolution (meters)
var OUT_CRS    = 'EPSG:4326';
var OUT_FOLDER = 'test_output';
 
 
/* =====================
   B. Public Data Sources
   ===================== */
// 1) HydroATLAS basins (level 05)
var basins = ee.FeatureCollection('WWF/HydroATLAS/v1/Basins/level05');
 
// 2) Cropland & irrigation types (GFSAD LGRIP30, 30m)
var cropland = ee.ImageCollection('projects/sat-io/open-datasets/GFSAD/LGRIP30').mosaic();
 
// 3) MODIS NDVI (MOD13Q1, 250m, 16-day, scaled by 0.0001)
var ndviCol = ee.ImageCollection('MODIS/061/MOD13Q1')
  .filterDate(NDVI_START, NDVI_END)
  .select('NDVI')
  .map(function (im) {
    return im.multiply(0.0001).copyProperties(im, im.propertyNames());
  });
 
 
/* =====================
   C. ROI (basin containing input point)
   ===================== */
var centerPt = ee.Geometry.Point([CENTER_LON, CENTER_LAT]);
var roi = basins.filterBounds(centerPt).geometry().simplify(200);
 
Map.centerObject(roi, 9);
Map.addLayer(basins, {color:'#999999'}, 'HydroATLAS basins', false);
Map.addLayer(roi, {color:'#ff0000'}, 'ROI (basin)', true);
 
 
/* =====================
   D. Cropland and Masks
   ===================== */
// Codes: 0/1 = others/cropland; 2 = irrigated; 3 = rainfed
var visCropland = {min: 0, max: 3, palette: ['#cccccc','#8dd3c7','#1f78b4','#33a02c']};
Map.addLayer(cropland.clip(roi), visCropland, 'Cropland (GFSAD)', true);
 
var irrigated = cropland.eq(2).selfMask();
var rainfed   = cropland.eq(3).selfMask();
 
Map.addLayer(irrigated.clip(roi), {palette:['#1f78b4']}, 'Irrigated (mask)', false);
Map.addLayer(rainfed.clip(roi),   {palette:['#33a02c']}, 'Rainfed (mask)',   false);
 
 
/* =====================
   E. NDVI Time Series
   ===================== */
var ndviIrr  = ndviCol.map(function (im) { return im.updateMask(irrigated); });
var ndviRain = ndviCol.map(function (im) { return im.updateMask(rainfed); });
 
print(
  ui.Chart.image.series(ndviIrr,  roi, ee.Reducer.mean(), 250, 'system:time_start')
    .setOptions({
      title: 'NDVI Time Series (Irrigated)',
      vAxis: {title: 'NDVI'}, hAxis: {title: 'Date'}
    })
);
print(
  ui.Chart.image.series(ndviRain, roi, ee.Reducer.mean(), 250, 'system:time_start')
    .setOptions({
      title: 'NDVI Time Series (Rainfed)',
      vAxis: {title: 'NDVI'}, hAxis: {title: 'Date'}
    })
);
 
 
/* =====================
   F. Area Statistics (km²)
   ===================== */
var areaKm2 = ee.Image.pixelArea().divide(1e6);
function areaByMask(maskImg, name){
  var val = areaKm2.updateMask(maskImg).reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: roi,
    scale: 30,
    maxPixels: 1e13
  }).get('area');
  print(name + ' area (km²):', val);
}
areaByMask(irrigated, 'Irrigated');
areaByMask(rainfed,   'Rainfed');
 

 
/* =====================
   H. Optional Raster Export
   ===================== */
if (EXPORT_RASTER) {
  Export.image.toDrive({
    image: cropland.clip(roi),
    description: 'Cropland_ROI',
    region: roi,
    scale: OUT_SCALE,
    crs: OUT_CRS,
    maxPixels: 1e13,
    folder: OUT_FOLDER
  });
  Export.image.toDrive({
    image: irrigated.clip(roi),
    description: 'Irrigated_Mask_ROI',
    region: roi,
    scale: OUT_SCALE,
    crs: OUT_CRS,
    maxPixels: 1e13,
    folder: OUT_FOLDER
  });
  Export.image.toDrive({
    image: rainfed.clip(roi),
    description: 'Rainfed_Mask_ROI',
    region: roi,
    scale: OUT_SCALE,
    crs: OUT_CRS,
    maxPixels: 1e13,
    folder: OUT_FOLDER
  });
}
 
/* =====================
   ✅ Usage:
   - Run directly, no private assets needed.
   - Change CENTER_LON / CENTER_LAT to set ROI.
   - Set EXPORT_RASTER / EXPORT_VECTOR = true to export results.
   ===================== */
