// ------------------- 1. 设置区域 ------------------- //
// 训练区：越南红河平原（内陆稻区）
var trainingRegion = ee.Geometry.Rectangle([105.5, 20.5, 106.5, 21.5]);
// 测试区：贵州夏季稻区
var studyRegion = ee.Geometry.Rectangle([106.0, 25.0, 108.5, 27.5]);

// ------------------- 2. 选取夏季 Landsat 8/9 ------------------- //
function addIndices(img) {
  var optical = img.select(['SR_B2','SR_B3','SR_B4','SR_B5','SR_B6','SR_B7'])
                   .multiply(0.0000275).add(-0.2);

  var ndvi = optical.normalizedDifference(['SR_B5','SR_B4']).rename('NDVI');
  var lswi = optical.normalizedDifference(['SR_B5','SR_B6']).rename('LSWI');
  var ndvi_lswi = ndvi.subtract(lswi).rename('NDVI_LSWI');
  var ndwi = optical.normalizedDifference(['SR_B3','SR_B5']).rename('NDWI');
  var ndbi = optical.normalizedDifference(['SR_B6','SR_B5']).rename('NDBI');

  return img.addBands([ndvi, lswi, ndvi_lswi, ndwi, ndbi])
            .select(['NDVI','LSWI','NDVI_LSWI','NDWI','NDBI']);
}

// 夏季（6–9 月）
var summerL8 = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
  .filterDate('2021-06-01','2021-09-30')
  .filterBounds(trainingRegion)
  .map(addIndices);

// 夏季合成（均值代表特征）
var phenology = summerL8.mean();

// ------------------- 3. 训练样本（ESA 耕地类） ------------------- //
var esa = ee.Image("ESA/WorldCover/v100/2020").clip(trainingRegion);
var cropland = esa.eq(40);  // class = 40 Cropland

// 随机采样耕地
var trainingPoints = phenology.addBands(cropland.rename('label'))
  .stratifiedSample({
    numPoints: 500,
    classBand: 'label',
    region: trainingRegion,
    scale: 30,
    seed: 42,
    geometries: true
  });

// 提取波段名
var bandNames = ['NDVI','LSWI','NDVI_LSWI','NDWI','NDBI'];

// ------------------- 4. 训练分类器 ------------------- //
var classifier = ee.Classifier.smileRandomForest(200).train({
  features: trainingPoints,
  classProperty: 'label',
  inputProperties: bandNames
});

// ------------------- 5. 应用到贵州夏季 ------------------- //
var summerL8_GZ = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
  .filterDate('2021-06-01','2021-09-30')
  .filterBounds(studyRegion)
  .map(addIndices)
  .mean();

var classified = summerL8_GZ.classify(classifier);

Map.centerObject(studyRegion, 7);
Map.addLayer(classified, {min:0, max:1, palette:['gray','green']}, 
             '贵州夏季稻田分类');

// ------------------- 6. 精度验证（训练区内部） ------------------- //
var withRandom = trainingPoints.randomColumn('random');
var trainSet = withRandom.filter(ee.Filter.lt('random', 0.7));
var testSet  = withRandom.filter(ee.Filter.gte('random', 0.7));

var trainedClassifier = ee.Classifier.smileRandomForest(200).train({
  features: trainSet,
  classProperty: 'label',
  inputProperties: bandNames
});

var testClassified = testSet.classify(trainedClassifier);
var cm = testClassified.errorMatrix('label','classification');

print('Confusion Matrix (训练区 Cropland vs 非Cropland)', cm);
print('Overall Accuracy', cm.accuracy());
print('Producer\'s Accuracy', cm.producersAccuracy());
print('User\'s Accuracy', cm.consumersAccuracy());
