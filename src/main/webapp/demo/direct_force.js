var width = 960;
var height = 600;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(80)
    .on("tick", tick)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var removedNodes = {};
var dataRoot,
    node,
    link;

function tick() {
    link.attr("x1", function (d) {
        return d.source.x;
    })
        .attr("y1", function (d) {
            return d.source.y;
        })
        .attr("x2", function (d) {
            return d.target.x;
        })
        .attr("y2", function (d) {
            return d.target.y;
        });

    node.attr("cx", function (d) {
        var x = d.x;
        var r = d.name.length;
        if (x - r < 0) x = r;
        if (x + r >= width) x = width - r;
        return x;
    })
        .attr("cy", function (d) {
            var y = d.y;
            var r = d.name.length;
            if (y - r < 0) y = r;
            if (y + r >= height) y = height - r;
            return y;
        });
}

function toggleNode(n) {
    var key = n.name;
    if (removedNodes.hasOwnProperty(key)) {
        delete removedNodes[key];
    } else {
        removedNodes[key] = true;
    }
    updateGraph(dataRoot);
}

function getValidNodes(nodes) {
    return nodes;
//        return nodes.filter(function (d) {
//            return !removedNodes.hasOwnProperty(d.name);
//        });
}

function getValidLinks(links) {
    return links.filter(function (l) {
        for (var n in removedNodes) {
            if (n === l.target.name || n === l.source.name) {
                return false;
            }
        }

        return true;
    });
}

function updateGraph(root) {
    force
        .nodes(getValidNodes(root.nodes))
        .links(getValidLinks(root.links))
        .start();

    link = svg.selectAll(".link")
        .data(getValidLinks(root.links));

    link.enter().append("line")
        .attr("class", "link")
        .style("stroke-width", function (d) {
            return Math.sqrt(d.value);
        });

    link.exit().remove();

    node = svg.selectAll(".node")
        .data(getValidNodes(root.nodes));

    node.enter().append("circle")
        .attr("class", "node")
        .attr("r", function (d) {
            return d.name.length;
        })
        .on("click", toggleNode)
        .style("fill", function (d) {
            return color(d.group);
        })
        .call(force.drag);

    node.append("title")
        .text(function (d) {
            return d.name;
        });

    node.exit().remove();
}

d3.json("data/miserables.json", function (error, data) {
    dataRoot = data;
    updateGraph(data);
});