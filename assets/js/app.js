
// Select the button
var but = d3.select("#gen-chart");

//create event handler
             //NEED to update DT
but.on("click", chart);

//function to add elements to drop down
function dd(cat,arr) {
    var c = d3.select(cat)
    arr.forEach((x) => {
    c.append("option").text(x)
    });
}

//Values for Drop Downs
var xT = ["Obesity Rates (%)","Poverty Rate (%)","Age","Average Income ($)","Healthcare"]
var yT = ["Smoking Rates (%)","Poverty Rate (%)","Age","Average Income ($)","Healthcare"]

//Load Values in Drop Downs
dd("#xA",xT);
dd("#yA",yT); 

function chart() {

        //Obtain var for id datetime
        var formxA = d3.select("#xA").property("value");
        var formyA = d3.select("#yA").property("value");


        //if svg is present then replace wiht resized version
        var svgArea = d3.select("body").select("svg");

        // clear svg
        if (!svgArea.empty()) {
            svgArea.remove();
          }

        //dynamic svg dimensions based on screen size
                    var svgWidth = window.innerWidth*.75;
                    var svgHeight = window.innerHeight*.75;

        // Define the chart's margins as an object
        var margin = {
        top: 60,
        right: 60,
        bottom: 60,
        left: 60
        };

        // Define dimensions of the chart area
        var chartWidth = svgWidth - margin.left - margin.right;
        var chartHeight = svgHeight - margin.top - margin.bottom;

        // Select body, append SVG area to it, and set its dimensions
        var svg = d3.select("#scatter")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

        // Append a group area, then set its margins
        var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Configure a parseTime function which will return a new Date object from a string

        // Load data from miles-walked-this-month.csv
        //d3.csv("/./assets/data/data.csv").then(function(x) {
            d3.csv("https://vawtephens.github.io/D3/assets/data/data.csv").then(function(x) {
            //view data.  Data is a dictionary
            console.log(x);

        //cast values to a number
        x.forEach(y => {
            y.obesity = +y.obesity;
            y.smokes = +y.smokes;
            y.poverty = +y.poverty;
            y.age = +y.age;
            y.income = +y.income;
            y.healthcare = +y.healthcare;           
        }); 
        console.log(x);

        //create case fuction to select correct data set
        function dat(group) {
            switch (group) {
            case "Obesity Rates (%)":
                return "obesity";
            case "Smoking Rates (%)":
                return "smokes";
            case "Poverty Rate (%)":
                return "poverty";
            case "Age":
                return "age";
            case "Average Income ($)":
                return "income"
            case "Healthcare":
                return "healthcare"
            }

        }

        var xT = ["Obesity Rates (%)","Poverty Rate (%)","Age","Average Income ($)","Healthcare"]

        //create scales
        var xLinSc = d3.scaleLinear()
            //.domain([0, d3.max(x, y=>y.smokes)])
            .domain([0, d3.max(x, y=>y[dat(formxA)])])
            .range([0, chartWidth]);

        var yLinSc = d3.scaleLinear()
            //.domain([0, d3.max(x, y=>y.obesity)])
            .domain([0, d3.max(x, y=>y[dat(formyA)])])
            .range([chartHeight, 0]);

        // create axes
        var xAxis = d3.axisBottom(xLinSc);
        var yAxis = d3.axisLeft(yLinSc);

        chartGroup.append("g")
            .call(yAxis);

        chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(xAxis);
        //define tool tips
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([80,-60])
            .html(function(x) {
                 return (`<strong>State: ${x.state}</strong><hr>
                         ${formxA}: ${x[dat(formxA)]}<hr>
                         ${formyA}: ${x[dat(formxA)]}`)
                //return ("test")
                    });

        svg.call(toolTip);
        
        // append circles
        var cirGrp = chartGroup.selectAll("circle")
                                                            //var cirGrp = elemEnter.append("circle")
            .data(x)
            .enter()
            .append("circle")
            .attr("cx", d => xLinSc(d[dat(formxA)]))
            .attr("cy", d => yLinSc(d[dat(formyA)]))
            .attr("r","10")
            .attr("fill","green")
            .attr("stroke-width", "1")
            .attr("stroke", "black")
            .attr("opacity", ".5")
            .on("mouseover", toolTip.show)
            .on("mouseout", toolTip.hide);
        /// append text to circles
        var te = chartGroup
            .append('g')
            .selectAll('circle')
            .data(x)
            .enter().append('text')
            .text(y=> y.abbr)
            .attr('font-size',8)
            .attr('fill','white')
            .attr('dx', d => xLinSc(d[dat(formxA)])-5)
            .attr('dy', d => yLinSc(d[dat(formyA)])+2)

          // Append axes titles
        chartGroup.append("text")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top - 20})`)
            .attr("class", "axisText")
            .text(formxA);

        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 20)
            .attr("x", 0 - (chartHeight / 2))
            .attr("class", "axisText")
            .text(formyA);

        }).catch(function(error) {
            console.log(error);
        });
}

//run when browser loads
chart();

// when browser size changes then re-chart
d3.select(window).on("resize", chart);