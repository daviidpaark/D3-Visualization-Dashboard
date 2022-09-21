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
	xPadding = 0.1;

	const X = x;
	const Y = y;

	xDomain = X;
	yDomain = [0, d3.max(Y)];

	const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);
	const yScale = yType(yDomain, yRange);
	const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
	const yAxis = d3.axisLeft(yScale).ticks(height / 20);

	title = (i) => yLabel + ": " + `${X[i]}` + "\n" + "# of Models: " + `${Y[i]}`;

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
		.attr("fill", "green")
		.selectAll("rect")
		.data(X)
		.join("rect")
		.attr("x", (i) => xScale(X[i]))
		.attr("y", (i) => yScale(Y[i]))
		.attr("height", (i) => yScale(0) - yScale(count.get(i)))
		.attr("width", xScale.bandwidth());

	bar.append("title").text(title);

	svg
		.append("g")
		.attr("transform", `translate(0,${height - marginBottom})`)
		.call(xAxis);
}

function Histogram(data, { x, y, yLabel } = {}) {
	marginTop = 20;
	marginRight = 0;
	marginBottom = 30;
	marginLeft = 40;
	width = 1500;
	height = 500;

	xRange = [marginLeft, width - marginRight];
	yType = d3.scaleLinear;
	yRange = [height - marginBottom, marginTop];

	const X = d3.map(data, x);
	const Y = d3.map(data, y);

	xDomain = new d3.InternSet(X);
	yDomain = [0, d3.max(Y)];

	const xScale = d3.scaleBand(xDomain, xRange);
	const yScale = yType(yDomain, yRange);
	const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
	const yAxis = d3.axisLeft(yScale).ticks(height / 20);

	title = (i) =>
		"Model: " + `${data[i].Model}` + "\n" + yLabel + ": " + `${Y[i]}`;

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
		.attr("fill", "green")
		.selectAll("rect")
		.data(X)
		.join("rect")
		.attr("x", (i) => xScale(X[i]))
		.attr("y", (i) => yScale(Y[i]))
		.attr("height", (i) => yScale(0) - yScale(Y[i]))
		.attr("width", xScale.bandwidth() + 1);

	bar.append("title").text(title);

	svg
		.append("g")
		.attr("transform", `translate(0,${height - marginBottom})`)
		.call(xAxis);
}

function PieChart(
	data,
	{
		name, // given d in data, returns the (ordinal) label
		value, // given d in data, returns the (quantitative) value
		title, // given d in data, returns the title text
		width = 640, // outer width, in pixels
		height = 400, // outer height, in pixels
		innerRadius = 0, // inner radius of pie, in pixels (non-zero for donut)
		outerRadius = Math.min(width, height) / 2, // outer radius of pie, in pixels
		labelRadius = innerRadius * 0.2 + outerRadius * 0.8, // center radius of labels
		format = ",", // a format specifier for values (in the label)
		names, // array of names (the domain of the color scale)
		colors, // array of colors for names
		stroke = innerRadius > 0 ? "none" : "white", // stroke separating widths
		strokeWidth = 1, // width of stroke separating wedges
		strokeLinejoin = "round", // line join of stroke separating wedges
		padAngle = stroke === "none" ? 1 / outerRadius : 0, // angular separation between wedges
	} = {}
) {
	// Compute values.
	const N = name;
	const V = value;
	const I = d3.range(N.length).filter((i) => !isNaN(V[i]));

	// Unique the names.
	if (names === undefined) names = N;
	names = new d3.InternSet(names);

	// Chose a default color scheme based on cardinality.
	if (colors === undefined) colors = d3.schemeSpectral[names.size];
	if (colors === undefined)
		colors = d3.quantize(
			(t) => d3.interpolateSpectral(t * 0.8 + 0.1),
			names.size
		);

	// Construct scales.
	const color = d3.scaleOrdinal(names, colors);

	// Compute titles.
	if (title === undefined) {
		const formatValue = d3.format(format);
		title = (i) => `${N[i]}\n${formatValue(V[i])}`;
	} else {
		const O = d3.map(data, (d) => d);
		const T = title;
		title = (i) => T(O[i], i, data);
	}

	// Construct arcs.
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
async function display(variable) {
	const svg = d3.select("#graph").selectAll("svg").remove();
	var data = await d3.csv("/data/cameras.csv");

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
		console.log(temp);
		// Split map and combine remaining values
		map = new Map(temp);
	}

	if (variable != "Release_date" && variable != "Effective_pixels") {
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
	PieChart(data, {
		name: Array.from(sortedValues.keys()),
		value: Array.from(sortedValues.values()),
	});
}
