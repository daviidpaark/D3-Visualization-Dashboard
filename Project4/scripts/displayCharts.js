function BarChart(data, { count, x, y, yLabel } = {}) {
	marginTop = 20;
	marginRight = 0;
	marginBottom = 30;
	marginLeft = 40;
	width = 1500;
	height = 500;

	xRange = [marginLeft, width - marginRight];
	yType = d3.scaleLinear;
	yRange = [height - marginBottom, marginTop];
	padding = 0.1;

	const xScale = d3.scaleBand(x, xRange).padding(padding);
	const yScale = d3.scaleLinear([0, d3.max(y)], yRange);
	const xAxis = d3.axisBottom(xScale);
	const yAxis = d3.axisLeft(yScale).ticks(height / 20);

	var color = d3.scaleOrdinal(d3.schemeSet2);

	title = (i) => yLabel + ": " + `${x[i]}` + "\n" + "# of Models: " + `${y[i]}`;

	d3.select("#graph")
		.append("text")
		.style("font-size", "1.5em")
		.style("font-weight", "bold")
		.text("Bar Chart");

	const svg = d3
		.select("#graph")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("viewBox", [0, 0, width, height])
		.attr("style", "max-width: 100%; height: auto; height: intrinsic;");

	svg
		.append("g")
		.attr("transform", `translate(${marginLeft},0)`)
		.call(yAxis)
		.call((g) => g.select(".domain").remove())
		.call((g) =>
			g
				.selectAll(".tick line")
				.clone()
				.attr("x2", width - marginLeft - marginRight)
				.attr("stroke-opacity", 0.1)
		)
		.call((g) =>
			g
				.append("text")
				.attr("x", -marginLeft)
				.attr("y", 10)
				.attr("fill", "currentColor")
				.attr("text-anchor", "start")
				.text(yLabel)
		);

	const bar = svg
		.append("g")
		.attr("fill", "#4770af")
		.selectAll("rect")
		.data(x)
		.join("rect")
		.attr("x", (i) => xScale(x[i]))
		.attr("y", (i) => yScale(y[i]))
		.attr("height", (i) => yScale(0) - yScale(count.get(i)))
		.attr("width", xScale.bandwidth())
		.attr("class", (d, i) => {
			return "id" + i;
		})
		.on("click", (d, i) => {
			randomColor = color(i);
			d3.selectAll("rect.id" + i).attr("fill", randomColor);
			d3.selectAll("circle.id" + i)
				.attr("fill", randomColor)
				.attr("r", 5);
			d3.selectAll("path.id" + i)
				.style("stroke", randomColor)
				.style("opacity", 1)
				.style("stroke-width", 4);
		});

	bar.append("title").text(title);

	svg
		.append("g")
		.attr("transform", `translate(0,${height - marginBottom})`)
		.call(xAxis)
		.call((g) => g.select(".domain").remove());
}

function Histogram(data, { x, y, yLabel } = {}) {
	marginTop = 20;
	marginRight = 0;
	marginBottom = 30;
	marginLeft = 40;
	width = 1500;
	height = 500;

	xRange = [marginLeft, width - marginRight];
	yRange = [height - marginBottom, marginTop];
	xPadding = 0.1;

	const X = d3.map(data, x);
	const Y = d3.map(data, y);

	const xScale = d3.scaleBand(X, xRange).padding(xPadding);
	const yScale = d3.scaleLinear([0, d3.max(Y)], yRange);
	const xAxis = d3.axisBottom(xScale);
	const yAxis = d3.axisLeft(yScale).ticks(height / 20);

	var color = d3.scaleOrdinal(d3.schemeSet2);

	title = (i) =>
		"Model: " + `${data[i].Model}` + "\n" + yLabel + ": " + `${Y[i]}`;

	d3.select("#graph")
		.append("text")
		.style("font-size", "1.5em")
		.style("font-weight", "bold")
		.text("Bar Chart");

	const svg = d3
		.select("#graph")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("viewBox", [0, 0, width, height])
		.attr("style", "max-width: 100%; height: auto; height: intrinsic;");

	svg
		.append("g")
		.attr("transform", `translate(${marginLeft},0)`)
		.call(yAxis)
		.call((g) => g.select(".domain").remove())
		.call((g) =>
			g
				.selectAll(".tick line")
				.clone()
				.attr("x2", width - marginLeft - marginRight)
				.attr("stroke-opacity", 0.1)
		)
		.call((g) =>
			g
				.append("text")
				.attr("x", -marginLeft)
				.attr("y", 10)
				.attr("fill", "currentColor")
				.attr("text-anchor", "start")
				.text(yLabel)
		);

	const bar = svg
		.append("g")
		.attr("fill", "#4770af")
		.selectAll("rect")
		.data(X)
		.join("rect")
		.attr("x", (i) => xScale(X[i]))
		.attr("y", (i) => yScale(Y[i]))
		.attr("height", (i) => yScale(0) - yScale(Y[i]))
		.attr("width", xScale.bandwidth())
		.attr("class", (d, i) => {
			return "id" + i;
		})
		.on("click", (d, i) => {
			randomColor = color(i);
			d3.selectAll("rect.id" + i).attr("fill", randomColor);
			d3.selectAll("circle.id" + i)
				.attr("fill", randomColor)
				.attr("r", 5);
			d3.selectAll("path.id" + i)
				.style("stroke", randomColor)
				.style("opacity", 1)
				.style("stroke-width", 4);
		});

	bar.append("title").text(title);

	svg
		.append("g")
		.attr("transform", `translate(0,${height - marginBottom})`)
		.call(xAxis)
		.call((g) => g.select(".domain").remove())
		.selectAll("text")
		.attr("x", 10)
		.attr("y", -2)
		.attr("dy", "0.5em")
		.attr("transform", "rotate(90)")
		.style("text-anchor", "start");
}

