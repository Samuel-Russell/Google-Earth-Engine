// Importing the Landsat NDSI Image Collection & Time Filtering
var dataset = ee.ImageCollection('LANDSAT/LC08/C01/T1_8DAY_NDSI')
                  .filterDate('2017-01-01', '2017-12-31');
                  
// Selecting Band
var colorized = dataset.select('NDSI');

// Colorising Images
var colorizedVis = {
  palette: ['000088', '0000FF', '8888FF', 'FFFFFF'],
};

// Setting map co-ordinates (6.32, 61.25) & setting zoom; 6
Map.setCenter(6.32, 61.25, 9);

// Adding the layers
Map.addLayer(colorized, colorizedVis, 'Colorized');