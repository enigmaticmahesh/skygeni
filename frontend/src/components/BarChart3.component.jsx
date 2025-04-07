import { useEffect, useRef, useState } from "react";
import d3 from '../d3'
import { useGetAccIndustriesQuery } from "../store/api.reducer";
import Spinner from "./Spinner.component";
import DonutChart from "./DonutChart.component";
import DonutChart2 from "./DonutChart2.component";

const StackedBar = ({data}) => {
    const svgRef = useRef();
    const svgLegendRef = useRef();

    useEffect(() => {
        if (!data) return

        // Specify the chart’s dimensions.
        const width = 928;
        const height = 1200;
        const marginTop = 10;
        const marginRight = 10;
        const marginBottom = 20;
        const marginLeft = 40;

        // Determine the series that need to be stacked.
        const series = d3.stack()
            .keys(d3.union(data.map(d => d.Acct_Industry))) // distinct series keys, in input order
            .value(([, D], key) => D.get(key)?.acv || 0) // get value for each series key and stack
            (d3.index(data, d => d.closed_fiscal_quarter, d => d.Acct_Industry)); // group by stack then series key

        // Prepare the scales for positional and color encodings.
        const x = d3.scaleBand()
            .domain(d3.groupSort(data, D => -d3.sum(D, d => d.acv), d => d.closed_fiscal_quarter))
            .range([marginLeft, width - marginRight])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
            .rangeRound([height - marginBottom, marginTop]);

        const color = d3.scaleOrdinal()
            .domain(series.map(d => d.key))
            .range(d3.schemeSpectral[series.length])
            .unknown("#ccc");

        // A function to format the value in the tooltip.
        const formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en")

        // Create the SVG container.
        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto;");

        // Append a group for each series, and a rect for each element in the series.
        svg.append("g")
            .selectAll()
            .data(series)
            .join("g")
                .attr("fill", d => color(d.key))
            .selectAll("rect")
            .data(D => D.map(d => (d.key = D.key, d)))
            .enter().append("g").each(function(d) {
                const group = d3.select(this)

                group.append("rect")
                    .attr("x", d => x(d.data[0]))
                    .attr("y", d => y(d[1]))
                    .attr("height", d => y(d[0]) - y(d[1]))
                    .attr("width", x.bandwidth())
                    .append("title")
                        .text(d => `${d.data[0]} ${d.key}\n${formatValue(d.data[1].get(d.key)?.acv || 0)}`);

                const whiteTextBg = ['#d53e4f', '#f46d43', '#3288bd']
                group.append("text")
                    .attr("transform", "translate(-25, 0)")
                    .call(text => text.append("tspan")
                        .attr("x", d => x.bandwidth()/2 + x(d.data[0]))
                        .attr("y", d => y(d[0]) + (y(d[1]) - y(d[0])) / 2)
                        .attr("font-size", "10px")
                        .attr("fill", d => whiteTextBg.includes(color(d.key)) ? "white" : "black")
                        .text(formatValue(d.data[1].get(d.key)?.acv || 0)));

                // // Draw a line to indicate a specific portion
                // const threshold = 60; // Change this value to your desired threshold
                // // const lineX = 0; // Starting x position for the line
                // const lineX = d => x.bandwidth()/2 + x(d.data[0]); // Starting x position for the line
                // const lineY = y(threshold); // Y position based on the threshold

                // group.append("line")
                //     .attr("class", "line")
                //     .attr("x1", lineX)
                //     .attr("y1", lineY)
                //     .attr("x2", width)
                //     .attr("y2", lineY);
                    
                // // Add a label for the line
                // group.append("text")
                //     .attr("x", width - 50)
                //     .attr("y", lineY - 5)
                //     .text(`Threshold: ${threshold}`)
                //     .attr("fill", "red");
            })

        // Append the horizontal axis.
        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x).tickSizeOuter(0));
            // .call(g => g.selectAll(".domain").remove());

        // Append the vertical axis.
        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y).ticks(null, "s"));
            // .call(g => g.selectAll(".domain").remove());

        // // Draw a line to indicate a specific portion
        // const threshold = 60; // Change this value to your desired threshold
        // const lineX = 0; // Starting x position for the line
        // const lineY = y(threshold); // Y position based on the threshold

        // svg.append("line")
        //     .attr("class", "line")
        //     .attr("x1", lineX)
        //     .attr("y1", lineY)
        //     .attr("x2", width)
        //     .attr("y2", lineY);
            
        // // Add a label for the line
        // svg.append("text")
        //     .attr("x", width - 50)
        //     .attr("y", lineY - 5)
        //     .text(`Threshold: ${threshold}`)
        //     .attr("fill", "red");


        // Legend
        const legend = d3.select(svgLegendRef.current)
            .attr("width", width)
            .attr("height", 100)
            .attr("viewBox", [0, 0, width, 100])
            .append("g");

        // Define number of columns
        const numColumns = 3;
        const itemHeight = 20; // Height of each legend item
        const itemWidth = 200;  // Width of each legend item
        const legendPadding = 10; // Padding between items

        color.domain().forEach((d, i) => {
            const column = Math.floor(i / (color.domain().length / numColumns)); // Determine column
            const row = Math.floor(i % (color.domain().length / numColumns)); // Determine row
            const x = column * itemWidth;
            const y = row * (itemHeight + legendPadding);

            legend.append("rect")
                .attr("x", x)
                .attr("y", y)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color(d));

            legend.append("text")
                .attr("x", column * itemWidth + 25)
                .attr("y", row * (itemHeight + legendPadding) + 15)
                .text(d)
                .style("fill", "white");
        });

    }, [data]);

    return (
        <>
            <svg ref={svgRef} />
            <br />
            <br />
            <svg ref={svgLegendRef} />
        </>
    )

}

const BarChart3 = () => {
    const { data: accIndData, isLoading } = useGetAccIndustriesQuery()

    if (isLoading || !accIndData) {
        return <Spinner />
    }

    console.log({accIndData})
    const { data } = accIndData
    return (
        <>
            <div>
                <StackedBar data={data} />
                {/* <DonutChart data={data} /> */}
                <DonutChart2 data={data} />
            </div>
        </>
    )
};

export default BarChart3;