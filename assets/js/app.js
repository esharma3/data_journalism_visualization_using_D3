// creating svg and setting its height and width
const svgWidth = 900
const svgHeight = 610

let margin = {
	top: 30,
	right: 40,
	bottom: 110,
	left: 100
}

let width = svgWidth - margin.left - margin.right
let height = svgHeight - margin.top - margin.bottom

let svg = d3
	.select("#scatter")
	.append("svg")
	.attr("width", svgWidth)
	.attr("height", svgHeight)

// creating chart/plot element
let chartGroup = svg
	.append("g")
	.attr("transform", `translate(${margin.left}, ${margin.top})`)

// setting initial/default x-axis and y-axis labels (filters) 
let xAxisLabel = "poverty"
let yAxisLabel = "noHealthInsurance"

// function to return updated x scale based on the x-axis label selection
function xScale(totalData, xAxisLabel) {
	let xLinearScale = d3
		.scaleLinear()
		.domain([
			d3.min(totalData, d => parseInt(d[xAxisLabel]) * 0.9),
			d3.max(totalData, d => parseInt(d[xAxisLabel]) * 1.1)
		])
		.range([0, width])

	return xLinearScale
}

//function to return updated y scale based on the y-axis label selection
function yScale(totalData, yAxisLabel) {
	let yLinearScale = d3
		.scaleLinear()
		.domain([
			d3.min(totalData, d => parseInt(d[yAxisLabel]) * 0.8),
			d3.max(totalData, d => parseInt(d[yAxisLabel]) * 1.1)
		])
		.range([height, 0]);

	return yLinearScale;
}

// function to return updated x-axis based on x scale
function renderXAxis(newXScale, xAxis) {
	let bottomAxis = d3.axisBottom(newXScale)

	xAxis
		.transition()
		.duration(1000)
		.call(bottomAxis)

	return xAxis
}

// function to return updated y-axis based on y scale
function renderYAxis(newYScale, yAxis) {

	let leftAxis = d3.axisLeft(newYScale);
	yAxis.transition()
		.duration(1000)
		.call(leftAxis);
	return yAxis;

}

// function to return updated circles based on a new scale and the x and y axis label selection
function renderCircles(circlesGroup, newXScale, newYScale, xAxisLabel, yAxisLabel) {
	circlesGroup
		.transition()
		.duration(1000)
		.attr("cx", d => newXScale(d[xAxisLabel]))
		.attr("cy", d => newYScale(d[yAxisLabel]))

	return circlesGroup
}

//function for updating state abbreviations based on the x and y axis label selection
function renderCirclesText(circlesText, newXScale, newYScale, xAxisLabel, yAxisLabel) {
	circlesText.transition()
		.duration(1000)
		.attr('x', d => newXScale(d[xAxisLabel]))
		.attr('y', d => newYScale(d[yAxisLabel]));

	return textGroup

}

// #####################################################################################
//                            	   Main Script										   #	
// #####################################################################################

