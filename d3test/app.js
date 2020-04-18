class Points {
    constructor(points, id) {

    }
}

class Chart {
    constructor(selector, height, width, margin, data) {
        this.height = height - margin.left - margin.right;
        this.width = width - margin.top - margin.bottom;
        this.margin = margin;

        this.data = [];
        this.lines = [];
        this.callbacks = [];

        this.svg = d3.select(selector)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
        this.xScale = d3.scaleLinear()
            .rangeRound([0, this.width]);

        this.yScale = d3.scaleLinear()
            .rangeRound([this.height, 0]);

        this.dotRadius = 5;

        const dragstarted = function(d) {
            d3.select(this)
                .raise()
                .classed("active", true);
        };

        const dragged = (obj => function(d) {
            console.log(d3.event.x);

            const minX = obj.dotRadius;
            const maxX = obj.width;
            if (Math.sign(d3.event.x) !== -1 && d3.event.x < obj.width) {
                d.x = obj.xScale.invert(d3.event.x);
            }
            // d3.select(this)
            //     .attr("cx", (Math.max(minX, Math.min(maxX, d3.event.x))));

            d3.select(this)
                .attr("cx", obj.xScale(d3.event.x)); //(Math.max(minX, Math.min(maxX, d3.event.x))));
            console.log(d);
            const line = obj.lines[d.id][0];
            obj.chartContent.select("path").attr("d", line);
        })(this);

        console.log(this);

        const dragended = function(d) {
            d3.select(this).classed("active", false);
        };

        this.drag = d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);

        this.svgContent = this.svg
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const clip = this.svgContent
            .append("defs")
            .append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("x", 0)
            .attr("y", 0);

        this.chartContent = this.svgContent.append("g").attr("clip-path", "url(#clip)");

        this.data = data;
        this.data.forEach(points => {
            this.xScale.domain(d3.extent(points, function(d) { return d.x; }));
            this.yScale.domain(d3.extent(points, function(d) { return d.y; }));
        });

        this.xAxis = this.svgContent
            .append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(this.xScale));

        this.yAxis = this.svgContent
            .append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(this.yScale));

        this.data.forEach((points, index) => {

            points = points.map(point => {
                point.id = index;
                return point;
            });

            const line = d3
                .line()
                .x((d) => {
                    return this.xScale(d.x);
                })
                .y((d) => {
                    return this.yScale(d.y);
                });


            this.lines.push([line, this.lines.length]);

            console.log(points);

            this.chartContent
                .append("path")
                .datum(points)
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 1.5)
                .attr("d", line);

            const dots = this.chartContent
                .selectAll("circle")
                .data(points)
                .enter()
                .append("circle")
                .attr("class", "dot")
                .attr("r", this.dotRadius)
                .attr("cx", (d) => {
                    return this.xScale(d.x);
                })
                .attr("cy", (d) => {
                    return this.yScale(d.y);
                });

            this.chartContent.selectAll("circle").call(this.drag);
        });


        console.log(this.xScale(5), this.xScale.invert(5));

        this.data.forEach(points => {
            for (var i = 1; i + 1 < points.length; i++) {
                const line = this.chartContent.append("line")
                    .attr("x1", this.xScale(points[i].x)) //<<== change your code here
                    .attr("y1", 0)
                    .attr("x2", this.xScale(points[i].x)) //<<== and here
                    .attr("y2", height - margin.top - margin.bottom)
                    .style("stroke-width", 2)
                    .style("stroke", "red")
                    .style("fill", "none")
                    .call(d3.drag()
                    .on('start', null)
                    .on('drag', function(d) {
                        var dx = d3.event.dx;
                        var x1New = parseFloat(d3.select(this).attr('x1')) + dx;
                        var x2New = parseFloat(d3.select(this).attr('x2')) + dx;
                        line.attr("x1", x1New)
                            .attr("x2", x2New)
                    }).on('end', function() {}));
            }
        });
    };

    onDataChange(callback) {
        this.callbacks.push(callback);
    }
};

document.addEventListener('DOMContentLoaded', function() {

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const height = 480;
    const width = 400;

    const data = [
        [{
                x: 0,
                y: 1,
            },
            {
                x: 18,
                y: 1,
            }, {
                x: 40,
                y: 0,
            }, {
                x: 100,
                y: 0
            }
        ],
        // [{
        //         x: 0,
        //         y: 1,
        //     },
        //     {
        //         x: 18,
        //         y: 1,
        //     }, {
        //         x: 40,
        //         y: 0,
        //     }, {
        //         x: 100,
        //         y: 0
        //     }
        // ],
    ];

    const chart = new Chart('#my_dataviz', height, width, margin, data);

    chart.onDataChange((data) => {
        console.log(data);
    });
});