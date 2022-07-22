var roi = ee.Geometry.Rectangle(121.09827, 71.905, 130.765, 74.135);

// Load Sentinel-1 C-band SAR Ground Range collection (log scale, VV, descending)
var collectionVV = ee.ImageCollection('COPERNICUS/S1_GRD')
.filter(ee.Filter.eq('instrumentMode', 'IW'))
.filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
.filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))
.filterMetadata('resolution_meters', 'equals' , 10)
.filterBounds(roi)
.select('VV');
print(collectionVV, 'Collection VV');

// Load Sentinel-1 C-band SAR Ground Range collection (log scale, VH, descending)
var collectionVH = ee.ImageCollection('COPERNICUS/S1_GRD')
.filter(ee.Filter.eq('instrumentMode', 'IW'))
.filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
.filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))
.filterMetadata('resolution_meters', 'equals' , 10)
.filterBounds(roi)
.select('VH');
print(collectionVH, 'Collection VH');

//Filter by date
var beforeVV = collectionVV.filterDate('2019-04-14', '2019-04-28');
var afterVV = collectionVV.filterDate('2019-04-14', '2019-04-28');
var beforeVH = collectionVH.filterDate('2019-04-14', '2019-04-28');
var afterVH = collectionVH.filterDate('2019-04-14', '2019-04-28');
print(beforeVV, 'Before VV');
print(afterVV, 'After VV');
print(beforeVH, 'Before VH');
print(afterVH, 'After VH');

//Display each image from before and after search
function addImage(image) { // display each image in collection
var id = image.id;
var image = ee.Image(image.id);
Map.addLayer(image);
}
beforeVV.evaluate(function(beforeVV) { // use map on client-side
beforeVV.features.map(addImage)
})

//Filter by date
var beforeVV = collectionVV.filterDate('2019-02-15', '2019-02-24').mosaic();
var afterVV = collectionVV.filterDate('2019-03-15', '2019-03-21').mosaic();
var beforeVH = collectionVH.filterDate('2019-02-15', '2019-02-24').mosaic();
var afterVH = collectionVH.filterDate('2019-03-15', '2019-03-21').mosaic();

// Display map
Map.centerObject(roi, 7);
Map.addLayer(beforeVV, {min:-15,max:0}, 'Before flood VV', 0);
Map.addLayer(afterVV, {min:-15,max:0}, 'After flood VV', 0);
Map.addLayer(beforeVH, {min:-25,max:0}, 'Before flood VH', 0);
Map.addLayer(afterVH, {min:-25,max:0}, 'After flood VH', 0);

Map.addLayer(beforeVH.addBands(afterVH).addBands(beforeVH), {min: -25, max: -8},
'BVH/AVV/AVH composite', 0);

//Apply filter to reduce speckle
var SMOOTHING_RADIUS = 50;
var beforeVV_filtered = beforeVV.focal_mean(SMOOTHING_RADIUS, 'circle', 'meters');
var beforeVH_filtered = beforeVH.focal_mean(SMOOTHING_RADIUS, 'circle', 'meters');
var afterVV_filtered = afterVV.focal_mean(SMOOTHING_RADIUS, 'circle', 'meters');
var afterVH_filtered = afterVH.focal_mean(SMOOTHING_RADIUS, 'circle', 'meters');

//Display filtered images
Map.addLayer(beforeVV_filtered, {min:-15,max:0}, 'Before Flood VV Filtered',0);
Map.addLayer(beforeVH_filtered, {min:-25,max:0}, 'Before Flood VH Filtered',0);
Map.addLayer(afterVV_filtered, {min:-15,max:0}, 'After Flood VV Filtered',0);
Map.addLayer(afterVH_filtered, {min:-25,max:0}, 'After Flood VH Filtered',0);

// Calculate difference between before and after
var differenceVH=
afterVH_filtered.divide(beforeVH_filtered);
Map.addLayer(differenceVH, {min: 0,max:2},
'difference VH filtered', 0);