(function () {

	d3.csv("data/data.csv").then(totalData => {

		console.log(totalData)

		// creating scales
		let xLinearScale = xScale(totalData, xAxisLabel)
		let yLinearScale = yScale(totalData, yAxisLabel)

		// creating x and y axis
		let bottomAxis = d3.axisBottom(xLinearScale)
		let leftAxis = d3.axisLeft(yLinearScale)

		// appending x axis
		let xAxis = chartGroup
			.append("g")
			.classed("x-axis", true)
			.attr("transform", `translate(0, ${height})`)
			.call(bottomAxis)

		// appending y axis
		let yAxis = chartGroup.append('g')
			.classed('y-axis', true)
			.call(leftAxis);

		// adding circles for poverty vs noHealthcare (default chart)
		let circlesGroup = chartGroup
			.selectAll("circle")
			.data(totalData)
			.enter()
			.append("circle")
			.attr("cx", d => xLinearScale(d[xAxisLabel]))
			.attr("cy", d => yLinearScale(d[yAxisLabel]))
			.attr("r", 12)
			.attr("fill", "blue")
			.attr("opacity", ".4")
			.classed("stateCircle", true)

		// adding state abbreviations to the circles for the default chart
		let circlesText = chartGroup
			.selectAll(".stateText")
			.data(totalData)
			.enter()
			.append("text")
			.classed("stateText", true)
			.attr("x", d => xLinearScale(d[xAxisLabel]))
			.attr("y", d => yLinearScale(d[yAxisLabel]))
			.attr('dy', 3)
			.text(function (d) {
				return d.abbr
			})

		// adding x axis labels 
		let xLabelsGroup = chartGroup
			.append("g")
			.attr("transform", `translate(${width / 2}, ${height + 2})`)

		// Poverty - x axis
		let povertyLabel = xLabelsGroup
			.append("text")
			.attr("x", 40)
			.attr("y", 40)
			.attr("value", "poverty")
			.classed("active", true)
			.text("In Poverty (%)")

		// Age - x axis
		let ageLabel = xLabelsGroup
			.append("text")
			.attr("x", 40)
			.attr("y", 60)
			.attr("value", "age")
			.classed('inactive', true)
			.text("Age")

		// Median HouseHold Income - x axis 
		let incomeLabel = xLabelsGroup
			.append("text")
			.attr("x", 40)
			.attr("y", 80)
			.attr("value", "income")
			.classed('inactive', true)
			.text("Median HouseHold Income")


		// adding y axis labels 
		let yLabelsGroup = chartGroup.append('g')
			.attr('transform', `translate(${0 - margin.left/3}, ${height/2})`);

		// noHealthCare - y axis
		let noHealthCareLabel = yLabelsGroup.append("text")
			.classed('aText', true)
			.classed('active', true)
			.attr('x', 0)
			.attr('y', 0 - 20)
			.attr('dy', '1em')
			.attr('transform', 'rotate(-90)')
			.attr('value', 'noHealthInsurance')
			.text('Lacking Healthcare (%)');

		// smoker - y axis
		let smokerLabel = yLabelsGroup.append('text')
			.classed('aText', true)
			.classed('inactive', true)
			.attr('x', 0)
			.attr('y', 0 - 40)
			.attr('dy', '1em')
			.attr('transform', 'rotate(-90)')
			.attr('value', 'smokes')
			.text('Smoker (%)');

		// obese - y axis
		let obeseLabel = yLabelsGroup.append('text')
			.classed('aText', true)
			.classed('inactive', true)
			.attr('x', 0)
			.attr('y', 0 - 60)
			.attr('dy', '1em')
			.attr('transform', 'rotate(-90)')
			.attr('value', 'obesity')
			.text('Obese (%)');


		// event listener to call the update functions when a x-axis label is clicked
		xLabelsGroup.selectAll("text").on("click", function () {
			let value = d3.select(this).attr("value")
			if (value !== xAxisLabel) {
				xAxisLabel = value
				xLinearScale = xScale(totalData, xAxisLabel)
				xAxis = renderXAxis(xLinearScale, xAxis)
				circlesGroup = renderCircles(
					circlesGroup,
					xLinearScale,
					yLinearScale,
					xAxisLabel,
					yAxisLabel
				)
				circlesText = renderCirclesText(circlesText, xLinearScale, yLinearScale, xAxisLabel, yAxisLabel);

				if (xAxisLabel === 'poverty') {
					povertyLabel.classed('active', true).classed('inactive', false);
					ageLabel.classed('active', false).classed('inactive', true);
					incomeLabel.classed('active', false).classed('inactive', true);
				} else if (xAxisLabel === 'age') {
					povertyLabel.classed('active', false).classed('inactive', true);
					ageLabel.classed('active', true).classed('inactive', false);
					incomeLabel.classed('active', false).classed('inactive', true);
				} else {
					povertyLabel.classed('active', false).classed('inactive', true);
					ageLabel.classed('active', false).classed('inactive', true);
					incomeLabel.classed('active', true).classed('inactive', false);
				}
			}
		})

		// event listener to call the update functions when a y-axis label is clicked
		yLabelsGroup.selectAll("text").on("click", function () {
			let value = d3.select(this).attr("value")
			if (value !== yAxisLabel) {
				yAxisLabel = value
				console.log("y", yAxisLabel)
				yLinearScale = yScale(totalData, yAxisLabel)
				yAxis = renderYAxis(yLinearScale, yAxis)
				circlesGroup = renderCircles(
					circlesGroup,
					xLinearScale,
					yLinearScale,
					xAxisLabel,
					yAxisLabel
				)
				circlesText = renderCirclesText(circlesText, xLinearScale, yLinearScale, xAxisLabel, yAxisLabel);

				if (yAxisLabel === 'obesity') {
					obeseLabel.classed('active', true).classed('inactive', false);
					smokerLabel.classed('active', false).classed('inactive', true);
					noHealthCareLabel.classed('active', false).classed('inactive', true);
				} else if (yAxisLabel === 'smoker') {
					obeseLabel.classed('active', false).classed('inactive', true);
					smokerLabel.classed('active', true).classed('inactive', false);
					noHealthCareLabel.classed('active', false).classed('inactive', true);
				} else {
					obeseLabel.classed('active', false).classed('inactive', true);
					smokerLabel.classed('active', false).classed('inactive', true);
					noHealthCareLabel.classed('active', true).classed('inactive', false);
				}
			}
		})
	})
})()

// ################################################################# End ########################################################################