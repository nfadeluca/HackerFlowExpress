const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const apiRouter = require('./routes/api');
const indexRouter = require('./routes/index');
const listenerRouter = require('./routes/listener');
const producerRouter = require('./routes/producer');
const djRouter = require('./routes/dj');

const app = express();

const password = process.env.MONGODB_PASSWORD;
mongoose.connect('mongodb+srv://hackerflowuser:${password}@cluster0.i0mb71s.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas...'))
.catch(err => console.error('Could not connect to MongoDB Atlas...', err));

app.use(bodyParser.json());

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', apiRouter);
app.use('/', indexRouter);
app.use('/', listenerRouter);
app.use('/', producerRouter);
app.use('/', djRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
