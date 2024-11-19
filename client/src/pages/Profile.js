import React, { useEffect, useState, useRef } from 'react';
import '../styles/Profile.css'; // Import CSS for styling
import axios from 'axios';

function Profile({ userId }) {
  const [username, setUsername] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const fileInputRef = useRef(null); // Reference for file input

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:3002/roles/getrole/${userId}`).then((response) => {
        setRole(response.data.name);
      }).catch(error => {
        console.error("Error fetching role:", error);
      });

      axios.get(`http://localhost:3002/auth/basicinfo/${userId}`).then((response) => {
        setUsername(response.data.username);
        setMobile(response.data.mobile);
        setEmail(response.data.email);
        // Assuming response.data.profile_picture is base64-encoded string
        setProfilePicture(`data:image/jpeg;base64,${response.data.profile_picture}`);
      }).catch(error => {
        console.error("Error fetching basic info:", error);
      });
    }
  }, [userId]);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger file input when the image is clicked
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profile_picture', file);

      try {
        await axios.post(`http://localhost:3002/auth/upload/${userId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('Profile picture uploaded successfully!');
        // Update the profile picture state with the new image
        setProfilePicture(URL.createObjectURL(file));
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        alert('Failed to upload profile picture.');
      }
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-image" onClick={handleClick}>
        {profilePicture ? (
          <img
            src={profilePicture}
            alt="Profile"
            className="profile-picture"
          />
        ) : (
          <div className="placeholder-circle"></div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
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
