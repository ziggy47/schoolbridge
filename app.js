const express = require('express');
const registerAllUsers = require('./mvvm/auth/auth_url');


const app = express();

app.use(express.json());

const endpoint = '/api/v1/';
app.use(`${endpoint}`,registerAllUsers)

module.exports = app;