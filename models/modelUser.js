const mongoose = require("mongoose");


const Schema = mongoose.Schema;


const schemaUser = new Schema({
    name: {
        first: {
            type: String,
            required: true
        },
        last: {
            type: String,
            required: true
        }
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    membership_status: {
        type: Boolean,
        required: true
    },
    admin_status: {
        type: Boolean,
        required: true
    }
})

const User = mongoose.model("User", schemaUser);
module.exports = User

