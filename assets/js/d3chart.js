var width = 960,
    size = 150,
    padding = 19.5;

var x = d3.scale.linear()
    .range([padding / 2, size - padding / 2]);

var y = d3.scale.linear()
    .range([size - padding / 2, padding / 2]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(17);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(9);

var color = d3.scale.category10();

// Load data, 
d3.csv("data/flowers.csv", function(data) {
    takeCareOfTheDatasetAsynchronicallyButWhyBecauseFuckYouThatsWhy(data);
});

function takeCareOfTheDatasetAsynchronicallyButWhyBecauseFuckYouThatsWhy(data) {
    var domainByTrait = {};
    var traits = d3.keys(data[0]).filter(function(d) { return d !== "species"; });
    var n = traits.length;

    // This get some kind of ranges for each data series ('petal width' and so on)
    traits.forEach(function(trait) {
        domainByTrait[trait] = d3.extent(data, function(d) { return d[trait]; });
    });

    xAxis.tickSize(size * n);
    yAxis.tickSize(-size * n);

    // Create svg element
    var svg = d3.select("body").append("svg")
        .attr("width", size * n + padding)
        .attr("height", size * n + padding)
        .append("g")
            .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

    // Create vertical axes
    svg.selectAll(".x.axis")
        // Bunch of setters
        .data(traits)
        .enter().append("g")
            .attr("class", "x axis")
            .attr("transform", function(d, i) {
                return "translate(" + (n - i - 1) * size + ",0)";
            })
        // Actual construction
        .each(function(d) {
            // Rescale x-range
            x.domain(domainByTrait[d]);
            // dafuq is that for
            d3.select(this).call(xAxis);
        });

    // And horizontal
    svg.selectAll(".y.axis")
        .data(traits)
        .enter().append("g")
            .attr("class", "y axis")
            .attr("transform", function(d, i) {
                return "translate(0," + i * size + ")";
            })
        .each(function(d) {
            y.domain(domainByTrait[d]);
            d3.select(this).call(yAxis);
        });

    // Create plot holding cells
    var cell = svg.selectAll(".cell")
        .data(cross(traits, traits))
        .enter().append("g")
            .attr("class", "cell")
            .attr("transform", function(d) {
                return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")";
            })
        .each(plotGenerator(data, domainByTrait));

    // Titles for the diagonal.
    cell.filter(function(d) { return d.i === d.j; })
        .append("text")
            .attr("x", padding)
            .attr("y", padding)
            .attr("dy", ".71em")
            .text(function(d) { return d.x; });

    // What is this
    d3.select(self.frameElement).style("height", size * n + padding + 20 + "px");
}

function plotGenerator(data, domains) {
    // It should be possible to simplify it further until
    // we can get something simple as plot(x_data, y_data)
    return function(p) {
        // p.x and p.y are actually the names of data columns
        var cell = d3.select(this);

        x.domain(domains[p.x]);
        y.domain(domains[p.y]);

        // Surely there must be some better place for this
        cell.append("rect")
            .attr("class", "frame")
            .attr("x", padding / 2)
            .attr("y", padding / 2)
            .attr("width", size - padding)
            .attr("height", size - padding);

        // Create circles for every data point
        cell.selectAll("circle")
            .data(data) // wtf?
            .enter().append("circle")
                .attr("cx", function(d) { return x(d[p.x]); })
                .attr("cy", function(d) { return y(d[p.y]); })
                .attr("r", 3)
                .style("fill", function(d) { return color(d.species); });
    };
}

function cross(a, b) {
    // Generate 'cross-corelation' data ...
    var out = [];

    for (var i = 0; i < a.length; i++) {
        for (var j = 0; j < b.length; j++) {
            // ... by simply creating a matrix of paired flower points
            var val = {
                   x: a[i],
                   i: i,
                   y: b[j],
                   j: j
            };
            out.push(val);
        }
    }
    return out;
}

