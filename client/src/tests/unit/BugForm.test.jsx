// BugForm.test.jsx - Unit tests for BugForm component

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BugForm from '../../components/BugForm';
import { BugProvider } from '../../context/BugContext';
import * as bugService from '../../services/bugService';

// Mock the bug service
jest.mock('../../services/bugService');

// Mock BugContext to control its behavior
const mockCreateBug = jest.fn();
const mockUpdateBug = jest.fn();

const mockBugContextValue = {
  bugs: [],
  loading: false,
  error: null,
  filters: {},
  createBug: mockCreateBug,
  updateBug: mockUpdateBug,
  deleteBug: jest.fn(),
  loadBugs: jest.fn(),
  updateFilters: jest.fn(),
};

jest.mock('../../context/BugContext', () => ({
  ...jest.requireActual('../../context/BugContext'),
  useBugs: () => mockBugContextValue,
}));

const renderWithProvider = (component, props = {}) => {
  return render(
    <BugProvider>
      {React.cloneElement(component, props)}
    </BugProvider>
  );
};

describe('BugForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBugContextValue.loading = false;
    mockBugContextValue.error = null;
  });

  describe('Rendering', () => {
    it('should render form for creating new bug', () => {
      renderWithProvider(<BugForm />);

      expect(screen.getByText('Report New Bug')).toBeInTheDocument();
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/reporter/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create bug/i })).toBeInTheDocument();
    });

    it('should render form for editing existing bug', () => {
      const bug = {
        _id: '123',
        title: 'Test Bug',
        description: 'Test Description',
        status: 'in-progress',
        priority: 'high',
        reporter: 'Test Reporter',
      };

      renderWithProvider(<BugForm bug={bug} />);

      expect(screen.getByText('Edit Bug')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Bug')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Reporter')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /update bug/i })).toBeInTheDocument();
    });

    it('should render cancel button when onCancel prop is provided', () => {
      const onCancel = jest.fn();
      renderWithProvider(<BugForm onCancel={onCancel} />);

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should not render cancel button when onCancel prop is not provided', () => {
      renderWithProvider(<BugForm />);

      expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
    });
  });

  describe('Form Input Handling', () => {
    it('should update title field when user types', () => {
      renderWithProvider(<BugForm />);

      const titleInput = screen.getByLabelText(/title/i);
      fireEvent.change(titleInput, { target: { value: 'New Bug Title' } });

      expect(titleInput).toHaveValue('New Bug Title');
    });

    it('should update description field when user types', () => {
      renderWithProvider(<BugForm />);

      const descriptionInput = screen.getByLabelText(/description/i);
      fireEvent.change(descriptionInput, { target: { value: 'New Description' } });

      expect(descriptionInput).toHaveValue('New Description');
    });

    it('should update reporter field when user types', () => {
      renderWithProvider(<BugForm />);

      const reporterInput = screen.getByLabelText(/reporter/i);
      fireEvent.change(reporterInput, { target: { value: 'John Doe' } });

      expect(reporterInput).toHaveValue('John Doe');
    });

    it('should update status when user selects different option', () => {
      renderWithProvider(<BugForm />);

      const statusSelect = screen.getByLabelText(/status/i);
      fireEvent.change(statusSelect, { target: { value: 'resolved' } });

      expect(statusSelect).toHaveValue('resolved');
    });

    it('should update priority when user selects different option', () => {
      renderWithProvider(<BugForm />);

      const prioritySelect = screen.getByLabelText(/priority/i);
      fireEvent.change(prioritySelect, { target: { value: 'critical' } });

      expect(prioritySelect).toHaveValue('critical');
    });
  });

  describe('Form Validation', () => {
    it('should show error when title is empty on submit', async () => {
      renderWithProvider(<BugForm />);

      const submitButton = screen.getByRole('button', { name: /create bug/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      });
    });

    it('should show error when description is empty on submit', async () => {
      renderWithProvider(<BugForm />);

      const titleInput = screen.getByLabelText(/title/i);
      fireEvent.change(titleInput, { target: { value: 'Test Title' } });

      const submitButton = screen.getByRole('button', { name: /create bug/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      });
    });

    it('should show error when reporter is empty on submit', async () => {
      renderWithProvider(<BugForm />);

      const titleInput = screen.getByLabelText(/title/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      fireEvent.change(titleInput, { target: { value: 'Test Title' } });
      fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });

      const submitButton = screen.getByRole('button', { name: /create bug/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/reporter name is required/i)).toBeInTheDocument();
      });
    });

    it('should show error when title exceeds 200 characters', async () => {
      renderWithProvider(<BugForm />);

      const titleInput = screen.getByLabelText(/title/i);
      fireEvent.change(titleInput, { target: { value: 'a'.repeat(201) } });

      const descriptionInput = screen.getByLabelText(/description/i);
      const reporterInput = screen.getByLabelText(/reporter/i);
      fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
      fireEvent.change(reporterInput, { target: { value: 'Test Reporter' } });

      const submitButton = screen.getByRole('button', { name: /create bug/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/title cannot exceed 200 characters/i)).toBeInTheDocument();
      });
    });

    it('should clear field error when user starts typing', async () => {
      renderWithProvider(<BugForm />);

      const titleInput = screen.getByLabelText(/title/i);
      const submitButton = screen.getByRole('button', { name: /create bug/i });

      // Submit with empty title to trigger error
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      });

      // Start typing to clear error
      fireEvent.change(titleInput, { target: { value: 'New Title' } });

      await waitFor(() => {
        expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should call createBug when creating new bug', async () => {
      const newBug = {
        title: 'New Bug',
        description: 'New Description',
        reporter: 'New Reporter',
        status: 'open',
        priority: 'medium',
      };

      mockCreateBug.mockResolvedValue({ _id: '123', ...newBug });

      renderWithProvider(<BugForm />);

      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: newBug.title } });
      fireEvent.change(screen.getByLabelText(/description/i), { target: { value: newBug.description } });
      fireEvent.change(screen.getByLabelText(/reporter/i), { target: { value: newBug.reporter } });

      const submitButton = screen.getByRole('button', { name: /create bug/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCreateBug).toHaveBeenCalledWith(newBug);
      });
    });

    it('should call updateBug when editing existing bug', async () => {
      const bug = {
        _id: '123',
        title: 'Original Title',
        description: 'Original Description',
        status: 'open',
        priority: 'medium',
        reporter: 'Original Reporter',
      };

      const updates = {
        title: 'Updated Title',
        description: 'Updated Description',
        status: 'in-progress',
        priority: 'high',
        reporter: 'Updated Reporter',
      };

      mockUpdateBug.mockResolvedValue({ _id: '123', ...updates });

      renderWithProvider(<BugForm bug={bug} />);

      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: updates.title } });
      fireEvent.change(screen.getByLabelText(/description/i), { target: { value: updates.description } });
      fireEvent.change(screen.getByLabelText(/status/i), { target: { value: updates.status } });
      fireEvent.change(screen.getByLabelText(/priority/i), { target: { value: updates.priority } });
      fireEvent.change(screen.getByLabelText(/reporter/i), { target: { value: updates.reporter } });

      const submitButton = screen.getByRole('button', { name: /update bug/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockUpdateBug).toHaveBeenCalledWith('123', expect.objectContaining(updates));
      });
    });

    it('should call onSuccess callback after successful submission', async () => {
      const onSuccess = jest.fn();
      mockCreateBug.mockResolvedValue({ _id: '123', title: 'New Bug' });

      renderWithProvider(<BugForm onSuccess={onSuccess} />);

      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Bug' } });
      fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Description' } });
      fireEvent.change(screen.getByLabelText(/reporter/i), { target: { value: 'Reporter' } });

      const submitButton = screen.getByRole('button', { name: /create bug/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });

    it('should reset form after successful submission', async () => {
      mockCreateBug.mockResolvedValue({ _id: '123', title: 'New Bug' });

      renderWithProvider(<BugForm />);

      const titleInput = screen.getByLabelText(/title/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const reporterInput = screen.getByLabelText(/reporter/i);

      fireEvent.change(titleInput, { target: { value: 'New Bug' } });
      fireEvent.change(descriptionInput, { target: { value: 'Description' } });
      fireEvent.change(reporterInput, { target: { value: 'Reporter' } });

      const submitButton = screen.getByRole('button', { name: /create bug/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(titleInput).toHaveValue('');
        expect(descriptionInput).toHaveValue('');
        expect(reporterInput).toHaveValue('');
      });
    });
  });

  describe('Error States', () => {
    it('should display error message when createBug fails', async () => {
      const errorMessage = 'Failed to create bug';
      mockCreateBug.mockRejectedValue(new Error(errorMessage));

      renderWithProvider(<BugForm />);

      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Bug' } });
      fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Description' } });
      fireEvent.change(screen.getByLabelText(/reporter/i), { target: { value: 'Reporter' } });

      const submitButton = screen.getByRole('button', { name: /create bug/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('should display error message when updateBug fails', async () => {
      const bug = {
        _id: '123',
        title: 'Test Bug',
        description: 'Test Description',
        reporter: 'Test Reporter',
      };

      const errorMessage = 'Failed to update bug';
      mockUpdateBug.mockRejectedValue(new Error(errorMessage));

      renderWithProvider(<BugForm bug={bug} />);

      const submitButton = screen.getByRole('button', { name: /update bug/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('should clear error message when user starts typing', async () => {
      mockCreateBug.mockRejectedValue(new Error('Error message'));

      renderWithProvider(<BugForm />);

      const titleInput = screen.getByLabelText(/title/i);
      fireEvent.change(titleInput, { target: { value: 'New Bug' } });
      fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Description' } });
      fireEvent.change(screen.getByLabelText(/reporter/i), { target: { value: 'Reporter' } });

      const submitButton = screen.getByRole('button', { name: /create bug/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Error message')).toBeInTheDocument();
      });

      // Start typing to clear error
      fireEvent.change(titleInput, { target: { value: 'Updated Bug' } });

      await waitFor(() => {
        expect(screen.queryByText('Error message')).not.toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('should disable submit button when loading', () => {
      mockBugContextValue.loading = true;

      renderWithProvider(<BugForm />);

      const submitButton = screen.getByRole('button', { name: /saving/i });
      expect(submitButton).toBeDisabled();
    });

    it('should show "Saving..." text when loading', () => {
      mockBugContextValue.loading = true;

      renderWithProvider(<BugForm />);

      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });

    it('should disable cancel button when loading', () => {
      mockBugContextValue.loading = true;
      const onCancel = jest.fn();

      renderWithProvider(<BugForm onCancel={onCancel} />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      expect(cancelButton).toBeDisabled();
    });
  });

  describe('Cancel Functionality', () => {
    it('should call onCancel when cancel button is clicked', () => {
      const onCancel = jest.fn();

      renderWithProvider(<BugForm onCancel={onCancel} />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle bug prop changes', () => {
      const { rerender } = renderWithProvider(<BugForm />);

      const bug1 = {
        _id: '123',
        title: 'Bug 1',
        description: 'Description 1',
        reporter: 'Reporter 1',
      };

      rerender(
        <BugProvider>
      <BugForm bug={bug1} />
    </BugProvider>
      );

      expect(screen.getByDisplayValue('Bug 1')).toBeInTheDocument();
    });

    it('should handle empty bug object', () => {
      const bug = {};

      renderWithProvider(<BugForm bug={bug} />);

      expect(screen.getByText('Edit Bug')).toBeInTheDocument();
    });
  });
});






