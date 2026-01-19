const Bus = require('../models/Bus');

// @desc    Register a new bus (driver only)
// @route   POST /api/bus/register
exports.registerBus = async (req, res) => {
  try {
    const { busId, busName, routeId } = req.body;

    // Check if bus exists
    const busExists = await Bus.findOne({ busId });
    if (busExists) {
      return res.status(400).json({ message: 'Bus already registered' });
    }

    // Create bus with driver's ID
    const bus = await Bus.create({
      busId,
      busName,
      routeId,
      driverId: req.user._id
    });

    res.status(201).json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get buses by route
// @route   GET /api/bus/route/:routeId
exports.getBusesByRoute = async (req, res) => {
  try {
    const { routeId } = req.params;
    const buses = await Bus.find({ routeId }).populate('driverId', 'name');
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all routes (distinct routeIds)
// @route   GET /api/bus/routes
exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await Bus.distinct('routeId');
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get driver's bus
// @route   GET /api/bus/my-bus
exports.getMyBus = async (req, res) => {
  try {
    const bus = await Bus.findOne({ driverId: req.user._id });
    if (!bus) {
      return res.status(404).json({ message: 'No bus assigned to this driver' });
    }
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
