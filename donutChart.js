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
        const svg = d3.select('#donutChart');

        // Config
        const margin = {'top': 25, 'right': 54, 'bottom': 50, 'left': 10};
        const width = +svg.attr('width') - (margin.right + margin.left);
        const height = +svg.attr('height') - (margin.top + margin.bottom);
        const thickness = 40;
        const radius = Math.min(width, height) / 2;
        const color = d3.scaleOrdinal()
            .range(['#1b7688','#1b7676','#f9d057','#f29e2e','#9b0a0a', '#d7191c'])

        // Create and position container
        const container = svg.append('g')
            .attr('class', 'container')
            .style('transform', `translate(50%, 50%)`)

        // Set prog_langMap
        const prog_langMap = d3.nest()
            .key(function(d) {
                return d.prog_lang
            })
            .rollup(function(v) {
                return v.length
            })
            .entries(data)
            // console.log(prog_langMap)

        /*const prog_langMap = data.map(function (d, i) {
            return d.prog_lang;
        });*/

        // arc
        const arc = d3.arc()
            .innerRadius(radius - thickness)
            .outerRadius(radius);

        // pie
        const pie = d3.pie()
            .value(function(d) {
                return d.value;
            })
            .sort(null);

        const paths = container.selectAll('path')
            .data(pie(prog_langMap))
            .enter()
            .append('g')
            .on('mouseover', function (d) {
                console.log(d)
                let g = d3.select(this)
                    .append('g')
                    .attr('class', 'text-group');

                g.append('text')
                    .attr('class', 'prog_lang-text')
                    .text(`${d.data.key}`)
                    .attr('text-anchor', 'middle')
                    .attr('dy', '-20px');

                g.append('text')
                    .attr('class', 'value-text')
                    .text(`${d.value}`)
                    .attr('text-anchor', 'middle')
                    .attr('dy', '30px');
            })
            .on('mouseout', function () {
                d3.select(this)
                    .select('.text-group').remove()
            })
            .append('path')
            .attr('d', arc)
            .attr('fill', function (d,i){
                return color(i)
            })

    }

})();