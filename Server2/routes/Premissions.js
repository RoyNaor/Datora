const express = require("express");
const router = express.Router();
const { Users, Roles, Permissions } = require("../models");

router.get("/permissions", async (req, res) => {
  try {
    const userId = req.user.id; // Assume the user ID is in the request (e.g., via JWT middleware)

    // Fetch user with role and permissions
    const user = await Users.findByPk(userId, {
      include: [
        {
          model: Roles,
          as: "role",
          include: [
            {
              model: Permissions,
              as: "permissions",
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Extract permissions
    const permissions = user.role.permissions.map((perm) => perm.name);

    res.json({ role: user.role.name, permissions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
