const express = require('express');
const app = express();
const mongoose = require('mongoose');
const error = require('./middleware/error');
//require('express-async-errors');
const movies = require('./routes/movies');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const rentals = require('./routes/rentals');

/*if (!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}*/

mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connection Succesful'))
    .catch((err) => console.log('Couldn\'t connect to MongoDB', err));

app.use(express.json());
app.use('/api/movies', movies);
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(error);


const port = process.env.PORT || 4000;
app.listen(port, () => console.log (`Listennning to Port: ${port}`));

