import React, { useEffect, useRef, useState } from 'react';
import { axiosGet } from '../AxiosService';
import { Chart } from 'chart.js/auto';
import * as d3 from 'd3';

function ChartPage() {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosGet('/budget');

                if (response && response.data && response.data.myBudget) {
                    const myBudget = response.data.myBudget;
                    setChartData(myBudget);

                    if (chartInstanceRef.current) {
                        chartInstanceRef.current.destroy();
                    }

                    const chartContext = chartRef.current.getContext('2d');
                    const newChartInstance = new Chart(chartContext, {
                        type: 'pie',
                        data: {
                            labels: myBudget.map((item) => item.title),
                            datasets: [
                                {
                                    data: myBudget.map((item) => item.budget),
                                    backgroundColor: [
                                        '#ffcd56',
                                        '#ff6384',
                                        '#36a2eb',
                                        '#fd6b19',
                                        '#19fd28',
                                        '#19fddf',
                                        '#ee19fd'
                                    ],
                                },
                            ],
                        },
                    });

                    chartInstanceRef.current = newChartInstance;
                }
            } catch (error) {
                console.error('Fetching data error', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (chartData.length > 0) {
            drawD3PieChart(chartData);
        }
    }, [chartData]);

    return (
        <div className="page-area">
            <article className="text-box">
                <p>
                <canvas id="myChart" width="500" height="500" ref={chartRef}></canvas>
                    <svg id="d3PieChart" width="400" height="400"></svg>
                </p>
            </article>
        </div>
    );
}

function drawD3PieChart(data) {
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select('#d3PieChart')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.title))
        .range(['#ffcd56', '#ff6384', '#36a2eb', '#fd6b19', '#19fd28', '#19fddf', '#ee19fd']);

    const pie = d3.pie()
        .value(d => d.budget);

    const arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(0);

    const arcs = svg.selectAll('arc')
        .data(pie(data))
        .enter()
        .append('g')
        .attr('class', 'arc');

    arcs.append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.title));

    arcs.append('text')
        .attr('transform', d => {
            const pos = arc.centroid(d);
            return `translate(${pos[0]},${pos[1]})`;
        })
        .attr('dy', '0.35em')
        .style('text-anchor', 'middle')
        .text(d => `${d.data.title} (${d.data.budget})`);
}

export default ChartPage;

