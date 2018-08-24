// Require mongoose dependency
const mongoose = require("mongoose");

// Set up Schema
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    title: { 
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: false
    },
    saved: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        required: true
    }
})

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;