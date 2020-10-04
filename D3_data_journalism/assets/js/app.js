// @TODO: YOUR CODE HERE!
//Grab width of #scatter
var width = parseInt(d3.select('#scatter').stle('width'));

//calculate needed height of graph


//margin for graph


// space for the labels on the graph


//additional padding for the text on the axes


//use svg to create a canvas for the graph



//Set the radius for the dots on the graph as a function



//labels for axes

//bottom axis (x)
//append a g element so that they have somewhere to sit
//use xtext and give it a transform property to make the page responsive to window size



//left axis (y)
//variables for easier transform attrib.

//additional label group for the y axis

//ytext

//put transform attrib in function so it can stay responsive



//import .csv file


// create viz func

//set x min and max, y min and max


//change the min and max for x (smalled for min, largest for max)

//change the min and max for y

//grab min and max values for both x and y

//set scale using d3 for both x (bottom) and y (left)
//reverse the y axis

//pass scales in axis methods to create the axes

//append the axes using svg in group (g) elements, use transform to tell it where they should go



//make a group for the dots on the graph with their labels (state abbrv)

//append the circles for each state

    //attrib of location, size, and class