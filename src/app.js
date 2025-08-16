const express = require('express');
const adminProducts = require('./routes/adminProducts');

const app = express();
app.use(express.json());
app.use(adminProducts);

module.exports = app;
