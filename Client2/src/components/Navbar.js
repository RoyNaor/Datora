import React, { useState, useEffect } from 'react';
import '../styles/Navbar.css';
import { FaUserCircle } from 'react-icons/fa'; 
import logo from '../assets/datora_logo.png'; 
//import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import Profile from '../pages/Profile'; // Import the Profile component

// Set up the app element for accessibility
Modal.setAppElement('#root');

function Navbar() {
    const username = sessionStorage.getItem("username");
    const [id, setId] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch user ID based on the username
    const fetchUserId = async (username) => {
        try {
            const response = await axios.get(`http://localhost:3002/auth/getUserId/${username}`);
            const userId = response.data.id;
            setId(userId);
            console.log("User ID:", userId);
        } catch (error) {
            console.error("Error fetching user ID:", error);
        }
    };

    // useEffect to call fetchUserId when the component mounts or username changes
    useEffect(() => {
        if (username) {
            fetchUserId(username);
        }
    }, [username]);

    // Open the profile modal
    const openProfileModal = () => {
        if (id) {
            setIsModalOpen(true);
        } else {
            console.error("User ID not found");
        }
    };

    // Close the profile modal
    const closeProfileModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className='Navbar'>
            <div className='NavbarLeft'>
                <img src={logo} alt='Logo' className='NavbarLogo' />
                <span className='NavbarTitle'>Datora</span>
            </div>
            <div className='NavbarRight'>
                <FaUserCircle className='NavbarIcon' onClick={openProfileModal} />
            </div>

            {/* Profile modal */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeProfileModal}
                className="Modal"
                overlayClassName="Overlay"
            >
                <Profile userId={id} /> {/* Pass the user ID as a prop */}
                <button onClick={closeProfileModal} className="modal-close-button">Close</button>
            </Modal>
        </div>
    );
}

export default Navbar;
