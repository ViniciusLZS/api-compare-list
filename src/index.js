require('express-async-errors');
require('dotenv').config();
const express = require('express');
const routes = require("./routes");

const app = express();

const cors = require('./app/middlewares/cors');
const errorHandler = require('./app/middlewares/errorHandler');

app.use(express.json());
app.use(cors);
app.use(routes);
app.use(errorHandler);

app.listen(3001, () => console.log('Server start at http://localhost:3001'));
