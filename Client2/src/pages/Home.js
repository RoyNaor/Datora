import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaTimesCircle } from 'react-icons/fa';
import SideNavbar from '../components/SideNavbar';
import Navbar from '../components/Navbar';
import HR from '../dashboards/HR';
import Sales from '../dashboards/Sales';
import AdminCenter from '../dashboards/AdminCenter';
import ExcelReader from '../components/ExcelReader';
import '../styles/Home.css';
import axios from 'axios';

Modal.setAppElement('#root'); // For accessibility

function Home() {
  const [data, setData] = useState([]); // Data for the dashboards
  const [activeTab, setActiveTab] = useState('HR'); // Default to HR dashboard
  const [role, setRole] = useState(''); // Store the user's role
  const [userID, setUserID] = useState(''); // Store the user's ID
  const [isAccessDenied, setIsAccessDenied] = useState(false); // Track if access is denied
  const username = sessionStorage.getItem('username'); // Store the user's username

  // Determine the file path based on the active tab
  const filePaths = {
    HR: '/reports/fake_employee_data.xlsx',
    Sales: '/reports/mock_sales_data.xlsx',
  };

  // Fetch user ID based on the username
  useEffect(() => {
    const fetchUserId = async () => {
      if (!username) {
        console.error('Username not found in session storage.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3002/auth/getUserId/${username}`);
        const fetchedUserId = response.data.id;
        console.log('Fetched User ID:', fetchedUserId);
        setUserID(fetchedUserId);
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId();
  }, [username]); // Dependency ensures this effect runs when `username` changes

  // Fetch user role based on the user ID
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!userID) return; // Wait until `userID` is set

      try {
        const response = await axios.get(`http://localhost:3002/roles/getrole/${userID}`);
        const fetchedRole = response.data.name;
        console.log('Fetched Role:', fetchedRole);
        setRole(fetchedRole);

        // Set default active tab based on role
        if (fetchedRole === 'Admin') {
          setActiveTab('AdminCenter'); // Default to Admin Center for Admin
        } else if (fetchedRole === 'Manager') {
          setActiveTab('HR'); // Default to HR for Manager
        } else if (fetchedRole === 'Employee') {
          setActiveTab('Sales'); // Default to Sales for Employees
        }
      } catch (error) {
        console.error('Error fetching role:', error);
      }
    };

    fetchUserRole();
  }, [userID]); // Dependency ensures this effect runs when `userID` changes

  // Handle access denial logic
  useEffect(() => {
    if (
      (activeTab === 'HR' && role === 'Employee') ||
      (activeTab === 'AdminCenter' && role !== 'Admin')
    ) {
      setIsAccessDenied(true);
    } else {
      setIsAccessDenied(false);
    }
  }, [activeTab, role]); // Re-run logic whenever `activeTab` or `role` changes

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsAccessDenied(false);

    // Reset the active tab to an accessible one
    if (role === 'Employee') {
      setActiveTab('Sales'); // Default to Sales for Employee
    } else if (role === 'Manager') {
      setActiveTab('HR'); // Default to HR for Manager
    } else if (role === 'Admin') {
      setActiveTab('AdminCenter'); // Default to Admin Center for Admin
    } else {
      setActiveTab('HR'); // Fallback to HR
    }
  };

  // Render dashboards based on the active tab
  const renderDashboard = () => {
    if (isAccessDenied) return null; // Prevent rendering if access is denied
    if (activeTab === 'HR') return <HR data={data} />;
    if (activeTab === 'Sales') return <Sales data={data} />;
    if (activeTab === 'AdminCenter') return <AdminCenter data={data} />;
    return null;
  };

  return (
    <div className="home">
      <Navbar />
      <div className="main-container">
        <SideNavbar onTabChange={setActiveTab} role={role} />
        <div className="content">
          {/* Render ExcelReader with the file path for the active tab */}
          <ExcelReader filePath={filePaths[activeTab]} onDataRead={setData} />
          {data.length > 0 ? renderDashboard() : <p>Loading data...</p>}

          {/* Access Denied Modal */}
          <Modal
            isOpen={isAccessDenied}
            onRequestClose={handleCloseModal}
            className="AccessDeniedModal"
            overlayClassName="Overlay"
          >
            <div className="modal-content">
              <FaTimesCircle className="access-denied-icon" />
              <h2>Access Denied</h2>
              <p>You do not have permission to access this section.</p>
              <button onClick={handleCloseModal}>Close</button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default Home;
