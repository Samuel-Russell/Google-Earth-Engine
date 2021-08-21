// This script is for selecting an image from a collection and then returning the image properties

// First selecting the area of interest
var ROI = ee.Geometry.Rectangle(-79.4474, 33.6058, -79.4463, 33.60515);

// Defining the collection of interest and filtering by date and area
var collection = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
    .filterDate('2016-05-01', '2017-10-01')
    .filterBounds(ROI);

// Obtaining the property names of the image collection
print(collection.first().propertyNames());

// Obtaining the landsat id
print(collection.aggregate_array('LANDSAT_ID'));

// Obtaining the properties of a desired image
print(ee.Image('LANDSAT/LC08/C01/T1_SR/LC08_015037_20160515'));