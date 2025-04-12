const geminiService = require('../services/geminiService');

// @desc    Enhance search results with Gemini AI
// @route   POST /api/search/enhance
// @access  Private
exports.enhanceSearchResults = async (req, res) => {
    try {
        const { results } = req.body;

        if (!results || !Array.isArray(results) || results.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid search results provided'
            });
        }

        // Enhance results with Gemini AI
        const enhancedResults = await geminiService.enhanceSearchResults(results);

        res.status(200).json({
            success: true,
            enhancedResults: enhancedResults.map(result => ({
                summary: result.summary,
                category: result.category,
                relevance: result.relevance
            }))
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get search suggestions based on query
// @route   GET /api/search/suggestions
// @access  Private
exports.getSearchSuggestions = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                error: 'Search query is required'
            });
        }

        // Get suggestions from Gemini AI
        const suggestions = await geminiService.getSearchSuggestions(query);

        res.status(200).json({
            success: true,
            suggestions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Generate FAQs related to search query
// @route   GET /api/search/faqs
// @access  Private
exports.generateFAQs = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                error: 'Search query is required'
            });
        }

        // Get FAQs from Gemini AI
        const faqs = await geminiService.generateFAQs(query);

        res.status(200).json({
            success: true,
            faqs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}; 