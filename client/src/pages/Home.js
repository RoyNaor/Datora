import React, { useState } from 'react';
import SideNavbar from '../components/SideNavbar';
import Navbar from '../components/Navbar';
import HR from '../dashboards/HR';
import Sales from '../dashboards/Sales';
import ExcelReader from '../components/ExcelReader';
import '../styles/Home.css';

function Home() {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState('HR'); // Default to HR dashboard

  // Determine the file path based on the active tab
  const filePaths = {
    HR: '/reports/fake_employee_data.xlsx',
    Sales: '/reports/mock_sales_data.xlsx', // Path to your sales data file
    // Add more paths as needed for other dashboards
  };

  return (
    <div className='home'>
      <Navbar />
      <div className='main-container'>
        <SideNavbar onTabChange={setActiveTab} />
        <div className='content'>
          {/* Render ExcelReader with the file path for the active tab */}
          <ExcelReader filePath={filePaths[activeTab]} onDataRead={setData} />
          {data.length > 0 ? (
            <>
              {activeTab === 'HR' && <HR data={data} />}
              {activeTab === 'Sales' && <Sales data={data} />}
              
            </>
          ) : (
            <p>Loading data...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
