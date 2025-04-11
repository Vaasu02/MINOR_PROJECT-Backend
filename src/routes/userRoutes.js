const express = require("express");
const { protect } = require("../middleware/auth");
const {
  getProfile,
  updateProfile,
  getPreferences,
  updatePreferences,
} = require("../controllers/userController");

const router = express.Router();

// All routes are protected
router.use(protect);

// Profile routes
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

// Preferences routes
router.get("/preferences", getPreferences);
router.put("/preferences", updatePreferences);

module.exports = router;
