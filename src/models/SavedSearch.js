const mongoose = require('mongoose');

const SavedSearchSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    snippet: {
        type: String
    },
    summary: {
        type: String
    },
    category: {
        type: String
    },
    savedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SavedSearch', SavedSearchSchema); 