const SearchHistory = require("../models/SearchHistory");
const SavedSearch = require("../models/SavedSearch");
const googleSearchService = require("../services/googleSearch");
const geminiService = require("../services/geminiService");
const { updateSearchStatistics } = require("./statisticsController");

// @desc    Perform search
// @route   POST /api/search
// @access  Private
exports.search = async (req, res) => {
  try {
    const { query, filters } = req.body;
    const userId = req.user._id;

    // Get user preferences
    const userPreferences = req.user.preferences.searchPreferences;

    // Start timing the search
    const searchStartTime = Date.now();

    // Perform search with Google Custom Search
    const searchResults = await googleSearchService.search(query, {
      num: userPreferences.resultsPerPage,
      safeSearch: filters?.safeSearch ?? userPreferences.safeSearch,
      language: filters?.language ?? userPreferences.language,
      region: filters?.region ?? userPreferences.region,
    });

    // Enhance results with Gemini AI
    const enhancedResults = await geminiService.enhanceSearchResults(
      searchResults
    );

    // Calculate search time
    const searchTime = Date.now() - searchStartTime;

    // Save search history
    const searchHistory = await SearchHistory.create({
      userId,
      query,
      results: enhancedResults,
      filters: {
        safeSearch: filters?.safeSearch ?? userPreferences.safeSearch,
        language: filters?.language ?? userPreferences.language,
        region: filters?.region ?? userPreferences.region,
      },
    });

    // Update search statistics
    await updateSearchStatistics(userId, {
      query,
      searchTime,
      category: enhancedResults[0]?.category,
    });

    res.status(200).json({
      success: true,
      results: enhancedResults,
      metadata: {
        totalResults: enhancedResults.length,
        searchTime,
      },
      searchId: searchHistory._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get search history
// @route   GET /api/search/history
// @access  Private
exports.getSearchHistory = async (req, res) => {
  try {
    const searches = await SearchHistory.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .select("query timestamp resultsCount");

    res.status(200).json({
      success: true,
      searches,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Delete specific search history
// @route   DELETE /api/search/history/:id
// @access  Private
exports.deleteSearchHistory = async (req, res) => {
  try {
    const search = await SearchHistory.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!search) {
      return res.status(404).json({
        success: false,
        error: "Search history not found",
      });
    }

    await SearchHistory.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: "Search history deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Save a search result
// @route   POST /api/search/save
// @access  Private
exports.saveSearch = async (req, res) => {
  try {
    const { searchId, resultId } = req.body;
    const userId = req.user._id;

    // Find the search history entry
    const searchHistory = await SearchHistory.findOne({
      _id: searchId,
      userId: userId,
    });

    if (!searchHistory) {
      return res.status(404).json({
        success: false,
        error: "Search history not found",
      });
    }

    // Get the specific result from the search history
    const result = searchHistory.results[resultId];

    if (!result) {
      return res.status(404).json({
        success: false,
        error: "Search result not found",
      });
    }

    // Check if already saved
    const existingSave = await SavedSearch.findOne({
      userId: userId,
      link: result.link,
    });

    if (existingSave) {
      return res.status(400).json({
        success: false,
        error: "Search result already saved",
      });
    }

    // Create new saved search
    const savedSearch = await SavedSearch.create({
      userId: userId,
      title: result.title,
      link: result.link,
      snippet: result.snippet,
      summary: result.summary,
      category: result.category,
    });

    res.status(201).json({
      success: true,
      message: "Search result saved successfully",
      savedSearch: {
        _id: savedSearch._id,
        title: savedSearch.title,
        link: savedSearch.link,
        savedAt: savedSearch.savedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get saved searches
// @route   GET /api/search/saved
// @access  Private
exports.getSavedSearches = async (req, res) => {
  try {
    const savedSearches = await SavedSearch.find({ userId: req.user._id }).sort(
      { savedAt: -1 }
    );

    res.status(200).json({
      success: true,
      savedSearches,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Delete saved search
// @route   DELETE /api/search/saved/:id
// @access  Private
exports.deleteSavedSearch = async (req, res) => {
  try {
    const savedSearch = await SavedSearch.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!savedSearch) {
      return res.status(404).json({
        success: false,
        error: "Saved search not found",
      });
    }

    await savedSearch.remove();

    res.status(200).json({
      success: true,
      message: "Saved search deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
