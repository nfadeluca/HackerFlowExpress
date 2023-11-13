// Importing required modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

// Routers
const apiRouter = require('./routes/api');
const indexRouter = require('./routes/index');
const listenerRouter = require('./routes/listener');
const producerRouter = require('./routes/producer');
const djRouter = require('./routes/dj');

// Initialize express app
const app = express();

// Connect to MongoDB
const password = process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://hackerflowuser:${password}@cluster0.i0mb71s.mongodb.net/?retryWrites=true&w=majority`, {
})
.then(() => console.log('Connected to MongoDB Atlas...'))
.catch(err => console.error('Could not connect to MongoDB Atlas...', err));

// Middlewares
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// EJS setup as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', apiRouter);
app.use('/', indexRouter);
app.use('/', listenerRouter);
app.use('/', producerRouter);
app.use('/', djRouter);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
