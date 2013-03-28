var width = 960,
    height = 600;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-240)
    .linkDistance(30)
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
        return d.x;
    })
        .attr("cy", function (d) {
            return d.y;
        });
}

function toggleNode(n) {
    if (removedNodes.hasOwnProperty(n)) {
        delete removedNodes[n];
    } else {
        removedNodes[n] = true;
    }
    updateGraph(dataRoot);
}

function getValidNodes(nodes) {
    return nodes.filter(function (d) {
        return !removedNodes.hasOwnProperty(d);
    });
}

function getValidLinks(links) {
    return links.filter(function (l) {
        for (var n in removedNodes) {
            if (n.group === l.target || n.group === l.source) {
                return false;
            }
        }

        return true;
    });
}

function updateGraph(root) {
    force
        .nodes(getValidNodes(root.nodes))
        .links(root.links)
        .start();

    link = svg.selectAll(".link")
        .data(root.links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", function (d) {
            return Math.sqrt(d.value);
        });

    link.exit().remove();

    node = svg.selectAll(".node")
        .data(getValidNodes(root.nodes))
        .enter().append("circle")
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
