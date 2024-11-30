import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import '../styles/HR.css';

const HR = ({ data = [] }) => {
  if (data.length === 0) {
    return <p>No data available. Please upload or load the data.</p>;
  }

  // Extract roles, salaries, and years in the company from the data
  const roles = data.map((item) => item['Role']);
  const years = data.map((item) => item['Years in the Company']);

  // Prepare data for the Salary Distribution chart
  const salaryDistribution = {
    labels: Array.from(new Set(roles)),
    datasets: [
      {
        label: 'Total Salary by Role',
        data: Array.from(new Set(roles)).map(
          (role) =>
            data
              .filter((item) => item['Role'] === role)
              .reduce((sum, item) => sum + item['Salary'], 0)
        ),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for Years in the Company Histogram
  const yearsDistribution = {
    labels: ['0-5', '6-10', '11-15', '16-20'],
    datasets: [
      {
        label: 'Number of Employees',
        data: [
          years.filter((year) => year <= 5).length,
          years.filter((year) => year > 5 && year <= 10).length,
          years.filter((year) => year > 10 && year <= 15).length,
          years.filter((year) => year > 15).length,
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for Top 5 Highest Paid Roles chart
  const topPaidRoles = [...data]
    .sort((a, b) => b['Salary'] - a['Salary'])
    .slice(0, 5)
    .map((item) => ({
      role: `${item['First Name']} ${item['Last Name']} (${item['Role']})`,
      salary: item['Salary'],
    }));

  const topPaidRolesChart = {
    labels: topPaidRoles.map((item) => item.role),
    datasets: [
      {
        label: 'Top 5 Salaries',
        data: topPaidRoles.map((item) => item.salary),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow charts to resize based on the container
  };

  return (
    <div className="hr-dashboard">
      <h1>HR Dashboard</h1>
      <div className="chart-container">
        <div className="chart-item">
          <h3>Salary Distribution by Role</h3>
          <Bar data={salaryDistribution} options={chartOptions} />
        </div>
        <div className="chart-item">
          <h3>Top 5 Highest Paid Employees</h3>
          <Pie data={topPaidRolesChart} options={chartOptions} />
        </div>
        <div className="chart-item">
          <h3>Employee Years in the Company</h3>
          <Bar data={yearsDistribution} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default HR;
