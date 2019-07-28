const mongoose = require('mongoose');
const {Genre, genreSchema} = require('./genre');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        trim: true
    },
    genre: {
        type: genreSchema,
        ref: 'Genre',
        required: true
    },
    numberInStock: {
        type: Number,
        min: 0,
        max: 255,
        required: true
    },
    dailyRentalRate: {
        type: Number,
        min: 0,
        max: 255
    }
});

const Movie = mongoose.model('Movie', movieSchema);

exports.Movie = Movie;
exports.movieSchema = movieSchema;

//console.log (genreSchema);