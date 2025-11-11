// Bug.js - Bug model schema

const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'in-progress', 'resolved'],
        message: 'Status must be one of: open, in-progress, resolved',
      },
      default: 'open',
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'critical'],
        message: 'Priority must be one of: low, medium, high, critical',
      },
      default: 'medium',
    },
    reporter: {
      type: String,
      required: [true, 'Reporter is required'],
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Index for better query performance
bugSchema.index({ status: 1, priority: 1 });
bugSchema.index({ createdAt: -1 });

const Bug = mongoose.model('Bug', bugSchema);

module.exports = Bug;