function PieChart(data, { name, value, label } = {}) {
	width = 700;
	height = 500;
	innerRadius = 0;
	outerRadius = Math.min(width, height) / 2;
	labelRadius = innerRadius * 0.2 + outerRadius * 0.8;
	stroke = innerRadius > 0 ? "none" : "white";
	strokeWidth = 1;
	strokeLinejoin = "round";
	padAngle = stroke === "none" ? 1 / outerRadius : 0;

	const N = name;
	const V = value;
	const I = d3.range(N.length).filter((i) => !isNaN(V[i]));

	names = new d3.InternSet(N);
	colors = d3.schemeSpectral[names.size];
	colors = d3.quantize(
		(t) => d3.interpolateSpectral(t * 0.8 + 0.1),
		names.size
	);

	const color = d3.scaleOrdinal(names, colors);

	title = (i) => `${N[i]}` + "\n" + `${V[i]}`;

	const arcs = d3
		.pie()
		.padAngle(padAngle)
		.sort(null)
		.value((i) => V[i])(I);
	const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
	const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

	const svg = d3
		.select("#graph")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("viewBox", [-width / 2, -height / 2, width, height])
		.attr("style", "max-width: 100%; height: auto; height: intrinsic;");

	svg
		.append("g")
		.attr("stroke", stroke)
		.attr("stroke-width", strokeWidth)
		.attr("stroke-linejoin", strokeLinejoin)
		.selectAll("path")
		.data(arcs)
		.join("path")
		.attr("fill", (d) => color(N[d.data]))
		.attr("d", arc)
		.append("title")
		.text((d) => title(d.data));

	svg
		.append("g")
		.attr("font-family", "sans-serif")
		.attr("font-size", 10)
		.attr("text-anchor", "middle")
		.selectAll("text")
		.data(arcs)
		.join("text")
		.attr("transform", (d) => `translate(${arcLabel.centroid(d)})`)
		.selectAll("tspan")
		.data((d) => {
			const lines = `${title(d.data)}`.split(/\n/);
			return d.endAngle - d.startAngle > 0.25 ? lines : lines.slice(0, 1);
		})
		.join("tspan")
		.attr("x", 0)
		.attr("y", (_, i) => `${i * 1.1}em`)
		.attr("font-weight", (_, i) => (i ? null : "bold"))
		.text((d) => d);
}

function Scatterplot(data, { x, y, xLabel, yLabel, label } = {}) {
	marginTop = 20;
	marginRight = 30;
	marginBottom = 30;
	marginLeft = 40;
	width = 1500;
	height = 500;
	xType = d3.scaleLinear;
	xRange = [marginLeft, width - marginRight];
	yType = d3.scaleLinear;
	yRange = [height - marginBottom, marginTop];

	const X = d3.map(data, x);
	const Y = d3.map(data, y);
	const I = d3.range(X.length).filter((i) => !isNaN(X[i]) && !isNaN(Y[i]));

	xDomain = d3.extent(X);
	yDomain = d3.extent(Y);

	const xScale = xType(xDomain, xRange);
	const yScale = yType(yDomain, yRange);
	const xAxis = d3.axisBottom(xScale).ticks(width / 80);
	const yAxis = d3.axisLeft(yScale).ticks(height / 50);

	title = (i) => "Model: " + `${data[i].Model}`;

	var color = d3.scaleOrdinal(d3.schemeSet2);

	d3.select("#graph")
		.append("text")
		.style("font-size", "1.5em")
		.style("font-weight", "bold")
		.text(label);

	const svg = d3
		.select("#graph")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("viewBox", [0, 0, width, height])
		.attr("style", "max-width: 100%; height: auto; height: intrinsic;");

	svg
		.append("g")
		.attr("transform", `translate(0,${height - marginBottom})`)
		.call(xAxis)
		.call((g) => g.select(".domain").remove())
		.call((g) =>
			g
				.selectAll(".tick line")
				.clone()
				.attr("y2", marginTop + marginBottom - height)
				.attr("stroke-opacity", 0.1)
		)
		.call((g) =>
			g
				.append("text")
				.attr("x", width)
				.attr("y", marginBottom - 4)
				.attr("fill", "currentColor")
				.attr("text-anchor", "end")
				.text(xLabel)
		);

	svg
		.append("g")
		.attr("transform", `translate(${marginLeft},0)`)
		.call(yAxis)
		.call((g) => g.select(".domain").remove())
		.call((g) =>
			g
				.selectAll(".tick line")
				.clone()
				.attr("x2", width - marginLeft - marginRight)
				.attr("stroke-opacity", 0.1)
		)
		.call((g) =>
			g
				.append("text")
				.attr("x", -marginLeft)
				.attr("y", 10)
				.attr("fill", "currentColor")
				.attr("text-anchor", "start")
				.text(yLabel)
		);

	svg
		.append("g")
		.attr("fill", "#4770af")
		.attr("stroke", "#4770af")
		.attr("stroke-width", 1)
		.selectAll("circle")
		.data(I)
		.join("circle")
		.attr("cx", (i) => xScale(X[i]))
		.attr("cy", (i) => yScale(Y[i]))
		.attr("r", 3)
		.attr("class", (d, i) => {
			return "id" + i;
		})
		.on("click", (d, i) => {
			randomColor = color(i);
			d3.selectAll("rect.id" + i).attr("fill", randomColor);
			d3.selectAll("circle.id" + i)
				.attr("fill", randomColor)
				.attr("r", 5);
			d3.selectAll("path.id" + i)
				.style("stroke", randomColor)
				.style("opacity", 1)
				.style("stroke-width", 4);
		});

	d3.selectAll("circle").append("title").text(title);
}

