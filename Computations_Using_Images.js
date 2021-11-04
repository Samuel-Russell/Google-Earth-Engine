// Computations using Images
// Load and display an image, then apply a computation to it. 
// In this case computing the slope of terrain, by passing the SRTM elevation image to the slope method of the ee.Terrain package.

// Load SRTM image.
var srtm = ee.Image('CGIAR/SRTM90_V4');

// Apply a slope algorithm to an image.
var slope = ee.Terrain.slope(srtm);

// Display the result.
Map.setCenter(8.75, 46.58, 7); // Center on the Alps.
Map.addLayer(slope, {min: 0, max :60}, 'slope');