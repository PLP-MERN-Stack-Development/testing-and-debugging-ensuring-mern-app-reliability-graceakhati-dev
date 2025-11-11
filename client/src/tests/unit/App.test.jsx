// App.test.jsx - Unit tests for App component

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../App';
import { BugProvider } from '../../context/BugContext';
import * as bugService from '../../services/bugService';

// Mock the bug service
jest.mock('../../services/bugService');

// Mock BugContext
const mockBugs = [
  {
    _id: '1',
    title: 'Bug 1',
    description: 'Description 1',
    status: 'open',
    priority: 'low',
    reporter: 'Reporter 1',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    title: 'Bug 2',
    description: 'Description 2',
    status: 'in-progress',
    priority: 'high',
    reporter: 'Reporter 2',
    createdAt: new Date().toISOString(),
  },
];

const createMockContext = (overrides = {}) => ({
  bugs: mockBugs,
  loading: false,
  error: null,
  filters: {},
  createBug: jest.fn().mockResolvedValue({ _id: '3', title: 'New Bug' }),
  updateBug: jest.fn().mockResolvedValue({ _id: '1', title: 'Updated Bug' }),
  deleteBug: jest.fn().mockResolvedValue(true),
  loadBugs: jest.fn(),
  updateFilters: jest.fn(),
  ...overrides,
});

jest.mock('../../context/BugContext', () => ({
  ...jest.requireActual('../../context/BugContext'),
  useBugs: jest.fn(),
  BugProvider: ({ children }) => <div data-testid="bug-provider">{children}</div>,
}));

