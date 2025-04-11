const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false
    },
    gender: {
        type: String,
        required: [true, 'Please provide your gender'],
        enum: ['male', 'female', 'other']
    },
    avatar: {
        type: String
    },
    preferences: {
        searchPreferences: {
            defaultEngine: {
                type: String,
                default: 'google'
            },
            resultsPerPage: {
                type: Number,
                default: 10
            },
            safeSearch: {
                type: Boolean,
                default: true
            },
            language: {
                type: String,
                default: 'en'
            },
            region: {
                type: String,
                default: 'US'
            }
        },
        aiPreferences: {
            summarization: {
                type: Boolean,
                default: true
            },
            categorization: {
                type: Boolean,
                default: true
            }
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Generate avatar URL before saving
UserSchema.pre('save', function(next) {
    if (this.isNew || this.isModified('gender') || this.isModified('username')) {
        const genderPath = this.gender === 'female' ? 'girl' : 'boy';
        this.avatar = `https://avatar.iran.liara.run/public/${genderPath}?username=${encodeURIComponent(this.username)}`;
    }
    next();
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema); 