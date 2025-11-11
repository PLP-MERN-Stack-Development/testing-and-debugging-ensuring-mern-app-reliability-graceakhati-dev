// bugRoutes.js - Bug routes

const express = require('express');
const router = express.Router();
const {
  getBugs,
  getBug,
  createBug,
  updateBug,
  deleteBug,
} = require('../controllers/bugController');

// DEBUG: Log route registration
console.log('=== DEBUG: Bug Routes Registration ===');
console.log('Registering GET /api/bugs');
console.log('Registering GET /api/bugs/:id');
console.log('Registering POST /api/bugs');
console.log('Registering PUT /api/bugs/:id');
console.log('Registering DELETE /api/bugs/:id');
console.log('======================================');

// Route: GET /api/bugs
router.get('/', getBugs);

// Route: GET /api/bugs/:id
router.get('/:id', getBug);

// Route: POST /api/bugs
router.post('/', createBug);

// Route: PUT /api/bugs/:id
router.put('/:id', updateBug);

// Route: DELETE /api/bugs/:id
router.delete('/:id', deleteBug);

module.exports = router;

