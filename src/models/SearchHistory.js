const mongoose = require('mongoose');

const SearchHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    query: {
        type: String,
        required: true
    },
    results: [{
        title: String,
        link: String,
        snippet: String,
        summary: String,
        category: String
    }],
    filters: {
        safeSearch: Boolean,
        language: String,
        region: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SearchHistory', SearchHistorySchema); 