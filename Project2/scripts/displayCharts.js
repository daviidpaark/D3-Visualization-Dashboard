function BarChart(data, { x, y, yLabel } = {}) {
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

	const X = d3.map(data, x);
	const Y = d3.map(data, y);

	xDomain = new d3.InternSet(X);
	yDomain = [0, d3.max(Y)];

	const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);
	const yScale = yType(yDomain, yRange);
	const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
	const yAxis = d3.axisLeft(yScale).ticks(height / 20);

	title = (i) => "ID: " + `${X[i]}` + "\n" + yLabel + ": " + `${Y[i]}`;

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
		.attr("fill", "green")
		.selectAll("rect")
		.data(X)
		.join("rect")
		.attr("x", (i) => xScale(X[i]))
		.attr("y", (i) => yScale(Y[i]))
		.attr("height", (i) => yScale(0) - yScale(Y[i]))
		.attr("width", xScale.bandwidth());

	bar.append("title").text(title);

	svg
		.append("g")
		.attr("transform", `translate(0,${height - marginBottom})`)
		.call(xAxis);
}

async function display(variable) {
	var data = await d3.csv("/data/AirplaneCrashes.csv");
	BarChart(data, {
		x: (d) => d.ID,
		y: (d) => d[variable],
		yLabel: variable,
	});
}
