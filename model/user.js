const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 20,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        unique: true
    }
});

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = {
        userName: Joi.string().min(5).max(20).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{5,255}$/).required(),
        email: Joi.string().email().required()
    }

    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;