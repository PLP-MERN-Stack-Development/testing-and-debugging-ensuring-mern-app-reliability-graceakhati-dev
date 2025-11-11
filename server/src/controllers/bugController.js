// bugController.js - Bug controller functions

const Bug = require('../models/Bug');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all bugs
// @route   GET /api/bugs
// @access  Public
const getBugs = async (req, res, next) => {
  try {
    const { status, priority, sort } = req.query;
    
    // Build query object
    const query = {};
    if (status) {
      query.status = status;
    }
    if (priority) {
      query.priority = priority;
    }

    // Build sort object
    let sortBy = '-createdAt'; // Default: newest first
    if (sort === 'oldest') {
      sortBy = 'createdAt';
    } else if (sort === 'priority') {
      sortBy = '-priority';
    }

    const bugs = await Bug.find(query).sort(sortBy);
    
    res.status(200).json({
      success: true,
      count: bugs.length,
      data: bugs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single bug by ID
// @route   GET /api/bugs/:id
// @access  Public
const getBug = async (req, res, next) => {
  try {
    // DEBUG: Log incoming request details
    console.log('=== DEBUG: getBug Controller ===');
    console.log('req.params:', req.params);
    console.log('req.params.id:', req.params.id);
    console.log('req.params.id type:', typeof req.params.id);
    console.log('req.method:', req.method);
    console.log('req.path:', req.path);
    console.log('req.url:', req.url);
    
    const bug = await Bug.findById(req.params.id);
    
    console.log('Bug found:', bug ? 'YES' : 'NO');
    if (bug) {
      console.log('Bug _id:', bug._id.toString());
    } else {
      console.log('No bug found with ID:', req.params.id);
    }
    console.log('================================');

    if (!bug) {
      return res.status(404).json({
        success: false,
        error: 'Bug not found',
      });
    }

    res.status(200).json({
      success: true,
      data: bug,
    });
  } catch (error) {
    console.log('=== DEBUG: getBug Error ===');
    console.log('Error name:', error.name);
    console.log('Error message:', error.message);
    console.log('Error stack:', error.stack);
    console.log('===========================');
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'Bug not found',
      });
    }
    next(error);
  }
};

// @desc    Create new bug
// @route   POST /api/bugs
// @access  Public
const createBug = async (req, res, next) => {
  try {
    const bug = await Bug.create(req.body);
    
    // FIXED: Removed memory leak - if history is needed, use database or proper cache with TTL
    // Removed global bugHistory array that was causing memory leak

    res.status(201).json({
      success: true,
      data: bug,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', '),
      });
    }
    next(error);
  }
};

// @desc    Update bug
// @route   PUT /api/bugs/:id
// @access  Public
const updateBug = async (req, res, next) => {
  try {
    // DEBUG: Log incoming request details
    console.log('=== DEBUG: updateBug Controller ===');
    console.log('req.params:', req.params);
    console.log('req.params.id:', req.params.id);
    console.log('req.params.id type:', typeof req.params.id);
    console.log('req.method:', req.method);
    console.log('req.path:', req.path);
    console.log('req.url:', req.url);
    console.log('req.body:', req.body);
    
    // FIXED: Added await to properly wait for database operation
    const bug = await Bug.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    
    console.log('Bug found:', bug ? 'YES' : 'NO');
    if (bug) {
      console.log('Bug _id:', bug._id.toString());
    } else {
      console.log('No bug found with ID:', req.params.id);
    }
    console.log('===================================');

    if (!bug) {
      return res.status(404).json({
        success: false,
        error: 'Bug not found',
      });
    }

    res.status(200).json({
      success: true,
      data: bug,
    });
  } catch (error) {
    console.log('=== DEBUG: updateBug Error ===');
    console.log('Error name:', error.name);
    console.log('Error message:', error.message);
    console.log('Error stack:', error.stack);
    console.log('=============================');
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', '),
      });
    }
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'Bug not found',
      });
    }
    next(error);
  }
};

// @desc    Delete bug
// @route   DELETE /api/bugs/:id
// @access  Public
const deleteBug = async (req, res, next) => {
  try {
    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({
        success: false,
        error: 'Bug not found',
      });
    }

    await bug.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'Bug not found',
      });
    }
    next(error);
  }
};

module.exports = {
  getBugs,
  getBug,
  createBug,
  updateBug,
  deleteBug,
};

