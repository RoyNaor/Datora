const express = require('express');
const router = express.Router();
const { Users, Roles } = require('../models'); // Import models

// Get the role based on the user ID
router.get('/getrole/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        // Find the user by ID and include the associated role information
        const userInfo = await Users.findByPk(userId, {
            include: [
                {
                    model: Roles,
                    as: 'role', 
                    attributes: ['id', 'name'], 
                }
            ],
            attributes: ['id', 'username', 'email', 'mobile'] 
        });

        if (userInfo) {
            res.json(userInfo.role); // Send only the role information
        } else {
            res.status(404).json({ error: "User or role not found" });
        }
    } catch (error) {
        console.error("Error fetching role by user ID:", error);
        res.status(500).json({ error: "An error occurred while fetching the role" });
    }
});

module.exports = router;
