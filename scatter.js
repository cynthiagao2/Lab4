'use strict';

// IIFE
(function () {

    // Init data
    let data = [];

    // Fetch json data
    d3.json('/load_data', (d) => {

        return d;
    }).then((d) => {

        // Redefine data
        data = d['users'];

        createVis();
    }).catch((err) => {

        console.error(err);
    });

    /*
     Function :: createVis()
     */
    function createVis() {

        // Get svg
        const svg = d3.select('#scatter');

        // Config
        const margin = {'top': 25, 'right': 54, 'bottom': 50, 'left': 10};
        const width = +svg.attr('width') - (margin.right + margin.left);
        const height = +svg.attr('height') - (margin.top + margin.bottom);

        // Create and position container
        const container = svg.append('g')
            .attr('class', 'container')
            .style('transform', `translate(10%, 10%)`)

        // Set ageMap
        const ageMap = data.map(function (d) {
            return +d.age;
        });

        const expMap = data.map(function (d) {
            return +d.experience_yr;
        });

        const hoursMap = data.map(function (d) {
            return +d.hw1_hrs;
        });

        // X Scale
        const scX = d3.scaleLinear()
            .domain(d3.extent(expMap, (d) => {
                return d;
            }))
            .range([0, width]);

        // Y Scale
        const scY = d3.scaleLinear()
            .domain(d3.extent(hoursMap, (d) => {
                return d;
            }))
            .range([height, 0]);

        // Add x-axis
        const xAxis = container.append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0, ${height + 5})`)
            .call(d3.axisBottom(scX))
            .append('text')
                .attr('class', 'label')
                .attr('x', width)
                .attr('y', -20)
                .attr('dy', '12px')
                .attr('text-anchor', 'end')
                .text('Years of Experience');

        // Add y-axis
        const yAxis = container.append('g')
            .attr('class', 'y axis')
            .call(d3.axisLeft(scY))
            .append('text')
            .attr('class', 'label')
                .attr('transform', 'rotate(-90)')
                .attr('y', 6)
                .attr('dy', '12px')
                .attr('text-anchor', 'end')
                .text('HW1 Hours');

        // Create dots
        const dots = container.selectAll('.dot')
            .data(data)
            .enter()
            .append('circle')
                .attr('class', 'dot')
                .attr('cx', function (d) {
                    return scX(d.experience_yr);
                })
                .attr('cy', function (d) {
                    return scY(d.hw1_hrs);
                })
                .attr('r', 3)
                .style('stroke', "black")
                .style('stroke-opacity', .2)
                .style('fill', 'rgba(127, 0, 0, 1)')

    }

})();