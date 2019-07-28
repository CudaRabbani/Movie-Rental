const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const _ = require('lodash');
const {Customer, validate} = require('../model/customer');

router.get('/', async(req, res) => {
    try {
        const customers = await Customer.find().sort('name');
        return res.status(200).send(customers);
    }
    catch(err) {
        return res.status(400).send(err.message);
    }
});

router.get('/:id', async(req, res) => {

    try {
        const customer = await Customer.findById(req.params.id);
        console.log(customer);
        res.status(200).send(customer);
    }
    catch (err) {
        res.status(400).send(err.message);
    }
});

router.post('/', async(req, res) => {
    const {error} = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let newCustomer = _.pick(req.body, ['name', 'isGold', 'phone']);

    let customer = new Customer (newCustomer);

    try {
        customer = await customer.save();
        return res.send(customer);
    }
    catch(err) {
        return res.status(400).send(err.message);
    }
});

router.put('/:id', async(req, res) => {
    const updated_customer = _.pick(req.body, ['name', 'isGold', 'phone']);
    const {error} = validate(updated_customer);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, updated_customer, {new: true});
    }
    catch(err) {
        return res.status(400).send(err.message);
    }

});

router.delete('/:id', async(req, res) => {
    try {
        const customer = await Customer.findByIdAndRemove(req.params.id);
        res.send(customer);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }

});

module.exports = router;