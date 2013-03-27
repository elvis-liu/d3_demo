var width = 600;
var height = 100;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var dataset = [];
for (var i = 0; i < 25; i++) {
    var newNumber = Math.round(Math.random() * 30);
    dataset.push(newNumber);
}

svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function (d, i) {
        return (i * 50) + 25;
    })
    .attr("cy", height / 2)
    .attr("r", function (d) {
        return d;
    })
    .attr("fill", "yellow")
    .attr("stroke", "orange")
    .attr("stroke-width", function(d) {return d / 2;});
