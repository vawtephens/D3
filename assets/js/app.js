// Define SVG area dimensions

function chart() {

        //if svg is present then replace wiht resized version
        var svgArea = d3.select("body").select("svg");

        // clear svg
        if (!svgArea.empty()) {
            svgArea.remove();
          }

        //dynamic svg dimensions based on screen size
                    var svgWidth = window.innerWidth*.75;
                    var svgHeight = window.innerHeight*.75;

        //var svgWidth = 960;
        //var svgHeight = 500;

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
        //var parseTime = d3.timeParse("%B");

        // Load data from miles-walked-this-month.csv
        //d3.csv("/./assets/data/data.csv").then(function(x) {
            d3.csv("https://vawtephens.github.io/D3/assets/data/data.csv").then(function(x) {
            //view data.  Data is a dictionary
            console.log(x);

        //cast values to a number
        x.forEach(y => {
            y.obesity = +y.obesity;
            y.smokes = +y.smokes;
            
        }); 
        console.log(x);

        //create scales
        var xLinSc = d3.scaleLinear()
            .domain([0, d3.max(x, y=>y.smokes)])
            .range([0, chartWidth]);

        var yLinSc = d3.scaleLinear()
            .domain([0, d3.max(x, y=>y.obesity)])
            .range([chartHeight, 0]);

        // create axes
        var xAxis = d3.axisBottom(xLinSc);
        var yAxis = d3.axisLeft(yLinSc);

        chartGroup.append("g")
            .call(yAxis);

        chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(xAxis);

        //create blocks for each circle
        // var elemEnter = chartGroup
        //     .enter()
        //     .append("g")
        //     .attr("transform", function(d)
        //         {return "translate("+d.smokes+","+d.obesity+")"})

        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([80,-60])
            .html(function(x) {
                 return (`<strong>State: ${x.state}<strong><hr>
                         <strong>Smoker Rate: ${x.smokes}<strong><hr>
                         <strong>Obesity Rate: ${x.obesity}`)
                //return ("test")
                    });

        svg.call(toolTip);
        
        // append circles
        var cirGrp = chartGroup.selectAll("circle")
                                                            //var cirGrp = elemEnter.append("circle")
            .data(x)
            .enter()
            .append("circle")
            .attr("cx", d => xLinSc(d.smokes))
            .attr("cy", d => yLinSc(d.obesity))
            .attr("r","10")
            .attr("fill","green")
            .attr("stroke-width", "1")
            .attr("stroke", "black")
            .on("mouseover", toolTip.show)
            .on("mouseout", toolTip.hide);


        // append text to circles
        //cirGrp.append("text")
                                                            //elemEnter.append("text")
            //.attr("dx", function(y){return -5})
            //.text(d=>d.abbr);


        var te = chartGroup.append('g')
            .selectAll('text')
            .data(x)
            .enter().append('text')
            .text(y=> y.abbr)
            .attr('font-size',8)
            .attr('fill','white')
            .attr('dx', d => xLinSc(d.smokes)-5)
            .attr('dy', d => yLinSc(d.obesity)+2)

          // Append axes titles
        chartGroup.append("text")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top - 20})`)
            .attr("class", "axisText")
            .text("Smoking Rate (%)");

        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 20)
            .attr("x", 0 - (chartHeight / 2))
            //.attr("dy", "1em")
            .attr("class", "axisText")
            .text("Obesity Rates (%)");


        //             //on mouse over
        // cirGrp.on("mouseover", function(data) {
        //     toolTip.show(data);
        // })
        // // on mouse out
        //     .on("mouseout", function(data) {
        //         toolTip.hide(data);
        //     });



        // //Append tooltip div
        //     var toolTip = d3.select("body")
        //         .append("div")
        //         .classed("tooltip", true);

        // //Create "mouseover"
        // cirGrp.on("mouseover", function(y) {
        //     toolTip.style("display", "block")
        //         .html(
        //             `<strong>State: ${y.state}<strong><hr>
        //             <strong>Smoker Rate: ${y.smokes}<strong><hr>
        //             <strong>Obesity Rate: ${y.obesity}`
        //             )
        //         .style("left", d3.event.pageX + "px")
        //         .style("top", d3.event.pageY + "px");
        // })

        // //Create "mouseout"
        //     .on("mouseout", function() {
        //         toolTip.style("display", "none");
        //     });

        }).catch(function(error) {
            console.log(error);
        });
}

//run when browser loads
chart();

// when browser size changes then re-chart
d3.select(window).on("resize", chart);