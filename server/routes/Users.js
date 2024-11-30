const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Users } = require('../models'); // Import models
const multer = require('multer');


const { sign } = require('jsonwebtoken')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create new user with role
router.post('/', async (req, res) => {
  const { username, password, email, mobile, role_id } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
        username,
        password: hash,
        email,
        mobile,
        profile_picture: null,
        role_id: role_id, // Associate role with user
      });
      res.json("SUCCESS")
  })

});

// Login user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await Users.findOne({ where: { username: username } });

    if (!user) res.json({ error: "User Doesn't Exist" });

    bcrypt.compare(password, user.password).then(async (match) => {
        if (!match) return res.json({ error: "Wrong Username And Password Combination" });

        const accessToken = sign({ username: user.username, id: user.id }, "importantsecret");
        
        res.json({ token: accessToken, username: username, id: user.id });
    })
})

// Get basic user information by ID (excluding password)
router.get("/basicinfo/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const basicInfo = await Users.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (basicInfo) {
      // Convert profile picture to base64 if it exists
      if (basicInfo.profile_picture) {
        basicInfo.profile_picture = basicInfo.profile_picture.toString('base64');
      }
      res.json(basicInfo);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching basic info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user ID by username
router.get("/getUserId/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const user = await Users.findOne({
      where: { username: username },
      attributes: ["id"], // Only select the 'id' field
    });

    if (user) {
      res.json({ id: user.id });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Upload profile picture for a user
router.post('/upload/:id', upload.single('profile_picture'), async (req, res) => {
  try {
    const userId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const profilePicture = req.file.buffer; // Get the image as a buffer

    // Update the user record with the image
    await Users.update(
      { profile_picture: profilePicture },
      { where: { id: userId } }
    );

    res.status(200).json({ message: 'Profile picture uploaded successfully.' });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ error: "Failed to upload profile picture" });
  }
});

  // get all users
router.get('/users', async (req, res) => {
  try {
    const users = await Users.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Delete user by ID
router.delete('/delete/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await Users.destroy({
      where: { id: userId },
    });

    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});






module.exports = router;
