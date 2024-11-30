import React, { useEffect, useState } from "react";
import axios from "axios";
import SignUp from "../pages/SignUp"; // Import the SignUp component
import "../styles/AdminCenter.css";

function AdminCenter() {
  const [users, setUsers] = useState([]); // State to store all user data
  const [editedRoles, setEditedRoles] = useState({}); // State to track role changes
  const [isChanged, setIsChanged] = useState(false); // State to track unsaved changes
  const [showSignUpModal, setShowSignUpModal] = useState(false); // State to control SignUp modal visibility
  const [deleteUserId, setDeleteUserId] = useState(null); // State to store the user ID to be deleted
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State to control the Delete Confirmation modal

  // Fetch user data when the component loads
  useEffect(() => {
    axios.get("http://localhost:3002/auth/users").then((response) => {
      setUsers(response.data); // Populate user state with fetched data
    });
  }, []); // Empty dependency array ensures this runs only once on mount

  // Handle role changes when selecting a different role in the dropdown
  const handleRoleChange = (id, newRole) => {
    setEditedRoles({ ...editedRoles, [id]: newRole }); // Update the editedRoles state
    setIsChanged(true); // Mark that there are unsaved changes
  };

  // Apply role changes to the backend and update the UI
  const applyChanges = () => {
    const updates = Object.keys(editedRoles).map((id) => {
      return axios.put(`http://localhost:3002/roles/users/${id}`, {
        role_id: editedRoles[id], // Send the new role ID to the backend
      });
    });

    Promise.all(updates) // Wait for all updates to complete
      .then(() => {
        // Update the local user list with the new roles
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            editedRoles[user.id]
              ? { ...user, role_id: editedRoles[user.id] }
              : user
          )
        );
        setEditedRoles({}); // Clear the edited roles state
        setIsChanged(false); // Reset the unsaved changes flag
        alert("Changes applied successfully!"); // Notify the user
      })
      .catch((error) => {
        console.error("Error applying changes:", error); // Log any errors
      });
  };

  // Handle initiating a user delete action
  const handleDeleteUser = (userId) => {
    setDeleteUserId(userId); // Set the user ID to be deleted
    setShowDeleteConfirmation(true); // Open the confirmation modal
  };

  // Confirm the deletion of a user
  const confirmDeleteUser = () => {
    axios
      .delete(`http://localhost:3002/auth/delete/${deleteUserId}`) // Delete user by ID
      .then(() => {
        setUsers(users.filter((user) => user.id !== deleteUserId)); // Remove the deleted user from the UI
        setShowDeleteConfirmation(false); // Close the confirmation modal
        setDeleteUserId(null); // Reset the deleteUserId state
      })
      .catch((error) => {
        console.error("Error deleting user:", error); // Log any errors
      });
  };

  return (
    <div className="admin-center">
      <h1>Admin Center</h1>

      {/* Table container for user data */}
      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.mobile}</td>
                <td>
                  {/* Dropdown to change the role */}
                  <select
                    value={editedRoles[user.id] || user.role_id} // Display current role or edited role
                    onChange={(e) => handleRoleChange(user.id, e.target.value)} // Handle role change
                  >
                    <option value="1">Admin</option>
                    <option value="2">Manager</option>
                    <option value="3">Employee</option>
                  </select>
                </td>
                <td>
                  {/* Delete button for each user */}
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteUser(user.id)} // Open delete confirmation modal
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Apply Changes Button */}
        <button
          className={`apply-all-button ${isChanged ? "active" : ""}`} // Conditionally active
          onClick={applyChanges} // Apply changes on click
          disabled={!isChanged} // Disabled if no changes
        >
          Apply Changes
        </button>
      </div>

      {/* Add User Button */}
      <button
        className="add-user-button"
        onClick={() => setShowSignUpModal(true)} // Open the SignUp modal
      >
        +
      </button>

      {/* SignUp Modal */}
      {showSignUpModal && (
        <div className="modal-overlay">
          <SignUp
            onClose={() => setShowSignUpModal(false)} // Close the modal
            onUserAdded={(newUser) => setUsers([...users, newUser])} // Add the new user to the list
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this user?</p>
            <div className="modal-buttons">
              <button
                className="confirm-button"
                onClick={confirmDeleteUser} // Confirm deletion
              >
                Yes
              </button>
              <button
                className="cancel-button"
                onClick={() => setShowDeleteConfirmation(false)} // Cancel deletion
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCenter;
