const express = require("express");
const router = express.Router();

// Dummy user database (for testing)
const users = [];

// GET request (fetch users)
router.get("/", (req, res) => {
    res.json({ message: "Users page", users });
});

// POST request (add user)
router.post("/", (req, res) => {
    const { name, email } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
    }

    const newUser = { id: users.length + 1, name, email };
    users.push(newUser);

    res.status(201).json({ message: "User created", user: newUser });
});

module.exports = router;
