const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { username, email, gender } = req.body;
        
        // Check if email or username is already taken
        const existingUser = await User.findOne({
            $or: [
                { email, _id: { $ne: req.user._id } },
                { username, _id: { $ne: req.user._id } }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'Username or email already taken'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { username, email, gender },
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get user preferences
// @route   GET /api/user/preferences
// @access  Private
exports.getPreferences = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('preferences');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            preferences: user.preferences.searchPreferences
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Update user preferences
// @route   PUT /api/user/preferences
// @access  Private
exports.updatePreferences = async (req, res) => {
    try {
        const { preferences } = req.body;

        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Update only the search preferences
        user.preferences.searchPreferences = {
            ...user.preferences.searchPreferences,
            ...preferences
        };

        await user.save();

        res.status(200).json({
            success: true,
            preferences: user.preferences.searchPreferences
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}; 