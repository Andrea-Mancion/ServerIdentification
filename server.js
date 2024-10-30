/**
 * @file server.js
 * @brief Node.js server with user registration, login, and password reset functionality.
*/

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

/**
 * @brief Reads user data from the JSON file.
 * @return Object containing user data. If file doesn't exist, returns an object with an empty users array.
*/
function readDataFromFile() {
    if (fs.existsSync(JSON_FILE_PATH)) {
        const data = fs.readFileSync(JSON_FILE_PATH, 'utf8');
        return JSON.parse(data);
    } else {
        return { users: [] };
    }
}

/**
 * @brief Writes data to the JSON file.
 * @param data The user data to be written to the JSON file.
*/
function writeDataToFile(data) {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(JSON_FILE_PATH, jsonData);
}


/**
 * @brief Registers a new user by storing a hashed password and user details.
 * 
 * @param req Request object containing `username`, `password`, and `name` in the body.
 * @param res Response object indicating the success or failure of the registration.
 * 
 * @note If the user already exists, it returns a 401 status else it returns a 200 status.
*/
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

/**
 * @brief Logs in an existing user by comparing username, hashed password, and name.
 * 
 * @param req Request object containing `username`, `password`, and `name` in the body.
 * @param res Response object indicating the success or failure of the login.
 * 
 * @note If credentials are incorrect, it returns a 401 status else it returns a 200 status.
*/
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

/**
 * @brief Resets the password for an existing user by updating the hashed password.
 * 
 * @param req Request object containing `username`, `password`, and `name` in the body.
 * @param res Response object indicating the success or failure of the password reset.
 * 
 * @note If the user does not exist, it returns a 401 status else if the password is reset successfuly it returns a 200 status.
*/
app.post('/forgetPassword', (req, res) => {
    const { username, password, name } = req.body;

    let idData = readDataFromFile();

    const user = idData.users.find(user => user.username === username && user.name === name);

    if (user) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        user.password = hashedPassword;
        writeDataToFile(idData);
        
        console.log('Password reset successful!');
        res.sendStatus(200);
    } else {
        console.log('User does not exist');
        res.status(401).send('User does not exist');
    }
});

/**
 * @brief Starts the server on a specified port.
 * 
 * @note Logs a message indicating the port on which the server is running.
*/
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

process.on('SIGINT', () => {
    console.log('Closing PostgreSQL connection pool');
    pool.end();
    process.exit();
});