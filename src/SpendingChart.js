// src/SpendingChart.js

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const SpendingChart = ({ transactions }) => {
    // Process the transaction data to be suitable for the chart
    const processChartData = () => {
        const spendingByCategory = {};

        transactions
            .filter(t => t.is_expense && t.category) // Only consider expenses with a category
            .forEach(t => {
                if (spendingByCategory[t.category]) {
                    spendingByCategory[t.category] += parseFloat(t.amount);
                } else {
                    spendingByCategory[t.category] = parseFloat(t.amount);
                }
            });

        const labels = Object.keys(spendingByCategory);
        const data = Object.values(spendingByCategory);

        return {
            labels,
            datasets: [
                {
                    label: 'Spending by Category',
                    data,
                    backgroundColor: [ // Add more colors for more categories
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)',
                        'rgba(255, 159, 64, 0.7)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        };
    };

    const chartData = processChartData();

    return (
        <div style={{ maxWidth: '400px', margin: '20px auto' }}>
            <h3>Spending Summary</h3>
            {chartData.labels.length > 0 ? (
                <Pie data={chartData} />
            ) : (
                <p>No expense data with categories to display.</p>
            )}
        </div>
    );
};

export default SpendingChart;