const express = require('express');
const app = express();
const mongoose = require('mongoose');
const movies = require('./routes/movies');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const rentals = require('./routes/rentals');
const users = require('./routes/users')


mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connection Succesful'))
    .catch((err) => console.log('Couldn\'t connect to MongoDB', err));

app.use(express.json());
app.use('/api/movies', movies);
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/rentals', rentals);
app.use('/api/users/', users);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log (`Listennning to Port: ${port}`));

