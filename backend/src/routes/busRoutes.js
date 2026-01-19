const express = require('express');
const router = express.Router();
const { registerBus, getBusesByRoute, getAllRoutes, getMyBus } = require('../controllers/busController');
const { protect, requireDriver } = require('../middleware/auth');

// POST /api/bus/register - Driver only
router.post('/register', protect, requireDriver, registerBus);

// GET /api/bus/routes - Get all available routes
router.get('/routes', getAllRoutes);

// GET /api/bus/route/:routeId - Get buses by route
router.get('/route/:routeId', getBusesByRoute);

// GET /api/bus/my-bus - Driver only (get their assigned bus)
router.get('/my-bus', protect, requireDriver, getMyBus);

module.exports = router;
