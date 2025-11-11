// BugForm.jsx - Form component for creating/editing bugs

import React, { useState, useEffect } from 'react';
import { useBugs } from '../context/BugContext';
import './BugForm.css';

const BugForm = ({ bug = null, onCancel, onSuccess }) => {
  const { createBug, updateBug, loading } = useBugs();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
    reporter: '',
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  // Populate form if editing
  useEffect(() => {
    if (bug) {
      setFormData({
        title: bug.title || '',
        description: bug.description || '',
        status: bug.status || 'open',
        priority: bug.priority || 'medium',
        reporter: bug.reporter || '',
      });
    }
  }, [bug]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    setSubmitError('');
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters';
    }
    // FIXED: Removed overly strict validation that blocked valid submissions
    // Titles should be able to contain words like "bug", "error", or "issue"

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.reporter.trim()) {
      newErrors.reporter = 'Reporter name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate()) {
      return;
    }

    try {
      if (bug) {
        // Update existing bug
        await updateBug(bug._id, formData);
      } else {
        // Create new bug
        await createBug(formData);
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        status: 'open',
        priority: 'medium',
        reporter: '',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setSubmitError(err.message || 'Failed to save bug');
    }
  };

  return (
    <div className="bug-form-container">
      <div className="bug-form">
        <h2 className="bug-form-title">
          {bug ? 'Edit Bug' : 'Report New Bug'}
        </h2>

        {submitError && (
          <div className="form-error-message">{submitError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? 'input-error' : ''}
              placeholder="Enter bug title"
              maxLength={200}
            />
            {errors.title && (
              <span className="field-error">{errors.title}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? 'input-error' : ''}
              placeholder="Describe the bug in detail"
              rows={5}
            />
            {errors.description && (
              <span className="field-error">{errors.description}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reporter">
              Reporter <span className="required">*</span>
            </label>
            <input
              type="text"
              id="reporter"
              name="reporter"
              value={formData.reporter}
              onChange={handleChange}
              className={errors.reporter ? 'input-error' : ''}
              placeholder="Your name"
            />
            {errors.reporter && (
              <span className="field-error">{errors.reporter}</span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : bug ? 'Update Bug' : 'Create Bug'}
            </button>
            {onCancel && (
              <button
                type="button"
                className="btn btn-cancel"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BugForm;

