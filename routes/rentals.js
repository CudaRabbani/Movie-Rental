const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const _ = require('lodash');
const Fawn = require('fawn');

const {Rental} = require('../model/rental');
const {Movie} = require('../model/movie');
const {Customer} = require('../model/customer');

Fawn.init(mongoose);

router.post('/', async (req, res) => {
    var tempRentals = _.pick(req.body, ['customerID','movieID','dateOut', 'rentalFee']);
    const tempCustomer = await Customer.findById(tempRentals.customerID);
    console.log(tempCustomer);
    if (!tempCustomer) {
        return res.status(400).send('Invalid Customer');
    }
    let tempMovie= '';
    try {
        tempMovie = await Movie.findById(tempRentals.movieID).select('name genre.name');
    }
    catch(err) {
        return res.status(400).send('Invalid Movie');
    }

    const rental = new Rental({
        customer: tempCustomer,
        movie: tempMovie,
        dateOut: tempRentals.dateOut,
        rentalFee: tempRentals.rentalFee
    });
    try {
       /* tempMovie.numberInStock--;
        await tempMovie.save();
        await rental.save();
        return res.status(200).send(rental);*/

        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', {_id: tempMovie._id}, {
                $inc: {numberInStock: -1}
            })
            .run();
        return res.status(200).send(rental);
    }
    catch(err) {
        return res.status(500).send(err.message);
    }

});
router.put('/:id', async (req, res) => {
    let tempRental = _.pick(req.body, ['customerID', 'movieID', 'dateOut', 'returnDate', 'rentalFee']);
    try {
        const rental = await Rental.findByIdAndUpdate(req.params.id, tempRental);
        return res.send(rental);
    }
    catch(err) {
        return res.status(400).send(err.message);
    }
});
router.get('/', async (req, res) => {
    try {
        const rentals = await Rental.find().sort({dateOut: -1});
        return res.send(rentals);
    }
    catch(err) {
        return res.status(400).send(err.message);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const rentals = await Rental.findById(req.params.id);
        return res.send(rentals);
    }
    catch(err) {
        return res.status(400).send(err.message);
    }
});

module.exports = router;