//Apply Threshold
//var DIFF_UPPER_THRESHOLD = 1.25;
var DIFF_UPPER_THRESHOLD = 1.20;
var differenceVH_thresholded = differenceVH.gt(DIFF_UPPER_THRESHOLD);
Map.addLayer(differenceVH_thresholded.updateMask(differenceVH_thresholded),{palette:"0000FF"},'flooded areas - blue',1);

//Apply Threshold
//var DIFF_UPPER_THRESHOLD = 1.25;
var FROZEN_UPPER_THRESHOLD = -22;
var VH_thresholded = beforeVH_filtered.gt(FROZEN_UPPER_THRESHOLD);
Map.addLayer(VH_thresholded.updateMask(VH_thresholded),{palette:"e32636"},'Floating Ice - red',1);

var grounded_hotspots = beforeVH_filtered.updateMask(beforeVH_filtered.gt(-27)).updateMask(beforeVH_filtered.lt(-22))
        // set all values to 1 (instead of keeping the original values)
        .gt(-27).selfMask()
        // rename the band
        .rename('hotspots');

// Display the thermal hotspots on the Map.
Map.addLayer(grounded_hotspots, {palette: 'ffbf00'}, 'Grounded Ice Hotspots');

// Mask for Grounded Ice
var ex_grounded_hotspots = beforeVH_filtered.updateMask(beforeVH_filtered.gt(-50)).updateMask(beforeVH_filtered.lt(-22))
        // set all values to 1 (instead of keeping the original values)
        .gt(-50).selfMask()
        // rename the band
        .rename('hotspots');
/// gt = greater than, lt = less than

// Display the thermal hotspots on the Map.
Map.addLayer(ex_grounded_hotspots, {palette: 'fdee00'}, 'Ex Grounded Ice Hotspots');

var waterOcc = ee.Image("JRC/GSW1_0/GlobalSurfaceWater").select('occurrence'),
    jrc_data0 = ee.Image("JRC/GSW1_0/Metadata").select('total_obs').lte(0),
    waterOccFilled = waterOcc.unmask(0).max(jrc_data0),
    waterMask = waterOccFilled.lt(50);

Map.addLayer(waterOcc);
Map.addLayer(waterMask);

//Map.addLayer(meandiff.updateMask(waterMask),visDiff,'18Years'); 

// Make the histogram, set the options.
var histogram = ui.Chart.image.histogram(beforeVH_filtered, roi, 300);

print(histogram)

//Export Water Original Mask
Export.image.toDrive({
  image: waterOcc,
  description: 'waterOcc_03_02',
  scale: 30,
  folder: '/Users/samuelrussell/Documents',
  region: ee.Geometry.Rectangle(121.09827, 71.905, 130.765, 74.135),
  fileFormat: 'GeoTIFF'
})

//Export Water Mask
Export.image.toDrive({
  image: waterMask,
  description: 'waterMask_03_02',
  scale: 30,
  folder: '/Users/samuelrussell/Documents',
  region: ee.Geometry.Rectangle(121.09827, 71.905, 130.765, 74.135),
  fileFormat: 'GeoTIFF'
})

//Export Frozen Ice
Export.image.toDrive({
  image: VH_thresholded,
  description: 'FROZEN_UPPER_THRESHOLD_April',
  scale: 55,
  folder: '/Users/samuelrussell/Documents',
  region: ee.Geometry.Rectangle(121.09827, 71.905, 130.765, 74.135),
  fileFormat: 'GeoTIFF'
})

//Export Grounded Ice
Export.image.toDrive({
  image: ex_grounded_hotspots,
  description: 'ex_grounded_hotspots_April',
  scale: 55,
  folder: '/Users/samuelrussell/Documents',
  region: ee.Geometry.Rectangle(121.09827, 71.905, 130.765, 74.135),
  fileFormat: 'GeoTIFF'
})

Export.image.toDrive({
  image: waterOcc,
  description: 'beforeVH_filtered_03_02',
  scale: 55,
  folder: '/Users/samuelrussell/Documents',
  region: ee.Geometry.Rectangle(121.09827, 71.905, 130.765, 74.135),
  fileFormat: 'GeoTIFF'
})