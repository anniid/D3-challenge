// @TODO: YOUR CODE HERE!
//Grab width of #scatter
var width = parseInt(d3.select('#scatter').style('width'));

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
    .attr('class', 'chart')


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

//X axis (bottom)
//append a g element so that they have somewhere to sit in the html
//create x axis vairable and give it a transform property to make the page responsive to window size

svg.append('g').attr('class','xLabel');
var xLabel = d3.select('.xLabel');

function xLabelResp(){
xLabel.attr(
    'transform',
    'translate('+ ((width-labelSpace)/2+labelSpace)+", "+
    (height-margin-textPadx)+')'
);}
xLabelResp();
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
var leftTextX = margin + textPadx;
var leftTextY = (height + labelSpace) / 2 - labelSpace;

svg.append('g').attr('class','yLabel');
var yLabel = d3.select('.yLabel');

function yLabelResp(){
    yLabel.attr(
        'transform',
        'translate('+ leftTextX+", " +leftTextY+ ')rotate(-90)'
    );
}
yLabelResp();

//add values for possible y labels
//poverty
yLabel
    .append('text')
    .attr('y',-40)
    .attr('data-name','poverty')
    .attr('data-axis','y')
    .attr('class','aText active y')
    .text('In Poverty (%)');
//avg income
yLabel
    .append('text')
    .attr('y',-20)
    .attr('data-name','income')
    .attr('data-axis','y')
    .attr('class','aText inactive y')
    .text('Household Income (Median)');
//age
yLabel
    .append('text')
    .attr('y',0)
    .attr('data-name','age')
    .attr('data-axis','y')
    .attr('class','aText inactive y')
    .text('Age (Median)');

//import .csv file & create viz function
d3.csv("assets/data/data.csv").then(function(data){
    visualize(data);
});
function visualize(data1) {
    //create default data values for x and y (the ones set as active above)
    var xData = "smokes";
    var yData = "poverty";
    //set x min and max, y min and max as empty
    var MinX;
    var MaxX;
    var MinY;
    var MaxY;

    
    //change the min and max for x (smalled for min, largest for max)
    function minMaxX() {
        MinX = d3.min(data1, function(d){
            return parseFloat(d[xData]);
        });
        MaxX = d3.max(data1, function(d){
            return parseFloat(d[xData]);
        });
    }

    //change the min and max for y
    function minMaxY()
    {
        MinY = d3.min(data1, function(d){
            return parseFloat(d[yData]);
        });
        MaxY = d3.max(data1, function(d){
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
    minMaxX();
    minMaxY();
    //set scale using d3 for both x (bottom) and y (left)
    //& reverse the y axis
    var scaleX = d3
        .scaleLinear().domain([MinX,MaxX]).range([margin +labelSpace, width - margin]);
    var scaleY = d3
        .scaleLinear().domain([MinY,MaxY]).range([height - margin - labelSpace, margin]);

    //pass scales in axis methods to create the axes
    var xAxis = d3.axisBottom(scaleX);
    var yAxis = d3.axisLeft(scaleY);

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
        .append('g').call(xAxis).attr('class','xAxis')
        .attr('transform','translate(0,'+(height-margin-labelSpace)+')');
    svg
        .append('g').call(yAxis).attr('class','yAxis')
        .attr('transform','translate('+(margin+labelSpace)+',0)');


    //make a group for the dots on the graph with their labels (state abbrv)
    var dots = svg.selectAll('g dots').data(data1).enter();
    //append the circles for each state
    dots.append('circle').attr('cx', function(d){
            return scaleX(d[xData]);
        })
        .attr('cy', function(d){
            return scaleY(d[yData]);
        })
        .attr('r', circleRad)
        .attr("class",function(d){
            return 'stateCircle' +d.abbr;
        })
        //mouseover rules:  color change
        .on('mouseover', function(d){
            d3.select(this).style('fill', '#FD8435');
        })
        //mouseout rules: color change
        .on('mouseout', function(d){
            d3.select(this).style('fill', '#000000');
        });


    //click on labels to display different data
        //"click" on the text
    d3.selectAll('.aText').on('click', function(){
        var clickedObj = d3.select(this);
        //if inactive, update attr, domain, axis, dots, abbreviations, labels, add transitions
        if (clickedObj.classed('inactive')){
            var axis = clickedObj.attr('data-axis');
            var name = clickedObj.attr('data-name');

            if (axis === 'x') {
                xData = name;
                minMaxX();
                scaleX.domain([MinX,MaxX]);
                //transition
                svg.select('.xAxis').transition().duration(180).call(xAxis);
                //dots move
                d3.selectAll('circle').each(function(){
                    d3.select(this)
                        .transition()
                        .attr('cx', function(d){
                            return scaleX(d[xData]);
                        })
                        .duration(180);
                    });
                //state abbreviations move
                d3.selectAll('.stateText').each(function(){
                    d3.select(this)
                        .transition()
                        .attr('dx', function(d){
                            return scaleX(d[xData]);
                        })
                        .duration(180);
                });
                
            //run the code
            labelClick(axis,clickedObj);
            }
            else {
                yData = name;
                minMaxY();
                scaleY.domain([MinY,MaxY]);
                svg.select('.yAxis')
                    .transition()
                    .duration(180)
                    .call(yAxis);
                //dot update for y
                d3.selectAll('circle').each(function(){
                    d3.select(this)
                        .transition()
                        .attr('cy',function(d){
                            return scaleY(d[yData]);
                        })
                        .duration(180);
                });
                //state abbreviations for y
                d3.selectAll('.stateText').each(function(){
                    d3.select(this)
                        .transition()
                        .attr('dy', function(d){
                            return scaleY(d[yData]) + circleRad/3;
                        })
                        .duration(180);
                });
            //run it
            labelClick(axis, clickedObj);
            }
        }
    });
    //make the page completely responsive
        d3.select(window).on('resize', resize);
        //d3 to resize window: width, height
        function resize() {
            width = parseFloat(d3.select("#scatter").style('width'));
            height = width - width/4;
            leftTextY = (height + labelSpace) / 2 - labelSpace;
            //new width and height to svg canvas for plot
            svg.attr('width', width).attr('height', height);
            //change scale ranges
            scaleX.range([margin + labelSpace, width - margin]);
            scaleY.range([height-labelSpace-margin, margin]);

            //update scales, axes, ticks, labels
            svg.select('xAxis').call(xAxis).attr('transform','translate(0,'+(height-margin-labelSpace)+")");
            svg.select('yaxis').call(yAxis);
            
            xLabelResp();
            yLabelResp();
            tickResp();

            //update size of dots
            circleSizeRetrieve();
            //update location and rad using d3
            d3.selectAll('circle')
                .attr('cy',function(d){
                    return scaleY(d[yData]);
                })
                .attr('cx',function(d){
                    return scaleX(d[xData]);
                })
                .attr('r', function(){ return circleRad;
                });
            //match the location and size of state abbreviations to dots
            d3.selectAll('.stateText')
                .attr('dy',function(d){
                    return scaleY(d[yData]) + circleRad/3;
                })
                .attr('dx', function(d){
                    return scaleY(d[yData]);
                })
                .attr('r', circleRad/3);
        }
}