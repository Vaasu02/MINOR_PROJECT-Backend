const SearchStatistics = require('../models/SearchStatistics');
const SearchHistory = require('../models/SearchHistory');

// @desc    Get user search statistics
// @route   GET /api/search/stats
// @access  Private
exports.getSearchStatistics = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get or create statistics for user
        let stats = await SearchStatistics.findOne({ userId });
        
        if (!stats) {
            stats = await SearchStatistics.create({ userId });
        }

        // Get recent searches from search history
        const recentSearches = await SearchHistory.find({ userId })
            .sort({ timestamp: -1 })
            .limit(10)
            .select('query timestamp');

        // Update statistics
        stats.recentSearches = recentSearches.map(search => ({
            query: search.query,
            timestamp: search.timestamp
        }));

        // Calculate most searched queries
        const searchCounts = await SearchHistory.aggregate([
            { $match: { userId } },
            { $group: { _id: '$query', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        stats.mostSearched = searchCounts.map(item => ({
            query: item._id,
            count: item.count
        }));

        // Calculate total searches
        stats.totalSearches = await SearchHistory.countDocuments({ userId });

        // Save updated statistics
        await stats.save();

        res.status(200).json({
            success: true,
            statistics: {
                totalSearches: stats.totalSearches,
                mostSearched: stats.mostSearched,
                recentSearches: stats.recentSearches,
                searchCategories: stats.searchCategories,
                averageSearchTime: stats.averageSearchTime
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Update search statistics after a search
// @route   POST /api/search/stats/update
// @access  Private
exports.updateSearchStatistics = async (userId, searchData) => {
    try {
        let stats = await SearchStatistics.findOne({ userId });
        
        if (!stats) {
            stats = await SearchStatistics.create({ userId });
        }

        // Update total searches
        stats.totalSearches += 1;

        // Update most searched queries
        const queryIndex = stats.mostSearched.findIndex(item => item.query === searchData.query);
        if (queryIndex !== -1) {
            stats.mostSearched[queryIndex].count += 1;
        } else {
            stats.mostSearched.push({ query: searchData.query, count: 1 });
        }
        stats.mostSearched.sort((a, b) => b.count - a.count);
        if (stats.mostSearched.length > 5) {
            stats.mostSearched = stats.mostSearched.slice(0, 5);
        }

        // Update search categories
        if (searchData.category) {
            const categoryIndex = stats.searchCategories.findIndex(
                item => item.category === searchData.category
            );
            if (categoryIndex !== -1) {
                stats.searchCategories[categoryIndex].count += 1;
            } else {
                stats.searchCategories.push({ category: searchData.category, count: 1 });
            }
        }

        // Update average search time
        if (searchData.searchTime) {
            const totalTime = stats.averageSearchTime * (stats.totalSearches - 1);
            stats.averageSearchTime = (totalTime + searchData.searchTime) / stats.totalSearches;
        }

        stats.lastUpdated = new Date();
        await stats.save();
    } catch (error) {
        console.error('Error updating search statistics:', error);
    }
}; 