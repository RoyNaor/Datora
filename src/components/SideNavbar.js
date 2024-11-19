import React, { useState } from 'react';
import '../styles/SideNavbar.css';
import { SidebarTab } from './SidebarTab';
import { FaInfoCircle } from 'react-icons/fa';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import Lottie from 'lottie-react'; 
import animationData from '../animations/BIAnimation.json'; 

Modal.setAppElement('#root'); // Set the app element for accessibility

function SideNavbar({ onTabChange }) {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("userId");
    navigate('/');
  };

  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  const openAboutModal = () => setIsAboutModalOpen(true);
  const closeAboutModal = () => setIsAboutModalOpen(false);

  const confirmLogout = () => {
    handleLogout();
    closeLogoutModal();
  };

  return (
    <div className='Sidebar'>
      <ul className='SideBarList'>
        {SidebarTab.map((val, key) => (
          <li
            key={key}
            className='SidebarRow'
            onClick={() => onTabChange(val.component)}
          >
            <div className='SidebarIcon'> {val.icon} </div>
            <div className='SidebarTitle'> {val.title} </div>
          </li>
        ))}
      </ul>
      <div className='SidebarBottom'>
        <FaInfoCircle className='SidebarBottomIcon' onClick={openAboutModal} />
        <LogoutIcon className='SidebarBottomIcon' onClick={openLogoutModal} />
      </div>

      {/* Logout confirmation modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onRequestClose={closeLogoutModal}
        className="LogoutModal"
        overlayClassName="Overlay"
      >
        <h2>Logout</h2>
        <p>Are you sure you want to logout?</p>
        <button onClick={confirmLogout}>Yes</button>
        <button onClick={closeLogoutModal}>No</button>
      </Modal>

      {/* About Us modal with Lottie animation */}
      <Modal
        isOpen={isAboutModalOpen}
        onRequestClose={closeAboutModal}
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
        <Lottie animationData={animationData} style={{ width: 300, height: 300, marginBottom: 20 }} />
        <button onClick={closeAboutModal}>Close</button>
      </Modal>
    </div>
  );
}

export default SideNavbar;