import { useBugs } from '../../context/BugContext';

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useBugs.mockReturnValue(createMockContext());
  });

  describe('Initial Rendering', () => {
    it('should render header', () => {
      render(<App />);

      expect(screen.getByText(/bug tracker/i)).toBeInTheDocument();
    });

    it('should render bug list by default', () => {
      render(<App />);

      expect(screen.getByText(/bugs \(\d+\)/i)).toBeInTheDocument();
    });

    it('should render "Report New Bug" button', () => {
      render(<App />);

      expect(screen.getByRole('button', { name: /report new bug/i })).toBeInTheDocument();
    });

    it('should not render form initially', () => {
      render(<App />);

      expect(screen.queryByText(/report new bug|edit bug/i)).not.toBeInTheDocument();
    });
  });

  describe('Navigation to Form', () => {
    it('should show form when "Report New Bug" button is clicked', () => {
      render(<App />);

      const newBugButton = screen.getByRole('button', { name: /report new bug/i });
      fireEvent.click(newBugButton);

      expect(screen.getByText(/report new bug/i)).toBeInTheDocument();
      expect(screen.queryByText(/bugs \(\d+\)/i)).not.toBeInTheDocument();
    });

    it('should hide bug list when form is shown', () => {
      render(<App />);

      const newBugButton = screen.getByRole('button', { name: /report new bug/i });
      fireEvent.click(newBugButton);

      expect(screen.queryByText(/bugs \(\d+\)/i)).not.toBeInTheDocument();
    });
  });

  describe('Form Display', () => {
    it('should render BugForm when showForm is true', () => {
      render(<App />);

      const newBugButton = screen.getByRole('button', { name: /report new bug/i });
      fireEvent.click(newBugButton);

      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/reporter/i)).toBeInTheDocument();
    });

    it('should render form in create mode when creating new bug', () => {
      render(<App />);

      const newBugButton = screen.getByRole('button', { name: /report new bug/i });
      fireEvent.click(newBugButton);

      expect(screen.getByText(/report new bug/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create bug/i })).toBeInTheDocument();
    });

    it('should render form in edit mode when editing bug', () => {
      render(<App />);

      // First, we need to trigger edit mode
      // Since we're testing App integration, we'll simulate clicking edit
      // This would normally come from BugList -> BugItem
      const editButton = screen.getAllByRole('button', { name: /edit/i })[0];
      fireEvent.click(editButton);

      expect(screen.getByText(/edit bug/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /update bug/i })).toBeInTheDocument();
    });
  });

  describe('Form Cancel', () => {
    it('should return to bug list when form is cancelled', () => {
      render(<App />);

      // Show form
      const newBugButton = screen.getByRole('button', { name: /report new bug/i });
      fireEvent.click(newBugButton);

      expect(screen.getByText(/report new bug/i)).toBeInTheDocument();

      // Cancel form
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      // Should return to bug list
      expect(screen.getByText(/bugs \(\d+\)/i)).toBeInTheDocument();
      expect(screen.queryByText(/report new bug/i)).not.toBeInTheDocument();
    });

    it('should clear editing bug when form is cancelled', () => {
      render(<App />);

      // Edit a bug
      const editButton = screen.getAllByRole('button', { name: /edit/i })[0];
      fireEvent.click(editButton);

      expect(screen.getByText(/edit bug/i)).toBeInTheDocument();

      // Cancel
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      // Create new bug should work (editingBug should be cleared)
      const newBugButton = screen.getByRole('button', { name: /report new bug/i });
      fireEvent.click(newBugButton);

      expect(screen.getByText(/report new bug/i)).toBeInTheDocument();
    });
  });

  describe('Form Success', () => {
    it('should return to bug list after successful form submission', async () => {
      const mockCreateBug = jest.fn().mockResolvedValue({ _id: '3', title: 'New Bug' });
      useBugs.mockReturnValue(createMockContext({ createBug: mockCreateBug }));

      render(<App />);

      // Show form
      const newBugButton = screen.getByRole('button', { name: /report new bug/i });
      fireEvent.click(newBugButton);

      // Fill form
      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Bug' } });
      fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Description' } });
      fireEvent.change(screen.getByLabelText(/reporter/i), { target: { value: 'Reporter' } });

      // Submit form
      const submitButton = screen.getByRole('button', { name: /create bug/i });
      fireEvent.click(submitButton);

      // Should return to bug list
      await waitFor(() => {
        expect(screen.getByText(/bugs \(\d+\)/i)).toBeInTheDocument();
      });
    });

    it('should clear editing bug after successful update', async () => {
      const mockUpdateBug = jest.fn().mockResolvedValue({ _id: '1', title: 'Updated Bug' });
      useBugs.mockReturnValue(createMockContext({ updateBug: mockUpdateBug }));

      render(<App />);

      // Edit a bug
      const editButton = screen.getAllByRole('button', { name: /edit/i })[0];
      fireEvent.click(editButton);

      // Submit update
      const submitButton = screen.getByRole('button', { name: /update bug/i });
      fireEvent.click(submitButton);

      // Should return to bug list
      await waitFor(() => {
        expect(screen.getByText(/bugs \(\d+\)/i)).toBeInTheDocument();
      });
    });
  });

  describe('Edit Bug Flow', () => {
    it('should pass correct bug to form when editing', () => {
      render(<App />);

      // Click edit on first bug
      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      fireEvent.click(editButtons[0]);

      // Form should show edit mode with bug data
      expect(screen.getByText(/edit bug/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue('Bug 1')).toBeInTheDocument();
    });

    it('should update form when different bug is edited', () => {
      render(<App />);

      // Edit first bug
      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      fireEvent.click(editButtons[0]);

      expect(screen.getByDisplayValue('Bug 1')).toBeInTheDocument();

      // Cancel and edit second bug
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      fireEvent.click(editButtons[1]);

      expect(screen.getByDisplayValue('Bug 2')).toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('should maintain separate state for showForm and editingBug', () => {
      render(<App />);

      // Create new bug
      const newBugButton = screen.getByRole('button', { name: /report new bug/i });
      fireEvent.click(newBugButton);

      expect(screen.getByText(/report new bug/i)).toBeInTheDocument();

      // Cancel
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      // Edit bug
      const editButton = screen.getAllByRole('button', { name: /edit/i })[0];
      fireEvent.click(editButton);

      expect(screen.getByText(/edit bug/i)).toBeInTheDocument();
    });
  });

  describe('Integration with BugProvider', () => {
    it('should wrap app in BugProvider', () => {
      render(<App />);

      // BugProvider should be present (mocked to render children)
      // The actual provider is in the real component
      expect(screen.getByText(/bug tracker/i)).toBeInTheDocument();
    });

    it('should pass onEditBug handler to BugList', () => {
      render(<App />);

      // BugList should be rendered and able to call onEditBug
      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      expect(editButtons.length).toBeGreaterThan(0);

      // Clicking edit should show form
      fireEvent.click(editButtons[0]);
      expect(screen.getByText(/edit bug/i)).toBeInTheDocument();
    });
  });

  describe('Conditional Rendering', () => {
    it('should conditionally render BugList or BugForm', () => {
      render(<App />);

      // Initially shows BugList
      expect(screen.getByText(/bugs \(\d+\)/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/title/i)).not.toBeInTheDocument();

      // Show form
      const newBugButton = screen.getByRole('button', { name: /report new bug/i });
      fireEvent.click(newBugButton);

      // Now shows BugForm
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.queryByText(/bugs \(\d+\)/i)).not.toBeInTheDocument();
    });

    it('should not show "Report New Bug" button when form is displayed', () => {
      render(<App />);

      const newBugButton = screen.getByRole('button', { name: /report new bug/i });
      fireEvent.click(newBugButton);

      expect(screen.queryByRole('button', { name: /report new bug/i })).not.toBeInTheDocument();
    });
  });
});






