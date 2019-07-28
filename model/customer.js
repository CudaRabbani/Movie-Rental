const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    isGold : {
        type: Boolean,
        required: true,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 20
    }
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().min(10).max(20)
    };

    return Joi.validate()
}

exports.Customer = Customer;
exports.validate = validateCustomer;
exports.customerSchema = customerSchema;