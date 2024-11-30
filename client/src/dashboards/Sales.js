import React from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import '../styles/HR.css'; // Reuse HR styling for consistency

// Register required Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Sales = ({ data = [] }) => {
  if (data.length === 0) {
    return <p>No data available. Please upload or load the data.</p>;
  }

  // Extract data for charts
  const cities = data.map((item) => item['City']);
  const products = data.map((item) => item['Product Name']);
  const dates = data.map((item) => new Date(item['Transaction Date']));
  const salesAmounts = data.map((item) => item['Sale Amount']);

  // Prepare data for Total Sales by City
  const totalSalesByCity = {
    labels: Array.from(new Set(cities)),
    datasets: [
      {
        label: 'Total Sales by City',
        data: Array.from(new Set(cities)).map(
          (city) => data.filter((item) => item['City'] === city).reduce((sum, item) => sum + item['Sale Amount'], 0)
        ),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for Sales Distribution by Product
  const salesByProduct = {
    labels: Array.from(new Set(products)),
    datasets: [
      {
        label: 'Sales Distribution',
        data: Array.from(new Set(products)).map(
          (product) => data.filter((item) => item['Product Name'] === product).reduce((sum, item) => sum + item['Sale Amount'], 0)
        ),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(201, 203, 207, 0.6)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for Sales Over Time (Monthly)
  const monthlySales = {};
  dates.forEach((date, index) => {
    const month = date.toLocaleString('default', { month: 'short' });
    if (monthlySales[month]) {
      monthlySales[month] += salesAmounts[index];
    } else {
      monthlySales[month] = salesAmounts[index];
    }
  });

  const monthlySalesChart = {
    labels: Object.keys(monthlySales),
    datasets: [
      {
        label: 'Sales Over Time',
        data: Object.values(monthlySales),
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="hr-dashboard">
      <h1>Sales Dashboard</h1>
      <div className="chart-container">
        <div className="chart-item">
          <h3>Total Sales by City</h3>
          <Bar data={totalSalesByCity} options={chartOptions} />
        </div>
        <div className="chart-item">
          <h3>Sales Distribution by Product</h3>
          <Pie data={salesByProduct} options={chartOptions} />
        </div>
        <div className="chart-item">
          <h3>Sales Over Time</h3>
          <Line data={monthlySalesChart} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Sales;
