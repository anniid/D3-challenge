// @TODO: YOUR CODE HERE!
//Grab width of #scatter
var width = parseInt(d3.select('#scatter').stle('width'));

//calculate needed height of graph
var height = width - (width/4);

//margin for graph
var margin = 15

// space for the labels on the graph
var labelSpace = 100;

//additional padding for the text on the axes
var textPadx = 50;
var textPady = 50;

//use svg to create a canvas for the graph
var svg = d3
    .select('#scatter')
    .append('svg') //adding an svg element in the html where there is a div scatter tag
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'chart');


//Set the radius for the dots on the graph as a function
var circleRad;
function circleSizeRetrieve() {
    if (width <=530){
        circleRad =5;
    }
    else {
        circleRad=10;
    }
}
circleSizeRetrieve();

//labels for axes

//X axis (bottom)
//append a g element so that they have somewhere to sit in the html
//create x axis vairable and give it a transform property to make the page responsive to window size

svg.append('g').attr('class','xLabel');
var xLabel = d3.select('.xLabel');

function xLabelRefresh(){
xLabel.attr(
    'transform',
    'translate('+ ((width-labelSpace)/2+labelSpace)+", "+
    (height-margin-textPadx)+')'
);}
xLabelRefresh();
//put in values for possible X labels at specific y coordinates
//smoking
xLabel
    .append('text')
    .attr('y',-25)
    .attr('data-name','smokes')
    .attr('data-axis','x')
    .attr('class','aText active x')
    .text('Smokes (%)');

//obesity
xLabel
    .append('text')
    .attr('y',0)
    .attr('data-name','obesity')
    .attr('data-axis','x')
    .attr('class','aText inactive x')
    .text('Is Obese (%)');

//lacks access to healthcare
xLabel
    .append('text')
    .attr('y',25)
    .attr('data-name','healthcare')
    .attr('data-axis','x')
    .attr('class','aText inactive x')
    .text('Lacks Health Care (%)');


//left axis (y) same as x
svg.append('g').attr('class','yLabel');
var yLabel = d3.select('.yLabel');

function yLabelRefresh(){
    yLabel.attr(
        'transform',
        'translate('+ ((height+labelSpace)/2-labelSpace)+", "+
        (margin+textPady)+')rotate(-90)'
    );
}
yLabelRefresh();
//add values for possible y labels
//poverty
yLabel
    .append('text')
    .attr('x',-25)
    .attr('data-name','poverty')
    .attr('data-axis','y')
    .attr('class','aText active y')
    .text('In Poverty (%)');
//avg income
yLabel
    .append('text')
    .attr('x',0)
    .attr('data-name','income')
    .attr('data-axis','y')
    .attr('class','aText inactive y')
    .text('Household Income (Median)');
//age
yLabel
    .append('text')
    .attr('x',25)
    .attr('data-name','age')
    .attr('data-axis','y')
    .attr('class','aText inactive y')
    .text('Age (Median)');

//import .csv file & create viz function
d3.csv("assets/data/data.csv").then(function(data){
    visualize(data);
});
function visualize(data) {
    //create default data values for x and y (the ones set as active above)
    var xData = "smokes";
    var yData = "poverty";
    //set x min and max, y min and max as empty
    var MinX;
    var MaxX;
    var MinY;
    var MaxY;

    //tooltip setup
    var toolTip = d3
        .tip()
        .attr("class", "d3-tip")
        .html(function(d){
            var xSpot;
            var StateAbbr = `<div> ${d.state}</div>`;
            var ySpot =`<div> ${yData}: ${d[yData]}</div>`;
            if (xData === 'smokes'){
                xSpot = `<div>${xData}: ${d[xData]}%</div>`;
            }
            else {
                xSpot = '<div>'+xData+': '+
                parseFloat(d[xData]).toLocaleString('en')+'</div>';
            }
            return StateAbbr + xSpot + ySpot;
        });
    svg.call(toolTip);
    //change the min and max for x (smalled for min, largest for max)
    function minMaxX() {
        MinX = d3.min(data, function(d){
            return parseFloat(d[xData]);
        });
        MaxX = d3.max(data, function(d){
            return parseFloat(d[xData]);
        });
    }

    //change the min and max for y
    function minMaxY()
    {
        MinY = d3.min(data, function(d){
            return parseFloat(d[yData]);
        });
        MaxY = d3.max(data, function(d){
            return parseFloat(d[yData]);
        });
    }
    //change the way labels look when they're clicked
    function labelClick(axis, clickedText){
        d3
        .selectAll(".aText")
        .filter("." + axis)
        .filter('.active')
        .classed('active', false)
        .classed('inactive', true);

        clickedText.classed('inactive', false)
        .classed('active',true);
    }

    //grab min and max values for both x and y
    xMinMax();
    yMinMax();
    //set scale using d3 for both x (bottom) and y (left)
    //& reverse the y axis
    var scaleX = d3
        .scaleLinear().domain([MinX,MaxX]).range([margin +labelSpace, width - margin]);
    var scaleY = d3
        .scaleLinear().domain([MinY,MaxY]).range([height - margin - labelSpace, margin]);

    //pass scales in axis methods to create the axes
    var xAxis = d3.axisBottom(scaleX);
    var yAxis = d3.axisLect(scaleY);

    //tick marks for x and y (to be responsive)
    function tickResp(){
        if(width <= 530){
            xAxis.ticks(5);
            yAxis.ticks(5);
        }
        else{
            xAxis.ticks(10);
            yAxis.ticks(10); 
        }
    }
    tickResp();
    //append the axes using svg in group (g) elements, use transform to tell it where they should go
    svg
        .append('g')


    //make a group for the dots on the graph with their labels (state abbrv)

    //append the circles for each state

        //attrib of location, size, and class


}