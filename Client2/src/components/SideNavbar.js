import React, { useState } from 'react';
import '../styles/SideNavbar.css';
import { SidebarTab } from './SidebarTab';
import { FaInfoCircle } from 'react-icons/fa';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import Lottie from 'lottie-react'; 
import animationData from '../animations/BIAnimation.json'; 

// Set the app element for accessibility (required by React Modal)
Modal.setAppElement('#root'); 

function SideNavbar({ onTabChange }) {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // State to track the logout confirmation modal
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false); // State to track the About Us modal
  const navigate = useNavigate(); // Hook for navigation

  // Handle user logout by clearing session storage and navigating to login
  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("userId");
    navigate('/'); // Navigate to login/homepage
  };

  // Open and close functions for the Logout modal
  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  // Open and close functions for the About Us modal
  const openAboutModal = () => setIsAboutModalOpen(true);
  const closeAboutModal = () => setIsAboutModalOpen(false);

  // Confirm the logout and close the modal
  const confirmLogout = () => {
    handleLogout();
    closeLogoutModal();
  };

  return (
    <div className='Sidebar'>
      {/* Render the sidebar list with clickable tabs */}
      <ul className='SideBarList'>
        {SidebarTab.map((val, key) => (
          <li
            key={key} // Unique key for each tab
            className='SidebarRow'
            onClick={() => onTabChange(val.component)} // Trigger tab change when clicked
          >
            <div className='SidebarIcon'> {val.icon} </div> {/* Tab icon */}
            <div className='SidebarTitle'> {val.title} </div> {/* Tab title */}
          </li>
        ))}
      </ul>

      {/* Sidebar bottom with About and Logout icons */}
      <div className='SidebarBottom'>
        <FaInfoCircle className='SidebarBottomIcon' onClick={openAboutModal} /> {/* About Us icon */}
        <LogoutIcon className='SidebarBottomIcon' onClick={openLogoutModal} /> {/* Logout icon */}
      </div>

      {/* Logout confirmation modal */}
      <Modal
        isOpen={isLogoutModalOpen} // Show modal if true
        onRequestClose={closeLogoutModal} // Close modal on request
        className="LogoutModal"
        overlayClassName="Overlay"
      >
        <h2>Logout</h2>
        <p>Are you sure you want to logout?</p>
        <button onClick={confirmLogout}>Yes</button> {/* Confirm logout */}
        <button onClick={closeLogoutModal}>No</button> {/* Cancel logout */}
      </Modal>

      {/* About Us modal with Lottie animation */}
      <Modal
        isOpen={isAboutModalOpen} // Show modal if true
        onRequestClose={closeAboutModal} // Close modal on request
        className="AboutUsModal"
        overlayClassName="Overlay"
      >
        <h2>About Us</h2>
        <p>
          Datora is your comprehensive Business Intelligence (BI) workspace, designed
          to empower teams with actionable insights and data-driven strategies. Our
          platform integrates seamless data visualization, advanced analytics, and
          intuitive dashboards to enhance your decision-making process.
        </p>
        {/* Lottie animation for visual appeal */}
        <Lottie animationData={animationData} style={{ width: 300, height: 300, marginBottom: 20 }} />
        <button onClick={closeAboutModal}>Close</button> {/* Close About Us modal */}
      </Modal>
    </div>
  );
}

export default SideNavbar;
