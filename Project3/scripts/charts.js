async function renderCharts() {
	var data = await d3.csv("http://127.0.0.1:5000/");

	var marginTop = 20;
	var marginRight = 20;
	var marginBottom = 20;
	var marginLeft = 20;
	var width = 700 - marginLeft - marginRight;
	var height = 700 - marginTop - marginBottom;

	const svg = d3
		.select("#graph")
		.append("svg")
		.attr("width", width + marginLeft + marginRight)
		.attr("height", height + marginTop + marginBottom);

	d3.csv("http://127.0.0.1:5000/").then((elements) => {
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
