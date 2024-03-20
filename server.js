// Importing required modules
const express = require('express');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb'); 
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config();

// Page Routers
const indexRouter = require('./routes/index');
const listenerRouter = require('./routes/listener');
const producerRouter = require('./routes/producer');
const djRouter = require('./routes/dj');

// API Routes
const djRoutes = require('./routes/api/djs');
const songRoutes = require('./routes/api/songs');
const timeslotRoutes = require('./routes/api/timeslots');

// Initialize express app, Web Socket server, and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Connect to MongoDB via Mongoose
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.i0mb71s.mongodb.net/?retryWrites=true&w=majority`, {
})
.then(() => console.log('Connected to MongoDB Atlas...'))
.catch(err => console.error('Could not connect to MongoDB Atlas...', err));

// EJS setup as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/', listenerRouter);
app.use('/', producerRouter);
app.use('/', djRouter);

app.use('/api', djRoutes);
app.use('/api', songRoutes);
app.use('/api', timeslotRoutes);

// Serve the Socket.io client library
app.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile(path.join(__dirname, '/node_modules/socket.io-client/dist/socket.io.js'));
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('A user connected');
});

// Connect to MongoDB Client
const mongoClient = new MongoClient(`mongodb+srv://${username}:${password}@cluster0.i0mb71s.mongodb.net/?retryWrites=true&w=majority`);
async function run() {
    try {
        await mongoClient.connect();
        const db = mongoClient.db();
        const changeStream = db.watch(); // Change Stream that watches the whole database

        // Listen for changes in the database
        changeStream.on('change', (change) => {
            console.log('Change detected:', change);

            // Emit an update event to the client when a change occurs
            io.emit('databaseUpdate');
        });

    } catch {
        await mongoClient.close();
    }
}

run().catch(console.dir);

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
