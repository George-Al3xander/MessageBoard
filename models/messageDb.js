const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    messageText : {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
    
}, {timestamps:true});


const Message = mongoose.model("Message", messageSchema);
module.exports = Message