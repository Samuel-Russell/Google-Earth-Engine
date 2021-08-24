// Examples of utilising JavaScript objects and primitives into EE containers
// These containers can be sent to Google's server for processing

// 1. Example, defining a string object and then putting said object into a ee.String() container to be sent to Earth Engine:
// Define a string, then put the string into an EE container
var ExampleString = 'This string is going to the cloud!';
var eeString_Container = ee.String(ExampleString);
print('What is the desintation?', eeString_Container);

// Define a string that exists on the server
var serverString = ee.String('Google Earth Engine is great');
print('What do you think of Google Earth Engine?', serverString);

// 2. Numbers, ee.Number() can be used to create number objects on the GEE server.
// Defining a number that exists on the server.
var Number_On_Server = ee.Number(Math.E);
print('E=', Number_On_Server);

// Note any constructor (e.g ee.String() & ee.Number()) which begins with ee returns an Earth Engine object.

// 3. Methods on Earth Engine Objects
// An Earth Engine Object must use Earth Engine methods to process it (i.e JavaScript's Math.log() will not work')
var log_E = server Number.log();
print('log(E)=', log_E);
