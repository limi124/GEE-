// ================= 1) 研究区域 =================
var geometry = ee.FeatureCollection([
  ee.Feature(
    ee.Geometry.Polygon(
      [[[114.61361198222299, 38.00563363780402],
        [114.61361198222299, 37.719407163175575],
        [114.93221549784799, 37.719407163175575],
        [114.93221549784799, 38.00563363780402]]], null, false),
    {"system:index": "0"})
]);
var riverMask = geometry;

// ================= 2) 数据加载与筛选 =================
var LS8 = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
  .filterDate('2024-01-01', '2024-12-31')
  .filterBounds(riverMask);

var LS9 = ee.ImageCollection('LANDSAT/LC09/C02/T1_TOA')
  .filterDate('2024-01-01', '2024-12-31')
  .filterBounds(riverMask);

var allToa = LS8.merge(LS9)
  .filter(ee.Filter.lt('CLOUD_COVER', 10))
  .sort('system:time_start')
  .map(function(img){ return img.clip(riverMask); });

print('合并后影像数量:', allToa.size());

// ================= 3) 经验公式（逐景 + 中位合成） =================
function chlorophyll_f(img){
  var chl = img.expression(
    '49.79048 + (799.2818*B2) + (-1859.88*B3) + (1231.197*B4)', {
      B2: img.select('B2'),
      B3: img.select('B3'),
      B4: img.select('B4')
    }).rename('chl_formula');
  return img.addBands(chl);
}
var chlCollection = allToa.map(chlorophyll_f);
var chlFormula = chlCollection.select('chl_formula').median();

var visFormula = {min: 0, max: 100, palette: ['#9aff14','#fbff19','#ff8319','#ff2419']};
Map.addLayer(chlFormula, visFormula, '经验公式 Chl-a');

// ================= 4) 采样点（10~80 随机） =================
var points = ee.FeatureCollection.randomPoints({
  region: riverMask, points: 50, seed: 42
});
完整代码关注公众号全域制图

// ================= 5) 训练数据：波段采样（全年中位合成） =================
完整代码关注公众号全域制图
var trainSet = sampled.filter(ee.Filter.lt('split', 0.7));
var testSet  = sampled.filter(ee.Filter.gte('split', 0.7));
print('训练样本数', trainSet.size());
print('测试样本数',  testSet.size());

// ================= 6) 随机森林回归（连续值） =================
var rfReg = ee.Classifier.smileRandomForest(200).setOutputMode('REGRESSION');
var trained = rfReg.train(trainSet, 'chla', bands);

// 预测整幅影像
var chlRF = composite.select(bands).classify(trained).rename('chl_rf');
var visRF = {min: 10, max: 80, palette: ['blue','cyan','green','yellow','red']};
Map.addLayer(chlRF, visRF, 'RF 回归预测 Chl-a');

// ================= 7) 回归评估（RMSE / MAE / R²） =================
// 在测试集上做预测
var testPred = testSet.classify(trained);

完整代码关注公众号全域制图

// 使用皮尔逊相关系数计算 R²（更稳健）
var corrDict = withErr.reduceColumns(ee.Reducer.pearsonsCorrelation(), ['chla', 'pred']);
var r = ee.Number(corrDict.get('correlation'));
var r2 = r.pow(2);

print('MAE', mae);
print('RMSE', rmse);
print('R² (由相关系数求得)', r2);

// ================= 8) 经验公式 vs RF 残差图 =================
var residualImg = chlRF.subtract(chlFormula).rename('residual_rf_minus_formula');
var visResidual = {min: -50, max: 50, palette: ['#2166ac','#f7f7f7','#b2182b']};
Map.addLayer(residualImg, visResidual, 'RF - 公式 残差');

// ================= 9) 时间序列（经验公式） =================
var chart = ui.Chart.image.series({
  imageCollection: chlCollection.select('chl_formula'),
  region: riverMask,
  reducer: ee.Reducer.mean(),
  scale: 4638.3
}).setOptions({
  title: 'Chlorophyll-a (经验公式)',
  vAxis: {title: '浓度 (ug/L)'},
  pointSize: 2
});
print(chart);

Map.centerObject(riverMask, 10);
