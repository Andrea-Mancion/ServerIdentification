const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const JSON_FILE_PATH = path.join(__dirname, 'avagen.json');

function readDataFromFile() {
    if (fs.existsSync(JSON_FILE_PATH)) {
        const data = fs.readFileSync(JSON_FILE_PATH, 'utf8');
        return JSON.parse(data);
    } else {
        return { users: [] };
    }
}

function writeDataToFile(data) {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(JSON_FILE_PATH, jsonData);
}

app.post('/register', (req, res) => {
    const { username, password, name } = req.body;

    let idData = readDataFromFile();

    const userExists = idData.users.find(user => user.username === username && user.name === name);

    if (userExists) {
        console.log('User already exists');
        res.status(401).send('User already exists');
    } else {
        const hashedPassword = bcrypt.hashSync(password, 10);
        idData.users.push({ username, password: hashedPassword, name });

        writeDataToFile(idData);

        console.log('User registered');
        res.sendStatus(200);
    }
});

app.post('/login', (req, res) => {
    const { username, password, name } = req.body;

    let idData = readDataFromFile();

    let userExists = false;
    for (const user of idData.users) {
        const passwordMatch = bcrypt.compareSync(password, user.password)

        if (user.username === username && passwordMatch && user.name === name) {
            userExists = true;
            break;
        } else {
            userExists = false;
        }
    }

    if (userExists) {
        console.log('Login successful!');
        res.sendStatus(200);
    } else {
        console.log('Login failed: Invalid username or password');
        res.status(401).send('Invalid username or password');
    }

});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

process.on('SIGINT', () => {
    console.log('Closing PostgreSQL connection pool');
    pool.end();
    process.exit();
});