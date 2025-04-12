const express = require('express');
const { protect } = require('../middleware/auth');
const {
    search,
    getSearchHistory,
    deleteSearchHistory,
    saveSearch,
    getSavedSearches,
    deleteSavedSearch
} = require('../controllers/searchController');
const { getSearchStatistics } = require('../controllers/statisticsController');
const { enhanceSearchResults, getSearchSuggestions, generateFAQs } = require('../controllers/enhancementController');

const router = express.Router();

// All routes are protected
router.use(protect);

// Search routes
router.post('/', search);
router.get('/history', getSearchHistory);
router.delete('/history/:id', deleteSearchHistory);

// Saved search routes
router.post('/save', saveSearch);
router.get('/saved', getSavedSearches);
router.delete('/saved/:id', deleteSavedSearch);

// Statistics routes
router.get('/stats', getSearchStatistics);

// Enhancement routes
router.post('/enhance', enhanceSearchResults);
router.get('/suggestions', getSearchSuggestions);
router.get('/faqs', generateFAQs);

module.exports = router;