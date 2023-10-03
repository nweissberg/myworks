
import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

export default function RadarDemo() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const matrix = documentStyle.getPropertyValue('--matrix-primary');
        const data = {
			labels: ['Code Implementation','Data Structures & Data Processing', 'Refactoring & Encapsulation', 'Problem Solving', 'Software Design Patterns'],
			datasets: [{
			  label: 'Skill Score',
			  data: [10, 10, 7, 9, 9],
			  backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(255, 205, 86, 0.2)',
				'rgba(201, 203, 207, 0.2)',
				'rgba(54, 162, 235, 0.2)'
			  ],
			  borderColor: [
				'rgb(255, 99, 132)',
				'rgb(75, 192, 192)',
				'rgb(255, 205, 86)',
				'rgb(201, 203, 207)',
				'rgb(54, 162, 235)'
			  ]
			}]
		  };
        const options = {
			maintainAspectRatio:false,
            plugins: {
                legend: {
					position:'right',
                    labels: {
                        color: textColor,
						font: {
							size: 15
						}
                    }
                }
            },
            scales: {
                r: {
					angleLines: {
						display: false
					},
                    grid: {
                        color: matrix
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

    return (
        <div className="card flex justify-content-center h-min">
            <Chart type="polarArea" data={chartData} options={chartOptions} className="w-full h-min flex" />
        </div>
    )
}
        