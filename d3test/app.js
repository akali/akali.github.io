class FuzzyPartition {
    constructor(start, end, points, aliases = ["low", "middle", "high"]) {
        this.start = start;
        this.end = end;
        this.points = points;
        this.aliases = aliases;

        if (points.length != 3) {
            conosole.error('points length should be 3');
        }

        if (start > end) {
            conosole.error(`expected: start < end, found ${start} >= ${end}`);
        }
    }
    getPoints() {
        const result = [];
        const { start, end, points } = this;
        const n = points.length;

        for (let i = 0; i < n; ++i) {
            let cur = [];

            if (i == 0) {
                cur = [{ x: start, y: 1, line_id: -1 }];
                cur.push({ x: points[i], y: 1, line_id: i });

                for (let j = i + 1; j < n; ++j) {
                    cur.push({ x: points[j], y: 0, line_id: j }, );
                }

                cur.push({ x: end, y: 0, line_id: n });
            } else if (i + 1 == n) {
                cur = [{ x: start, y: 0, line_id: -1 }];
                for (let j = 0; j < i; ++j) {
                    cur.push({ x: points[j], y: 0, line_id: j });
                }
                cur.push({ x: points[i], y: 1, line_id: i });
                cur.push({ x: end, y: 1, line_id: n });
            } else {
                cur = [{ x: start, y: 0, line_id: -1 }];
                for (let j = 0; j < i; ++j) {
                    cur.push({ x: points[j], y: 0, line_id: j });
                }
                cur.push({ x: points[i], y: 1, line_id: i });
                for (let j = i + 1; j < n; ++j) {
                    cur.push({ x: points[j], y: 0, line_id: j });
                }
                cur.push({ x: end, y: 0, line_id: n });
            }

            result.push(cur);
        }

        return result;
    }
}

class Points {
    constructor(points, id) {

    }
}

class Chart {
    constructor(selector, height, width, margin, data, fuzzy_partition) {

        this.fuzzy_partition = fuzzy_partition;

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

        this.data = fuzzy_partition.getPoints();
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
                .attr("class", `line path${index}`)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 1.5)
                .attr("d", line);

            // const dots = this.chartContent
            //     .selectAll("circle")
            //     .data(points)
            //     .enter()
            //     .append("circle")
            //     .attr("class", "dot")
            //     .attr("r", this.dotRadius)
            //     .attr("cx", (d) => {
            //         return this.xScale(d.x);
            //     })
            //     .attr("cy", (d) => {
            //         return this.yScale(d.y);
            //     });

            // this.chartContent.selectAll("circle").call(this.drag);
        });

        const set = new Set();

        const self = this;

        this.fuzzy_partition.getPoints().forEach((points, points_id) => {
            points.forEach((point, id) => {
                const { x, y, line_id } = point;
                if (set.has(line_id)) return;
                if (line_id < 0 || line_id >= this.fuzzy_partition.points.length) return;
                set.add(line_id);

                const line = this.chartContent.append("line")
                    .attr("x1", this.xScale(x)) //<<== change your code here
                    .attr("y1", 0)
                    .attr("x2", this.xScale(x)) //<<== and here
                    .attr("y2", height - margin.top - margin.bottom)
                    .style("stroke-width", 2)
                    .style("stroke", "red")
                    .style("fill", "none")
                    .call(d3.drag()
                        .on('start', null)
                        .on('drag', function(d) {
                            const { dx } = d3.event;
                            const x1New = parseFloat(d3.select(this).attr('x1')) + dx;
                            const x2New = parseFloat(d3.select(this).attr('x2')) + dx;
                            line.attr("x1", x1New)
                                .attr("x2", x2New);

                            console.log(self.data[points_id]);

                            self.data.forEach((_, points_id) => {
	                            self.data[points_id][id].x = self.xScale.invert(x1New);
                            });

                            self.lines.forEach(line => {
					            // line = line[0];
					            // console.log(line);
					            console.log(`.path${line[1]}`, self.chartContent.select(`.path${line[1]}`));
					            self.chartContent.select(`.path${line[1]}`).attr("d", line[0]);
                            });
                        }).on('end', null)
                    );
            });
        });

        // this.data.forEach(points => {
        //     for (var i = 1; i + 1 < points.length; i++) {}
        // });
    };

    onDataChange(callback) {
        this.callbacks.push(callback);
    }
};

document.addEventListener('DOMContentLoaded', function() {

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const height = 480;
    const width = 400;

    //     [
    //         { x: 0, y: 1 },

    //         { x: 18, y: 1 },
    //         { x: 30, y: 0 },

    //         { x: 80, y: 0 },
    //     ],
    //     [
    //         { x: 0, y: 0 },

    //         { x: 18, y: 0 },
    //         { x: 30, y: 1 },
    //         { x: 45, y: 0 },

    //         { x: 80, y: 0 }
    //     ],
    //     [
    //         { x: 0, y: 0 },

    //         { x: 30, y: 0 },
    //         { x: 45, y: 1 },

    //         { x: 80, y: 1 }
    //     ]

    // start, points..., end
    // young: 0, 18, 30, 80
    // middle: 0, 18, 30, 45, 80
    // old: 0, 30, 45, 80

    const fuzzy_partition = new FuzzyPartition(0, 100, [18, 30, 45], ["young", "middle", "old"]);
    console.log(fuzzy_partition.getPoints());
    console.log(fuzzy_partition.aliases);

    const chart = new Chart('#my_dataviz', height, width, margin, fuzzy_partition.getPoints(), fuzzy_partition);

    chart.onDataChange((data) => {
        console.log(data);
    });
});