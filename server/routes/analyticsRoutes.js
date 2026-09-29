const express = require('express');
const router = express.Router();
const { getOverview, getChartsData } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

router.get('/overview', getOverview);
router.get('/charts', getChartsData);

module.exports = router;
