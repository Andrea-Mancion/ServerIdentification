## Server identification

## Introduction

This project is a made home BDD where the user can register and login himself and even change his password, by creating a local file in your computer....

## How to start it

First of all, if this project is running locally on your computer then you have to install depedencies by doing
```sh
npm install
```

After that you can start the project
```sh
node server.js
```

## How to use it on a front-end code

To use this server on your front-end code, if it is on your computer (locally) then you can access it by this line: 'http://localhost:8082/keyword'

Keyword can be either 'register', 'login' or 'forgetPassword'

For all that we need 3 mandatory parameters (username, password, name):
- username: the input the user enter in the textBox
- password: the input the user enter in the textBox
- name: name of the project you have to put it in hard mode (WARNING!! THE NAME IS ALWAYS THE SAME, IF YOU CALL THE SERVER BE SURE THAT THE NAME IS THE SAME)

Since i don't use real BDD for now, the name is here for the same user to create an account with the same userName and password on different webSite/Application
