const express = require('express');
const bodyparser = require('body-parser');
const helmet = require('helmet');
const app = express();

const users = require('./routes/usersRouter');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use(helmet());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use("/api/users", users);

module.exports = app;