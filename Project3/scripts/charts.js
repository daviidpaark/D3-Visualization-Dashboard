async function correlationMatrix() {
	var data = await d3.csv("http://127.0.0.1:5000/corr");

	var marginTop = 20;
	var marginRight = 20;
	var marginBottom = 20;
	var marginLeft = 20;
	var width = 700 - marginLeft - marginRight;
	var height = 700 - marginTop - marginBottom;

	d3.select("body")
		.append("text")
		.style("font-size", "1.5em")
		.style("font-weight", "bold")
		.text("Correlation Matrix");

	const svg = d3
		.select("body")
		.append("div")
		.append("svg")
		.attr("width", width + marginLeft + marginRight)
		.attr("height", height + marginTop + marginBottom);

	d3.csv("http://127.0.0.1:5000/corr").then((elements) => {
		elements.forEach((d) => {
			let x = d[""];
			delete d[""];
			for (label in d) {
				let y = label,
					value = d[label];
				data.push({
					x: x,
					y: y,
					value: +value,
				});
			}
		});

		const domain = Array.from(
			new Set(
				data.map((d) => {
					return d.x;
				})
			)
		);

		const color = d3
			.scaleLinear()
			.domain([-1, 0, 1])
			.range(["#ff0000", "#fff", "#0000ff"]);

		const x = d3.scalePoint().range([0, width]).domain(domain);
		const y = d3.scalePoint().range([0, height]).domain(domain);

		const matrix = svg
			.selectAll(".matrix")
			.data(data)
			.join("g")
			.attr("class", "matrix")
			.attr("transform", (d) => {
				return `translate(${x(d.x)}, ${y(d.y)})`;
			});

		matrix
			.filter((d) => {
				const ypos = domain.indexOf(d.y);
				const xpos = domain.indexOf(d.x);
				return xpos < ypos;
			})
			.append("rect")
			.attr("width", 55)
			.attr("height", 55)
			.attr("y", -32)
			.attr("x", -7)
			.style("fill", (d) => {
				if (d.x === d.y) {
					return "#fff";
				} else {
					return color(d.value);
				}
			});

		matrix
			.filter((d) => {
				const ypos = domain.indexOf(d.y);
				const xpos = domain.indexOf(d.x);
				return xpos <= ypos;
			})
			.append("text")
			.text((d) => {
				if (d.x === d.y) {
					return d.x;
				} else {
					return d.value.toFixed(2);
				}
			})
			.style("font-size", 11)
			.style("text-align", "center")
			.style("fill", (d) => {
				if (d.x === d.y) {
					return "#000";
				} else {
					return d.value >= 0.35 ? "white" : "black";
				}
			});
	});
}

async function scatterplotMatrix() {}

async function parallelCoordinates() {
	var marginTop = 30;
	var marginRight = 10;
	var marginBottom = 10;
	var marginLeft = 0;
	var width = 1200 - marginLeft - marginRight;
	var height = 700 - marginTop - marginBottom;

	d3.select("body")
		.append("text")
		.style("font-size", "1.5em")
		.style("font-weight", "bold")
		.text("Parallel Coordinates");

	var svg = d3
		.select("body")
		.append("div")
		.append("svg")
		.attr("width", width + marginLeft + marginRight)
		.attr("height", height + marginTop + marginBottom)
		.append("g")
		.attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

	d3.csv("http://127.0.0.1:5000/data").then((data) => {
		dimensions = [
			"Max_resolution",
			"Effective_pixels",
			"Weight",
			"Zoom_tele",
			"Zoom_wide",
			"Normal_focus_range",
			"Macro_focus_range",
			"Storage",
			"Low_resolution",
			"Price",
		];

		const y = {};
		for (i in dimensions) {
			label = dimensions[i];
			y[label] = d3
				.scaleLinear()
				.domain(
					d3.extent(data, (d) => {
						return +d[label];
					})
				)
				.range([height, 0]);
		}

		x = d3.scalePoint().range([0, width]).padding(1).domain(dimensions);

		function path(d) {
			return d3.line()(
				dimensions.map((p) => {
					return [x(p), y[p](d[p])];
				})
			);
		}

		svg
			.selectAll("lines")
			.data(data)
			.join("path")
			.attr("d", path)
			.style("fill", "none")
			.style("stroke", "green")
			.style("opacity", 0.5);

		svg
			.selectAll("labels")
			.data(dimensions)
			.enter()
			.append("g")
			.attr("transform", (d) => {
				return "translate(" + x(d) + ")";
			})
			.each(function (d) {
				d3.select(this).call(d3.axisLeft().scale(y[d]));
			})
			.append("text")
			.style("text-anchor", "middle")
			.attr("y", -9)
			.text((d) => {
				return d;
			})
			.style("fill", "black");
	});
}

async function renderCharts() {
	await correlationMatrix();
	await scatterplotMatrix();
	await parallelCoordinates();
}
