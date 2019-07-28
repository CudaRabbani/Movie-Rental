const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

const {User, validate} = require('../model/user');

router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('userName email');
        return res.send(users);
    }
    catch(err) {
        return res.status(400).send(err.message);
    }
});
router.get('/:id', async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        return res.send(user);
    }
    catch(err) {
        return res.status(400).send(err.message);
    }
});
router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    try{
        let user = new User (_.pick(req.body, ['userName', 'password', 'email']));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        const token = jwt.sign({_id: user._id}, config.get('jwtPrivateKey'));
        return res.header('x-auth-token', token).send(user);
    }
    catch(err) {
        return res.status(400).send(err.message);
    }
});
router.put('/:id', async (req, res) => {
    const {error} = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    try{
        const user = await User.findByIdAndUpdate(req.params.id, _.pick(req.body), {new: true});
        return res.send(user);
    }
    catch(err) {
        return res.status(400).send(err.message);
    }
});
router.delete('/:id', async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        return res.send(user);
    }
    catch(err) {
        return res.status(400).send(err.message);
    }
});

module.exports = router;