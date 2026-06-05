// =============================
// ✅ 1. 设置区域与时间
// =============================
var region =  ee.FeatureCollection('projects/land-111/assets/chengguan');

var start = ee.Date('2024-01-01');
var end = ee.Date('2024-12-31');
 
// =============================
// ✅ 2. 获取Dynamic World影像
// =============================
var dw = ee.ImageCollection('GOOGLE/DYNAMICWORLD/V1')
  .filterBounds(region)
  .filterDate(start, end)
  .select('label');
 
// =============================
// ✅ 3. 合成2024年的主分类图（众数模式）
// =============================
var dwMode = dw.reduce(ee.Reducer.mode()).clip(region);
 
// =============================
// ✅ 4. 可视化参数
// =============================
var visParams = {
  min: 0,
  max: 8,
  palette: [
    '419bdf',  // 水体
    '397d49',  // 林地
    '88b053',  // 草地
    '7a87c6',  // 湿地
    'e49635',  // 农田
    'dfc35a',  // 灌丛
    'c4281b',  // 建设用地
    'a59b8f',  // 裸地
    'b39fe1'   // 雪冰
  ]
};
 
Map.centerObject(region, 10);
Map.addLayer(dwMode, visParams, '2024 LULC Mode');
 
// =============================
// ✅ 5. 导出图像到Google Drive
// =============================
Export.image.toDrive({
  image: dwMode,
  description: 'LULC_2024_Mode',
  folder: 'GEE_Exports',
  fileNamePrefix: 'LULC_2024_Mode',
  region: region,
  scale: 10,
  crs: 'EPSG:4326',
  maxPixels: 1e13
});
