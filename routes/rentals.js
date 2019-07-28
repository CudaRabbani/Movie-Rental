const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const _ = require('lodash');
const {Rental} = require('../model/rental');
const {Movie} = require('../model/movie');
const {Customer} = require('../model/customer');

router.post('/', async (req, res) => {
    var tempRentals = _.pick(req.body, ['customerID','movieID','dateOut', 'rentalFee']);
    const tempCustomer = await Customer.findById(tempRentals.customerID);
    console.log(tempCustomer);
    if (!tempCustomer) {
        return res.status(400).send('Invalid Customer');
    }
    let tempMovie= '';
    try {
        tempMovie = await Movie.findById(tempRentals.movieID);
    }
    catch(err) {
        return res.status(400).send('Invalid Movie');
    }
    console.log(tempMovie);
    const rental = new Rental({
        customer: tempCustomer,
        movie: tempMovie,
        dateOut: tempRentals.dateOut,
        rentalFee: tempRentals.rentalFee
    });
    try {
        await rental.save();
        return res.status(200).send(rental);
    }
    catch(err) {
        return res.status(400).send(err.message);
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