const mongoose = require('mongoose');
const joi = require('joi');
const {Customer, customerValidate, customerSchema} = require ('../model/customer');
const {Movie, movieSchema} = require('../model/movie');

const rentalSchema = new mongoose.Schema({
    customer: {
        type: customerSchema,
        required: true
    },
    movie: {
        type: movieSchema,
        required: true
    },
    dateOut: {
        type: Date,
        default: Date.now(),
        required: true
    },
    returnDate: {
        type: Date
    },
    rentalFee: {
        type: Number,
        required: true,
        min: 10
    }
});

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental) {
    const schema = {
        customerID: joi.string().required(),
        movieID: joi.string().required()
    };

    return joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validate = validateRental;
