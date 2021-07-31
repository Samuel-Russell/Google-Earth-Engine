// This function returns NDVI from Landsat 5 imagery
var getNDVI = function(image) {
  return image.normalizedDifference(['B4', 'B3']);
};

// Loading two Landsat 5 images
var image1 = ee.Image('LANDSAT/LT05/C01/T1_TOA/LT05_044034_19900604');
var image2 = ee.Image('LANDSAT/LT05/C01/T1_TOA/LT05_044034_20100611');

// Compute NDVI
var ndvi1 = getNDVI(image1);
var ndvi2 = getNDVI(image2);

// Compute the difference in NDVI
var ndviDifference = ndvi2.subtract(ndvi1);

// Color the image (hex color)
var ndviViz = {min: -1, max: 1, palette: ['red', 'white', 'green']};

// Display the collection.
Map.addLayer(ndviDifference, ndviViz, 'NDVI');