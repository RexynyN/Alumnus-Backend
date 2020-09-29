require("dotenv").config();

const express = require('express');
const cors = require('cors');
const favicon = require('serve-favicon');
const path = require('path')

const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(favicon(path.join(__dirname, 'favicon.ico')));

app.listen(process.env.PORT);
 