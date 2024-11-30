import React, { useState } from "react";
import axios from "axios";
import "../styles/SignUp.css";

function SignUp({ onClose, onUserAdded }) {
  // State to store new user details
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    mobile: "",
    role: "Employee", // Default role is "Employee"
    password: "", // Password field
  });

  // Handle input changes (updates form fields in state)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value }); // Update state for the specific input field
  };

  // Handle form submission (add a new user)
  const handleSubmit = () => {
    const roleMap = { Admin: 1, Manager: 2, Employee: 3 }; // Map roles to role IDs
    const userToAdd = { ...newUser, role_id: roleMap[newUser.role] }; // Add role_id to the new user data

    // Send a POST request to the backend to add the user
    axios
      .post("http://localhost:3002/auth/", userToAdd)
      .then((response) => {
        if (response.data === "SUCCESS") {
          onUserAdded(userToAdd); // Notify parent component of the new user
          onClose(); // Close the modal
        } else {
          alert("Failed to add user!"); // Notify the user if the request fails
        }
      })
      .catch((error) => {
        console.error("Error adding user:", error);
        alert("Error adding user!"); // Notify the user in case of an error
      });
  };

  return (
    <div className="modal-content">
      {/* Close button to dismiss the modal */}
      <button className="close-modal" onClick={onClose}>
        &times;
      </button>

      <h2 className="modal-title">Add New User</h2>

      {/* User input form */}
      <form>
        {/* Username field */}
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={newUser.username}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Password field */}
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={newUser.password}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Email field */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Mobile field */}
        <div className="form-group">
          <label>Mobile</label>
          <input
            type="text"
            name="mobile"
            value={newUser.mobile}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Role selection dropdown */}
        <div className="form-group">
          <label>Role</label>
          <select
            name="role"
            value={newUser.role}
            onChange={handleInputChange}
          >
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Employee">Employee</option>
          </select>
        </div>

        {/* Submit button */}
        <div className="modal-buttons">
          <button type="button" className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
