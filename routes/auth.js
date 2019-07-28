const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const {User} = require('../model/user');

router.post('/', async (req, res) => {
    const {error} = validateUser(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    try{
        let user = await User.findOne({email: req.body.email});
        if (!user) {
            return res.status(400).send('Invalid email or password');
        }
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) {
            return res.status(400).send('Invalid email or password!!!');
        }

        const token = jwt.sign({_id: user._id}, 'jwtprivatekey'); //jwtprivatekey should be define in the envioronment variable
        res.send(token);

    }
    catch(err) {
        return res.status(400).send(err.message);
    }
});

function validateUser(user) {
    const schema = {
        password: Joi.string().regex(/^[a-zA-Z0-9]{5,255}$/).required(),
        email: Joi.string().email().required()
    }

    return Joi.validate(user, schema);
}

module.exports = router;