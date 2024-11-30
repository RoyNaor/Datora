import React, { useEffect, useState, useRef } from 'react';
import '../styles/Profile.css'; // Import CSS for styling
import axios from 'axios';

function Profile({ userId }) {
  // State variables to store user information
  const [username, setUsername] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const fileInputRef = useRef(null); // Reference for file input

  // Fetch user information and role when `userId` changes
  useEffect(() => {
    if (userId) {
      // Fetch user role
      axios
        .get(`http://localhost:3002/roles/getrole/${userId}`)
        .then((response) => {
          setRole(response.data.name); // Set role in state
        })
        .catch((error) => {
          console.error('Error fetching role:', error);
        });

      // Fetch user basic information
      axios
        .get(`http://localhost:3002/auth/basicinfo/${userId}`)
        .then((response) => {
          setUsername(response.data.username);
          setMobile(response.data.mobile);
          setEmail(response.data.email);

          // Set profile picture if available
          if (response.data.profile_picture) {
            setProfilePicture(
              `data:image/jpeg;base64,${response.data.profile_picture}`
            );
          }
        })
        .catch((error) => {
          console.error('Error fetching basic info:', error);
        });
    }
  }, [userId]); // Dependency array ensures this runs when `userId` changes

  // Handle click event to trigger file input
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically open file input
    }
  };

  // Handle file input change (upload new profile picture)
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profile_picture', file); // Append the file to the form data

      try {
        // Upload the new profile picture to the server
        await axios.post(
          `http://localhost:3002/auth/upload/${userId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        alert('Profile picture uploaded successfully!');
        // Update profile picture preview with the new image
        setProfilePicture(URL.createObjectURL(file));
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        alert('Failed to upload profile picture.');
      }
    }
  };

  return (
    <div className="profile-container">
      {/* Profile picture section */}
      <div className="profile-image" onClick={handleClick}>
        {profilePicture ? (
          // Display the profile picture if available
          <img
            src={profilePicture}
            alt="Profile"
            className="profile-picture"
          />
        ) : (
          // Display a placeholder circle if no profile picture
          <div className="placeholder-circle"></div>
        )}
      </div>
      {/* Hidden file input for profile picture upload */}
      <input
        type="file"
        ref={fileInputRef} // Reference to programmatically trigger
        style={{ display: 'none' }}
        onChange={handleFileChange} // Handle file upload
      />
      {/* Display user details */}
      <div className="profile-details">
        <h2>{username}</h2>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Mobile:</strong> {mobile}</p>
        <p><strong>Role:</strong> {role}</p>
      </div>
    </div>
  );
}

export default Profile;
