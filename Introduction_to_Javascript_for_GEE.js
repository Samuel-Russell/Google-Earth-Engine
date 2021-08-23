// Introduction to Javascript for Google Earth Engine

// 1. Printing strings

print('Hello World!');

// 2. Strings
// Use single (or double) quotes to make a string.
var ExampleString = 'Google Earth Engine is great!';

// Use parentheses to pass arguments to functions.
print(ExampleString);

// 3. Numbers
// Store a number in a variable.
var ExampleNumber = 2001;
print('Google Earth Engine was first released in:', ExampleNumber);

// 4. Lists 
// Use square brackets [] to make a list.
var ExampleList = [2, 4, 6, 8, 10, 12];
print('List of even numbers between 2 to 12:', ExampleList);

// Make a list of strings.
var ExampleStringList = ['a', 'b', 'c', 'd'];
print('List of strings:', ExampleStringList);

// 5. Objects
// Use curly brackets {} to make a dictionary of key:value pairs.
var object = {
  ExampleWord: 'Example',
  Number100: 100,
  Key_Words: ['Google', 'Geospatial', 'Cloud']
};
print('Dictionary:', object);
// Access dictionary items using square brackets.
print('Print foo:', object['ExampleWord']);
// Access dictionary items using dot notation.
print('Print Key Words:', object.Key_Words);

// 6. Functions
// The reflect function takes a single parameter: element.
var reflect = function(element) {
  // Return the argument.
  return element;
};
print('What do you think of Google Earth Engine?', reflect("It's Great'!"));

// You can also use built in Google Earth Engine functions.
// This example turns a number object into a string.
var aString = ee.Algorithms.String(100);
