const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {Movie, movieSchema} = require('../model/movie');
const {Genre} = require('../model/genre');


router.get('/', async (req, res) => {
    console.log ('Get movies request');
    const movies = await Movie
                            .find()
                            .populate({
                                path: 'Movie.genre',
                                model: Genre
                            })
                            .sort('title');

    res.send(movies);
});

router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie .find({_id: req.params.id})
            .populate({
                path: 'Movie.genre',
                model: Genre
            })
            //.populate('genre')This doesn't work
            .select('title genre.name -_id');
        if(!movie) {
            console.log('Wrong Movie ID');
            res.status(400).send('Wrong Movie ID');
        }
        res.send(movie);
    }
    catch(err) {
        console.log('Error: ', err.message);
        res.status(400).send(err.message);
    }
});

router.post('/', async (req, res) => {

    const genre = await Genre.findById(req.body.genre);

    if (!genre) return res.status(400).send('Invalid Genre');

    try {
        const movie = new Movie({
            'title': req.body.title,
            'numberInStock': req.body.numberInStock,
            'dailyRentalRate': req.body.dailyRentalRate,
            'genre': genre
        });
        await movie.save();
        res.send(movie);
    }
    catch (error) {
        console.log ('error: ')
        var error_message = '';
        for (field in error.errors) {
            error_message += error.errors[field].message;
        }
        console.log(error.message);
        res.status(400).send(error.message);
        return;
    }
});

router.put('/:id', async (req, res) => {

    const movie = await Movie.findById(req.params.id);
    if (!movie) {
        return res.status(400).send(`Movie ID: ${req.params.id} is not found`);
    }

    const genre = await Genre.findById(req.body.genre);

    if (!genre) {console.log ('Genre issue')}

    try {
        const movie = new Movie({
            'title': req.body.name,
            'genre': genre
        });
        await movie.save();
        res.send(movie);
    }
    catch (error) {
        console.log ('error: ')
        var error_message = '';
        for (field in error.errors) {
            error_message += error.errors[field].message;
        }
        console.log(error.message);
        res.status(400).send(error.message);
        return;
    }
});

router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie) {
        console.log(`Movie ID: ${req.params.id} is not found`);
        return res.status(400).send(`Movie ID: ${req.params.id} is not found`);
    }
    res.send(movie);
});

module.exports = router;