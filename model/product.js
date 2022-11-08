const mongoose = require('mongoose');

const product = new mongoose.Schema({
    name : {
        type    : String,
        required: true
    },
    qty: {
        type    : Number,
        default : 0
    },
    description : {
        type    : String,
        default : null
    },
    isDeleted : {
        type    : Number,
        default : 0
    },
});

exports.product = mongoose.model("product", product);
