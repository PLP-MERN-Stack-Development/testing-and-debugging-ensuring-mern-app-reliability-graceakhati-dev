// BugList.jsx - List view component for displaying all bugs

import React, { useState } from 'react';
import { useBugs } from '../context/BugContext';
import BugItem from './BugItem';
import './BugList.css';

const BugList = ({ onEditBug }) => {
  const { bugs, loading, error, deleteBug, updateFilters, filters } = useBugs();
  const [showFilters, setShowFilters] = useState(false);
  
  // FIXED: Removed infinite re-render loop
  // The useEffect that was calling updateFilters with filters in dependency array caused infinite loop
  // Filters should only change when user interacts with filter UI, not automatically

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bug?')) {
      try {
        await deleteBug(id);
      } catch (err) {
        alert('Failed to delete bug: ' + err.message);
      }
    }
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value || undefined,
    };
    // Remove undefined values
    Object.keys(newFilters).forEach(
      (key) => newFilters[key] === undefined && delete newFilters[key]
    );
    updateFilters(newFilters);
  };

  const clearFilters = () => {
    updateFilters({});
  };

  if (loading && bugs.length === 0) {
    return (
      <div className="bug-list-container">
        <div className="loading">Loading bugs...</div>
      </div>
    );
  }

  if (error && bugs.length === 0) {
    return (
      <div className="bug-list-container">
        <div className="error">
          <p>Error: {error}</p>
          <button className="btn btn-retry" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bug-list-container">
      <div className="bug-list-header">
        <h2>Bugs ({bugs.length})</h2>
        <button
          className="btn btn-filter"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {showFilters && (
        <div className="bug-list-filters">
          <div className="filter-group">
            <label htmlFor="status-filter">Status:</label>
            <select
              id="status-filter"
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="priority-filter">Priority:</label>
            <select
              id="priority-filter"
              value={filters.priority || ''}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option value="">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-filter">Sort:</label>
            <select
              id="sort-filter"
              value={filters.sort || ''}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
            >
              <option value="">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">By Priority</option>
            </select>
          </div>

          {(filters.status || filters.priority || filters.sort) && (
            <button className="btn btn-clear" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      )}

      {loading && bugs.length > 0 && (
        <div className="loading-indicator">Updating...</div>
      )}

      {error && bugs.length > 0 && (
        <div className="error-indicator">Error: {error}</div>
      )}

      {bugs.length === 0 ? (
        <div className="empty-state">
          <p>No bugs found. Create your first bug report!</p>
        </div>
      ) : (
        <div className="bug-list">
          {bugs.map((bug) => (
            <BugItem
              key={bug._id}
              bug={bug}
              onEdit={onEditBug}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BugList;

