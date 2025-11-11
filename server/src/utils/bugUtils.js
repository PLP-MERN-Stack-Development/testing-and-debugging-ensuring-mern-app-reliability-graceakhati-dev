// bugUtils.js - Bug-related utility functions

/**
 * Check if a status transition is valid
 * @param {string} currentStatus - Current status
 * @param {string} newStatus - New status to transition to
 * @returns {boolean} True if transition is valid
 */
const isValidStatusTransition = (currentStatus, newStatus) => {
  const validStatuses = ['open', 'in-progress', 'resolved'];
  
  if (!validStatuses.includes(currentStatus) || !validStatuses.includes(newStatus)) {
    return false;
  }

  // Define valid transitions
  const validTransitions = {
    'open': ['in-progress', 'resolved'],
    'in-progress': ['open', 'resolved'],
    'resolved': ['open', 'in-progress'],
  };

  return validTransitions[currentStatus]?.includes(newStatus) || false;
};

/**
 * Get the next valid statuses for a given current status
 * @param {string} currentStatus - Current status
 * @returns {string[]} Array of valid next statuses
 */
const getValidNextStatuses = (currentStatus) => {
  const validTransitions = {
    'open': ['in-progress', 'resolved'],
    'in-progress': ['open', 'resolved'],
    'resolved': ['open', 'in-progress'],
  };

  return validTransitions[currentStatus] || [];
};

/**
 * Check if a priority value is valid
 * @param {string} priority - Priority value to check
 * @returns {boolean} True if priority is valid
 */
const isValidPriority = (priority) => {
  const validPriorities = ['low', 'medium', 'high', 'critical'];
  return validPriorities.includes(priority);
};

/**
 * Get priority weight for sorting (higher number = higher priority)
 * @param {string} priority - Priority value
 * @returns {number} Priority weight
 */
const getPriorityWeight = (priority) => {
  const weights = {
    'low': 1,
    'medium': 2,
    'high': 3,
    'critical': 4,
  };
  return weights[priority] || 0;
};

/**
 * Validate bug data structure
 * @param {Object} bugData - Bug data to validate
 * @returns {Object} { valid: boolean, errors: string[] }
 */
const validateBugData = (bugData) => {
  const errors = [];

  if (!bugData.title || typeof bugData.title !== 'string' || bugData.title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string');
  } else if (bugData.title.length > 200) {
    errors.push('Title cannot exceed 200 characters');
  }

  if (!bugData.description || typeof bugData.description !== 'string' || bugData.description.trim().length === 0) {
    errors.push('Description is required and must be a non-empty string');
  }

  if (!bugData.reporter || typeof bugData.reporter !== 'string' || bugData.reporter.trim().length === 0) {
    errors.push('Reporter is required and must be a non-empty string');
  }

  if (bugData.status && !['open', 'in-progress', 'resolved'].includes(bugData.status)) {
    errors.push('Status must be one of: open, in-progress, resolved');
  }

  if (bugData.priority && !['low', 'medium', 'high', 'critical'].includes(bugData.priority)) {
    errors.push('Priority must be one of: low, medium, high, critical');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

module.exports = {
  isValidStatusTransition,
  getValidNextStatuses,
  isValidPriority,
  getPriorityWeight,
  validateBugData,
};






