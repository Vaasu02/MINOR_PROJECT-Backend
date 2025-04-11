const mongoose = require('mongoose');

const SearchStatisticsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalSearches: {
        type: Number,
        default: 0
    },
    mostSearched: [{
        query: String,
        count: Number
    }],
    recentSearches: [{
        query: String,
        timestamp: Date
    }],
    searchCategories: [{
        category: String,
        count: Number
    }],
    averageSearchTime: {
        type: Number,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
SearchStatisticsSchema.index({ userId: 1 });

module.exports = mongoose.model('SearchStatistics', SearchStatisticsSchema); 