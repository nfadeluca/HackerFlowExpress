// Importing required modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const http = require('http');
const socketIO = require('socket.io');
const { MongoClient } = require('mongodb'); 

// Routers
const indexRouter = require('./routes/index');
const listenerRouter = require('./routes/listener');
const producerRouter = require('./routes/producer');
const djRouter = require('./routes/dj');

const djRoutes = require('./routes/api/djs');
const songRoutes = require('./routes/api/songs');
const timeslotRoutes = require('./routes/api/timeslots');

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

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

// Serve the Socket.io client library
app.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile(path.join(__dirname, '/node_modules/socket.io-client/dist/socket.io.js'));
});

// Routes
app.use('/', indexRouter);
app.use('/', listenerRouter);
app.use('/', producerRouter);
app.use('/', djRouter);

app.use('/api', djRoutes);
app.use('/api', songRoutes);
app.use('/api', timeslotRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('A user connected');
    // You can emit events or handle other socket-related functionality here
});

const mongoClient = new MongoClient(`mongodb+srv://hackerflowuser:${password}@cluster0.i0mb71s.mongodb.net/?retryWrites=true&w=majority`);

async function run() {
    try {
        await mongoClient.connect();
        const db = mongoClient.db();
        const changeStream = db.watch();

        // Listen for changes in the database
        changeStream.on('change', (change) => {
            console.log('Change detected:', change);

            // Emit an update event when a change occurs
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