async function parallelCoordinates() {
	var marginTop = 30;
	var marginRight = 10;
	var marginBottom = 10;
	var marginLeft = 0;
	var width = 1200 - marginLeft - marginRight;
	var height = 700 - marginTop - marginBottom;

	var color = d3.scaleOrdinal(d3.schemeSet2);

	d3.select("#graph")
		.append("text")
		.style("font-size", "1.5em")
		.style("font-weight", "bold")
		.text("Parallel Coordinates");

	var svg = d3
		.select("#graph")
		.append("svg")
		.attr("width", width + marginLeft + marginRight)
		.attr("height", height + marginTop + marginBottom)
		.append("g")
		.attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

	d3.csv("http://127.0.0.1:5001/data").then((data) => {
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
			.attr("class", (d, i) => {
				return "id" + i;
			})
			.style("fill", "none")
			.style("stroke", "#4770af")
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

async function display(variable) {
	d3.select("#graph").selectAll("text").remove();
	d3.select("#graph").selectAll("svg").remove();

	var count = new Map();
	for (var i = 0; i < data.length; i++) {
		if (count.get(data[i][variable]) !== undefined) {
			count.set(data[i][variable], count.get(data[i][variable]) + 1);
		} else {
			count.set(data[i][variable], 1);
		}
	}
	count = new Map([...count.entries()].sort());

	var sortedValues = new Map([...count.entries()].sort((a, b) => b[1] - a[1]));
	if (sortedValues.size > 6) {
		temp = Array.from(sortedValues).slice(5, sortedValues.size);
		sortedValues = new Map(Array.from(sortedValues).slice(0, 5));
		total = 0;
		for (var i = 0; i < temp.length; i++) {
			total += temp[i][1];
		}
		sortedValues.set("Other", total);
	}

	if (variable != "Effective_pixels") {
		Histogram(data, {
			x: (d) => d.ID,
			y: (d) => parseInt(d[variable]),
			yLabel: variable,
		});
	} else {
		BarChart(data, {
			count: count,
			x: Array.from(count.keys()),
			y: Array.from(count.values()),
			yLabel: variable,
		});
	}

	Scatterplot(pca, {
		x: (d) => parseFloat(d["PC1"]),
		y: (d) => parseFloat(d["PC2"]),
		xLabel: "PC1",
		yLabel: "PC2",
		label: "Biplot",
	});

	Scatterplot(mds, {
		x: (d) => parseFloat(d["x"]),
		y: (d) => parseFloat(d["y"]),
		label: "MDS",
	});

	parallelCoordinates();
	// PieChart(data, {
	// 	name: Array.from(sortedValues.keys()),
	// 	value: Array.from(sortedValues.values()),
	// 	label: variable,
	// });
}

async function scatter() {
	const svg = d3.select("#graph").selectAll("svg").remove();
	var data = await d3.csv("/data/cameras.csv");

	Scatterplot(data, {
		x: (d) => parseInt(d[x]),
		y: (d) => parseInt(d[y]),
		xLabel: x,
		yLabel: y,
	});
}

var x = 0;
var y = 0;

let data;
let pca;
let mds;

async function loadData() {
	data = await d3.csv("http://127.0.0.1:5001/data");
	pca = await d3.csv("http://127.0.0.1:5001/pca");
	mds = await d3.csv("http://127.0.0.1:5001/mds");
}

function setX(value) {
	x = value;
}

function setY(value) {
	y = value;
}

function select() {}
