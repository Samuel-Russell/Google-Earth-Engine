// Exporting Data Sample

// 1. Define a function to find the mean value of pixels in each feature of a collection.

// Function to find mean of pixels in region of interest.
var getRegions = function(image) {
  // Load US county dataset.
  var countyData = ee.FeatureCollection('TIGER/2018/Counties');
  // Filter the counties that are in Connecticut.
  // This will be the region of interest for the operations.
  var roi=countyData.filter(ee.Filter.eq('STATEFP', '09'));
  return image.reduceRegions({
    // Collection to run operation over.
    collection: roi,
    // Calculate mean of all pixels in region.
    reducer: ee.Reducer.mean(),
    // Pixel resolution used for the calculations.
    scale: 1000
  });
};

// Load image collection, filter collection to date range, select band of interest, calculate mean of all images in collection, and multiply by scaling factor. 

var image = ee.ImageCollection('MODIS/MYD13A1')
    .filterDate('2005-08-08', '2010-08-08')
    .select('NDVI')
    .mean()
    .multiply(.0001);
// Print final image.
print(image);
// Call function.
var coll = getRegions(image);

// Export the table created to your Google Drive

Export.table.toDrive({
 collection: coll,
 description: 'NDVI_all',
 fileFormat: 'CSV'
});
// Print final collection.
print(coll);
