const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    console.log(`Username: ${username} Password: ${password}`);
    res.send('User registered');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});