import { useRef, useEffect } from "react";
import d3 from '../d3'

const DonutChart = ({data: sampleData}) => {
    const svgRef = useRef()

    useEffect(() => {
        if (!sampleData) return
        const groupedData = d3.rollup(
            sampleData,
            v => d3.sum(v, d => d.acv), // Sum the values
            d => d.Acct_Industry // Group by category
        )
        console.log({groupedData})
        console.log({groupedDataV: groupedData.keys()})
        // console.log({groupedDataK: groupedData.map(d => d.key)})
        // const entries = groupedData.entries()
        // console.log(entries.next().value)
        const newData = []
        const domains = []
        const formatData = (value, key, map) => {
            // console.log({key})
            // console.log({value})
            domains.push(key)
            newData.push({[key]: value})
        }
        groupedData.forEach(formatData)
        console.log({newData})

        // set the dimensions and margins of the graph
        const width = 450
        const height = 450
        const margin = 40;

        // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        const radius = Math.min(width, height) / 2 - margin

        // append the svg object to the div called 'my_dataviz'
        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width/2},${height/2})`);

        // Create dummy data
        const data = {a: 9, b: 20, c:30, d:8, e:12, f:3, g:7, h:14}
        // const data = newData

        // set the color scale
        const color = d3.scaleOrdinal()
        .domain(["a", "b", "c", "d", "e", "f", "g", "h"])
        // .domain(domains)
        .range(d3.schemeDark2);

        // Compute the position of each group on the pie:
        const pie = d3.pie()
        .sort(null) // Do not sort group by size
        .value(d => {
            // console.log({d})
            return d[1]
        })
        const data_ready = pie(Object.entries(data))
        // const data_ready = pie(data)
        console.log({data_ready})

        // The arc generator
        const arc = d3.arc()
        .innerRadius(radius * 0.5)         // This is the size of the donut hole
        .outerRadius(radius * 0.8)

        // Another arc that won't be drawn. Just for labels positioning
        const outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9)

        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        svg.selectAll('allSlices')
            .data(data_ready)
            .join('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data[1]))
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)

        // Add the polylines between chart and labels:
        svg.selectAll('allPolylines')
            .data(data_ready)
            .join('polyline')
                .attr("stroke", "white")
                .style("fill", "none")
                .attr("stroke-width", 1)
                .attr('points', function(d) {
                    // console.log({d})
                    const posA = arc.centroid(d) // line insertion in the slice
                    const posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
                    const posC = outerArc.centroid(d); // Label position = almost the same as posB
                    const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
                    posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                    return [posA, posB, posC]
                })

        // Add the polylines between chart and labels:
        svg
        .selectAll('allLabels')
        .data(data_ready)
        .join('text')
            .text(d => d.data[0])
            .attr('transform', function(d) {
                const pos = outerArc.centroid(d);
                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                return `translate(${pos})`;
            })
            .style('text-anchor', function(d) {
                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                return (midangle < Math.PI ? 'start' : 'end')
            })
            .attr("fill", "white")
    
    }, [])
    
    return (
        <div><svg ref={svgRef} /></div>
    )
}

export default DonutChart