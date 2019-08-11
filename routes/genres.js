const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const asyncMiddleware = require('../middleware/async');

const auth = require('../middleware/auth');
const {Genre, genreSchema} = require('../model/genre');



//as we are using error middleware
router.get('/', asyncMiddleware(async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);

    /*    try {
            const genres = await Genre.find().select('name');
            res.send(genres);
        }
        catch (err) {
            next(err);
        }*/

}));

router.get('/:id', async (req, res) => {
    const genres = await Genre.findById(req.params.id);
    if (!genres) {
        console.log (`${req.params.id} not found`);
        return res.status(400).send(`${req.params.id} not found`);
    }
    res.send(genres);
});

router.post('/', async (req, res) => {
    const genre = new Genre ({
        name: req.body.name
    });

    try {
        await genre.save();
        res.send(genre);
    }
    catch (err) {
        console.log (err.message);
        res.status(400).send(err.message);
    }
});

router.put('/:id', async (req, res) => {
    var genre= '';
    try {
        genre = await Genre.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name
            },
            {
                new: true
            }
        );

        if (!genre) {
            console.log('Given Genre ID is not valid');
            return res.status(400).send('Given Genre ID is not valid');
        }
    }
    catch(err) {
        console.log(err.message);
        return res.status(400).send(err.message);
    }

    res.send(genre);
});
router.delete('/:id', async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) {
        console.log(`Genre ID: ${req.params.id} is not found`);
        return res.status(400).send(`Genre ID: ${req.params.id} is not found`);
    }
    res.send(genre);
});

module.exports = router;