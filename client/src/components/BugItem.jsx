// BugItem.jsx - Individual bug item component

import React from 'react';
import './BugItem.css';

const BugItem = ({ bug, onEdit, onDelete }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'open':
        return 'status-open';
      case 'in-progress':
        return 'status-in-progress';
      case 'resolved':
        return 'status-resolved';
      default:
        return '';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'low':
        return 'priority-low';
      case 'medium':
        return 'priority-medium';
      case 'high':
        return 'priority-high';
      case 'critical':
        return 'priority-critical';
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bug-item">
      <div className="bug-item-header">
        <h3 className="bug-item-title">{bug.title}</h3>
        <div className="bug-item-badges">
          <span className={`badge status-badge ${getStatusClass(bug.status)}`}>
            {bug.status}
          </span>
          <span className={`badge priority-badge ${getPriorityClass(bug.priority)}`}>
            {bug.priority}
          </span>
        </div>
      </div>

      <p className="bug-item-description">{bug.description}</p>

      <div className="bug-item-footer">
        <div className="bug-item-meta">
          <span className="bug-item-reporter">
            <strong>Reporter:</strong> {bug.reporter}
          </span>
          <span className="bug-item-date">
            Created: {formatDate(bug.createdAt)}
          </span>
        </div>

        <div className="bug-item-actions">
          {onEdit && (
            <button
              className="btn btn-edit"
              onClick={() => onEdit(bug)}
              aria-label={`Edit bug: ${bug.title}`}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              className="btn btn-delete"
              onClick={() => onDelete(bug._id)}
              aria-label={`Delete bug: ${bug.title}`}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BugItem;






