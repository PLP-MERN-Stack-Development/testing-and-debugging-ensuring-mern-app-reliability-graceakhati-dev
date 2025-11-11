// BugContext.jsx - Context API for bug state management

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getBugs as fetchBugs,
  createBug as addBug,
  updateBug as modifyBug,
  deleteBug as removeBug,
} from '../services/bugService';

const BugContext = createContext();

export const useBugs = () => {
  const context = useContext(BugContext);
  if (!context) {
    throw new Error('useBugs must be used within a BugProvider');
  }
  return context;
};

export const BugProvider = ({ children }) => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  // Fetch bugs from API
  const loadBugs = useCallback(async (customFilters = null) => {
    setLoading(true);
    setError(null);
    try {
      const activeFilters = customFilters || filters;
      const data = await fetchBugs(activeFilters);
      setBugs(data);
    } catch (err) {
      setError(err.message || 'Failed to load bugs');
      console.error('Error loading bugs:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Create a new bug
  const createBug = async (bugData) => {
    // FIXED: Race condition - prevent multiple simultaneous calls
    if (loading) {
      throw new Error('Request already in progress');
    }
    
    setLoading(true);
    setError(null);
    try {
      const newBug = await addBug(bugData);
      // FIXED: Check for duplicates before adding to prevent race condition issues
      setBugs((prevBugs) => {
        // Check if bug already exists (race condition protection)
        const exists = prevBugs.find(b => b._id === newBug._id);
        if (exists) {
          return prevBugs; // Don't add duplicate
        }
        return [newBug, ...prevBugs];
      });
      return newBug;
    } catch (err) {
      const errorMessage = err.message || 'Failed to create bug';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing bug
  const updateBug = async (id, bugData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedBug = await modifyBug(id, bugData);
      setBugs((prevBugs) =>
        prevBugs.map((bug) => (bug._id === id ? updatedBug : bug))
      );
      return updatedBug;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update bug';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a bug
  const deleteBug = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await removeBug(id);
      setBugs((prevBugs) => prevBugs.filter((bug) => bug._id !== id));
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete bug';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update filters and reload bugs
  const updateFilters = (newFilters) => {
    setFilters(newFilters);
  };

  // Load bugs on mount and when filters change
  useEffect(() => {
    loadBugs();
  }, [loadBugs]);

  const value = {
    bugs,
    loading,
    error,
    filters,
    loadBugs,
    createBug,
    updateBug,
    deleteBug,
    updateFilters,
  };

  return <BugContext.Provider value={value}>{children}</BugContext.Provider>;
};

