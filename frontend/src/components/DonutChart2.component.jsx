import { useEffect, useRef } from 'react'
import d3 from '../d3'

const DonutChart2 = ({data: sampleData}) => {
    const svgRef = useRef()

    useEffect(() => {
        if (!sampleData) return

        const groupedData = d3.rollup(
            sampleData,
            v => d3.sum(v, d => d.acv), // Sum the values
            d => d.Acct_Industry // Group by category
        )
        // console.log({groupedData})
        // console.log({groupedDataV: groupedData.keys()})
        // console.log({groupedDataK: groupedData.map(d => d.key)})
        // const entries = groupedData.entries()
        // console.log(entries.next().value)
        const newData = []
        const domains = []
        const formatData = (value, key, map) => {
            // console.log({key})
            // console.log({value})
            domains.push(key)
            // newData.push({[key]: value})
            newData.push({
                name: key,
                value,
            })
        }
        groupedData.forEach(formatData)
        console.log({newData})
        const data = newData



        const margin = 40;
        const width = 800
        const height = 400;
        // const height = Math.min(width, 700);
        // const radius = Math.min(width, height) / 2;

        // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        const radius = Math.min(width, height) / 2 - margin
      
        const arc = d3.arc()
            .innerRadius(radius * 0.67)
            .outerRadius(radius - 1);

        // Another arc that won't be drawn. Just for labels positioning
        const outerArc = d3.arc()
        .innerRadius(radius * 0.95)
        .outerRadius(radius * 0.95)
      
        const pie = d3.pie()
            .padAngle(1 / radius)
            .sort(null)
            .value(d => d.value);

            console.log({data_ready: pie(data)})
      
        const color = d3.scaleOrdinal()
            .domain(data.map(d => d.name))
            .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());
      
        const svg = d3.select(svgRef.current)
            .attr("width", width)
            // .attr("height", height)
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .attr("style", "max-width: 100%;");
      
        svg.append("g")
          .selectAll()
          .data(pie(data))
          .join("path")
            .attr("fill", d => color(d.data.name))
            .attr("d", arc)
          .append("title")
            .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);
      
        // svg.append("g")
        //     .attr("font-family", "sans-serif")
        //     .attr("font-size", 12)
        //     .attr("text-anchor", "middle")
        //   .selectAll()
        //   .data(pie(data))
        //   .join("text")
        //     .attr("transform", d => `translate(${arc.centroid(d)})`)
        //     .call(text => text.append("tspan")
        //         .attr("y", "-0.4em")
        //         .attr("font-weight", "bold")
        //         .text(d => d.data.name))
        //     .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
        //         .attr("x", 0)
        //         .attr("y", "0.7em")
        //         .attr("fill-opacity", 0.7)
        //         .text(d => d.data.value.toLocaleString("en-US")));


        const incrementalOffset = (arc, d, incX = false, incY = true) => {
            const pos = arc.centroid(d)

            // Calculate the angle of the arc to determine the offset
            // const angle = (d.startAngle + d.endAngle) / 2; // Midpoint angle
            const angle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
            const baseOffset = 20; // Base distance from the centroid
            const incrementalOffset = 50; // Incremental distance for each label

            // Calculate the label position based on the angle and incremental offset
            const offset = baseOffset + (incrementalOffset * d.index); // Incremental offset

            // Calculate the label position based on the angle
            const labelX = incX ? (pos[0] + offset * Math.cos(angle)) : pos[0]
            const labelY = incY ? (pos[1] + offset * Math.sin(angle)) : pos[1]
            // console.log({pos})
            // console.log({labelX})
            // console.log({labelY})
            const newPos = [labelX, labelY]
            return newPos
        }

        // Add the polylines between chart and labels:
        svg.selectAll('allPolylines')
            .data(pie(data))
            .join('polyline')
                .attr("stroke", "white")
                .style("fill", "none")
                .attr("stroke-width", 1)
                .attr('points', function(d) {
                    const posA = arc.centroid(d) // line insertion in the slice
                    // const posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
                    const posB = incrementalOffset(outerArc, d)
                    // const posC = outerArc.centroid(d); // Label position = almost the same as posB
                    const posC = incrementalOffset(outerArc, d)
                    const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
                    console.log({d})
                    // console.log({midangle})
                    posC[0] = radius * 1.25 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                    // posC[1] = posC[1] + offset * Math.sin(angle);
                    return [posA, posB, posC]
                })

        svg.selectAll('allLabels')
            .data(pie(data))
            .join('text')
                .text(d => {
                    // console.log({d})
                    return d.data.name
                })
                .attr('transform', function(d) {
                    // const pos = outerArc.centroid(d);
                    const pos = incrementalOffset(outerArc, d)
                    const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                    pos[0] = radius * 1.3 * (midangle < Math.PI ? 1 : -1);
                    return `translate(${pos})`;
                })
                .style('text-anchor', function(d) {
                    const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                    return (midangle < Math.PI ? 'start' : 'end')
                })
                .attr("fill", "white")
                .attr("font-size", "10px")
    
    }, [sampleData])
    
    return (
        <div><svg height={600} ref={svgRef} /></div>
    )
}

export default DonutChart2