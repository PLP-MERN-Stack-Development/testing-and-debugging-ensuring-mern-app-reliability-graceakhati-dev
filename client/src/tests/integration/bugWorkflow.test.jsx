// bugWorkflow.test.jsx - Integration tests for complete bug workflow

import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../App';
import { BugProvider } from '../../context/BugContext';
import * as bugService from '../../services/bugService';

// Mock the bug service
jest.mock('../../services/bugService');

// Mock window.confirm and window.alert
global.window.confirm = jest.fn(() => true);
global.window.alert = jest.fn();

describe('Bug Workflow Integration Tests', () => {
  const mockBugs = [
    {
      _id: '1',
      title: 'Existing Bug 1',
      description: 'Description of bug 1',
      status: 'open',
      priority: 'medium',
      reporter: 'John Doe',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
    {
      _id: '2',
      title: 'Existing Bug 2',
      description: 'Description of bug 2',
      status: 'in-progress',
      priority: 'high',
      reporter: 'Jane Smith',
      createdAt: '2024-01-16T11:00:00Z',
      updatedAt: '2024-01-16T11:00:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    global.window.confirm.mockReturnValue(true);
    global.window.alert.mockClear();
  });

  describe('User Flow: Fill and Submit Bug Report Form', () => {
    it('should complete full flow of creating a new bug report', async () => {
      // Mock initial bugs list
      bugService.getBugs.mockResolvedValue(mockBugs);

      // Mock create bug
      const newBug = {
        _id: '3',
        title: 'New Bug Report',
        description: 'This is a new bug that needs to be fixed',
        status: 'open',
        priority: 'high',
        reporter: 'Test User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      bugService.createBug.mockResolvedValue(newBug);

      // After creation, return updated list
      bugService.getBugs.mockResolvedValue([...mockBugs, newBug]);

      render(
        <BugProvider>
          <App />
        </BugProvider>
      );

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText(/bugs \(\d+\)/i)).toBeInTheDocument();
      });

      // Click "Report New Bug" button
      const reportButton = screen.getByRole('button', { name: /report new bug/i });
      fireEvent.click(reportButton);

      // Verify form is shown
      await waitFor(() => {
        expect(screen.getByText(/report new bug/i)).toBeInTheDocument();
      });

      // Fill out the form
      const titleInput = screen.getByLabelText(/title/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const reporterInput = screen.getByLabelText(/reporter/i);
      const statusSelect = screen.getByLabelText(/status/i);
      const prioritySelect = screen.getByLabelText(/priority/i);

      fireEvent.change(titleInput, { target: { value: 'New Bug Report' } });
      fireEvent.change(descriptionInput, { target: { value: 'This is a new bug that needs to be fixed' } });
      fireEvent.change(reporterInput, { target: { value: 'Test User' } });
      fireEvent.change(statusSelect, { target: { value: 'open' } });
      fireEvent.change(prioritySelect, { target: { value: 'high' } });

      // Verify form fields are filled
      expect(titleInput).toHaveValue('New Bug Report');
      expect(descriptionInput).toHaveValue('This is a new bug that needs to be fixed');
      expect(reporterInput).toHaveValue('Test User');

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /create bug/i });
      fireEvent.click(submitButton);

      // Verify API was called
      await waitFor(() => {
        expect(bugService.createBug).toHaveBeenCalledWith({
          title: 'New Bug Report',
          description: 'This is a new bug that needs to be fixed',
          status: 'open',
          priority: 'high',
          reporter: 'Test User',
        });
      });

      // Verify we return to bug list
      await waitFor(() => {
        expect(screen.getByText(/bugs \(\d+\)/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Verify new bug appears in the list
      await waitFor(() => {
        expect(screen.getByText('New Bug Report')).toBeInTheDocument();
      });
    });

    it('should show validation errors when form is submitted with invalid data', async () => {
      bugService.getBugs.mockResolvedValue(mockBugs);

      render(
        <BugProvider>
          <App />
        </BugProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/bugs \(\d+\)/i)).toBeInTheDocument();
      });

      // Click "Report New Bug" button
      const reportButton = screen.getByRole('button', { name: /report new bug/i });
      fireEvent.click(reportButton);

      await waitFor(() => {
        expect(screen.getByText(/report new bug/i)).toBeInTheDocument();
      });

      // Try to submit empty form
      const submitButton = screen.getByRole('button', { name: /create bug/i });
      fireEvent.click(submitButton);

      // Verify validation errors are shown
      await waitFor(() => {
        expect(screen.getByText(/title is required/i)).toBeInTheDocument();
        expect(screen.getByText(/description is required/i)).toBeInTheDocument();
        expect(screen.getByText(/reporter name is required/i)).toBeInTheDocument();
      });

      // Verify API was not called
      expect(bugService.createBug).not.toHaveBeenCalled();
    });

    it('should show error message when API call fails', async () => {
      bugService.getBugs.mockResolvedValue(mockBugs);
      bugService.createBug.mockRejectedValue(new Error('Failed to create bug'));

      render(
        <BugProvider>
          <App />
        </BugProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/bugs \(\d+\)/i)).toBeInTheDocument();
      });

      // Open form
      const reportButton = screen.getByRole('button', { name: /report new bug/i });
      fireEvent.click(reportButton);

      await waitFor(() => {
        expect(screen.getByText(/report new bug/i)).toBeInTheDocument();
      });

      // Fill and submit form
      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Bug' } });
      fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test Description' } });
      fireEvent.change(screen.getByLabelText(/reporter/i), { target: { value: 'Test Reporter' } });

      const submitButton = screen.getByRole('button', { name: /create bug/i });
      fireEvent.click(submitButton);

      // Verify error message is shown
      await waitFor(() => {
        expect(screen.getByText(/failed to create bug/i)).toBeInTheDocument();
      });
    });

    it('should show loading state during form submission', async () => {
      bugService.getBugs.mockResolvedValue(mockBugs);
      
      // Create a promise that we can control
      let resolveCreate;
      const createPromise = new Promise((resolve) => {
        resolveCreate = resolve;
      });
      bugService.createBug.mockReturnValue(createPromise);

      render(
        <BugProvider>
          <App />
        </BugProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/bugs \(\d+\)/i)).toBeInTheDocument();
      });

      // Open form
      const reportButton = screen.getByRole('button', { name: /report new bug/i });
      fireEvent.click(reportButton);

      await waitFor(() => {
        expect(screen.getByText(/report new bug/i)).toBeInTheDocument();
      });

      // Fill form
      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Bug' } });
      fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test Description' } });
      fireEvent.change(screen.getByLabelText(/reporter/i), { target: { value: 'Test Reporter' } });

      // Submit form
      const submitButton = screen.getByRole('button', { name: /create bug/i });
      fireEvent.click(submitButton);

      // Verify loading state
      await waitFor(() => {
        expect(screen.getByText(/saving/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
      });

      // Resolve the promise
      resolveCreate({ _id: '3', title: 'Test Bug' });
      bugService.getBugs.mockResolvedValue([...mockBugs, { _id: '3', title: 'Test Bug' }]);

      // Wait for completion
      await waitFor(() => {
        expect(screen.queryByText(/saving/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('User Flow: View List of Reported Bugs', () => {
    it('should display all bugs in the list', async () => {
      bugService.getBugs.mockResolvedValue(mockBugs);

      render(
        <BugProvider>
          <App />
        </BugProvider>
      );

      // Wait for bugs to load
      await waitFor(() => {
        expect(screen.getByText(/bugs \(2\)/i)).toBeInTheDocument();
      });

      // Verify both bugs are displayed
      expect(screen.getByText('Existing Bug 1')).toBeInTheDocument();
      expect(screen.getByText('Existing Bug 2')).toBeInTheDocument();
      expect(screen.getByText('Description of bug 1')).toBeInTheDocument();
      expect(screen.getByText('Description of bug 2')).toBeInTheDocument();
    });

    it('should show loading indicator while fetching bugs', async () => {
      // Create a promise we can control
      let resolveGetBugs;
      const getBugsPromise = new Promise((resolve) => {
        resolveGetBugs = resolve;
      });
      bugService.getBugs.mockReturnValue(getBugsPromise);

      render(
        <BugProvider>
          <App />
        </BugProvider>
      );

      // Verify loading state
      expect(screen.getByText(/loading bugs/i)).toBeInTheDocument();

      // Resolve the promise
      resolveGetBugs(mockBugs);

      // Wait for bugs to appear
      await waitFor(() => {
        expect(screen.getByText(/bugs \(2\)/i)).toBeInTheDocument();
      });

      // Verify loading is gone
      expect(screen.queryByText(/loading bugs/i)).not.toBeInTheDocument();
    });

    it('should show error message when fetching bugs fails', async () => {
      bugService.getBugs.mockRejectedValue(new Error('Failed to load bugs'));

      render(
        <BugProvider>
          <App />
        </BugProvider>
      );

      // Verify error is shown
      await waitFor(() => {
        expect(screen.getByText(/error: failed to load bugs/i)).toBeInTheDocument();
      });

      // Verify retry button is shown
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    it('should show empty state when no bugs exist', async () => {
      bugService.getBugs.mockResolvedValue([]);

      render(
        <BugProvider>
          <App />
        </BugProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/no bugs found/i)).toBeInTheDocument();
        expect(screen.getByText(/create your first bug report/i)).toBeInTheDocument();
      });
    });

    it('should filter bugs by status', async () => {
      bugService.getBugs.mockResolvedValue(mockBugs);

      render(
        <BugProvider>
          <App />
        </BugProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/bugs \(2\)/i)).toBeInTheDocument();
      });

      // Show filters
      const filterButton = screen.getByRole('button', { name: /show filters/i });
      fireEvent.click(filterButton);

      // Filter by status
      const statusSelect = screen.getByLabelText(/status/i);
      fireEvent.change(statusSelect, { target: { value: 'open' } });

      // Mock filtered response
      const filteredBugs = [mockBugs[0]];
      bugService.getBugs.mockResolvedValue(filteredBugs);

      // Wait for filter to apply
      await waitFor(() => {
        expect(bugService.getBugs).toHaveBeenCalledWith(
          expect.objectContaining({ status: 'open' })
        );
      });
    });

    it('should filter bugs by priority', async () => {
      bugService.getBugs.mockResolvedValue(mockBugs);

      render(
        <BugProvider>
          <App />
        </BugProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/bugs \(2\)/i)).toBeInTheDocument();
      });

      // Show filters
      const filterButton = screen.getByRole('button', { name: /show filters/i });
      fireEvent.click(filterButton);

      // Filter by priority
      const prioritySelect = screen.getByLabelText(/priority/i);
      fireEvent.change(prioritySelect, { target: { value: 'high' } });

      // Mock filtered response
      const filteredBugs = [mockBugs[1]];
      bugService.getBugs.mockResolvedValue(filteredBugs);

      // Wait for filter to apply
      await waitFor(() => {
        expect(bugService.getBugs).toHaveBeenCalledWith(
          expect.objectContaining({ priority: 'high' })
        );
      });
    });
  });

  describe('User Flow: Update Bug Status', () => {
    it('should update bug status through edit form', async () => {
      bugService.getBugs.mockResolvedValue(mockBugs);

      const updatedBug = {
        ...mockBugs[0],
        status: 'in-progress',
        updatedAt: new Date().toISOString(),
      };
      bugService.updateBug.mockResolvedValue(updatedBug);
      bugService.getBugs.mockResolvedValue([updatedBug, mockBugs[1]]);

      render(
        <BugProvider>
          <App />
        </BugProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/bugs \(2\)/i)).toBeInTheDocument();
      });

      // Find and click edit button for first bug
      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      fireEvent.click(editButtons[0]);

      // Verify form is shown with bug data
      await waitFor(() => {
        expect(screen.getByText(/edit bug/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue('Existing Bug 1')).toBeInTheDocument();
      });

      // Update status
      const statusSelect = screen.getByLabelText(/status/i);
      fireEvent.change(statusSelect, { target: { value: 'in-progress' } });

      // Submit update
      const submitButton = screen.getByRole('button', { name: /update bug/i });
      fireEvent.click(submitButton);

      // Verify API was called
      await waitFor(() => {
        expect(bugService.updateBug).toHaveBeenCalledWith(
          '1',
          expect.objectContaining({ status: 'in-progress' })
        );
      });

      // Verify we return to bug list
      await waitFor(() => {
        expect(screen.getByText(/bugs \(\d+\)/i)).toBeInTheDocument();
      });
    });

    it('should update multiple fields at once', async () => {
      bugService.getBugs.mockResolvedValue(mockBugs);

      const updatedBug = {
        ...mockBugs[0],
        title: 'Updated Bug Title',
        status: 'resolved',
        priority: 'critical',
        updatedAt: new Date().toISOString(),
      };
      bugService.updateBug.mockResolvedValue(updatedBug);
      bugService.getBugs.mockResolvedValue([updatedBug, mockBugs[1]]);

      render(
        <BugProvider>
          <App />
        </BugProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/bugs \(2\)/i)).toBeInTheDocument();
      });

      // Edit bug
      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(/edit bug/i)).toBeInTheDocument();
      });

      // Update multiple fields
      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Updated Bug Title' } });
      fireEvent.change(screen.getByLabelText(/status/i), { target: { value: 'resolved' } });
      fireEvent.change(screen.getByLabelText(/priority/i), { target: { value: 'critical' } });

      // Submit
      const submitButton = screen.getByRole('button', { name: /update bug/i });
      fireEvent.click(submitButton);

      // Verify all fields were updated
      await waitFor(() => {
        expect(bugService.updateBug).toHaveBeenCalledWith(
          '1',
          expect.objectContaining({
            title: 'Updated Bug Title',
            status: 'resolved',
            priority: 'critical',
          })
        );
      });
    });

    it('should show error when update fails', async () => {
      bugService.getBugs.mockResolvedValue(mockBugs);
      bugService.updateBug.mockRejectedValue(new Error('Failed to update bug'));

      render(
        <BugProvider>
          <App />
        </BugProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/bugs \(2\)/i)).toBeInTheDocument();
      });

      // Edit bug
      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(/edit bug/i)).toBeInTheDocument();
      });

      // Update and submit
      fireEvent.change(screen.getByLabelText(/status/i), { target: { value: 'resolved' } });
      const submitButton = screen.getByRole('button', { name: /update bug/i });
      fireEvent.click(submitButton);

      // Verify error is shown
      await waitFor(() => {
        expect(screen.getByText(/failed to update bug/i)).toBeInTheDocument();
      });
    });
  });

  describe('User Flow: Delete Bugs', () => {
    it('should delete a bug after confirmation', async () => {
      bugService.getBugs.mockResolvedValue(mockBugs);
      bugService.deleteBug.mockResolvedValue(true);
      bugService.getBugs.mockResolvedValue([mockBugs[1]]); // After deletion

      render(
        <BugProvider>
          <App />
        </BugProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/bugs \(2\)/i)).toBeInTheDocument();
      });

      // Find delete button for first bug
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      fireEvent.click(deleteButtons[0]);

      // Verify confirmation was shown
      expect(global.window.confirm).toHaveBeenCalledWith(
        'Are you sure you want to delete this bug?'
      );

      // Verify API was called
      await waitFor(() => {
        expect(bugService.deleteBug).toHaveBeenCalledWith('1');
      });

      // Verify bug is removed from list
      await waitFor(() => {
        expect(screen.queryByText('Existing Bug 1')).not.toBeInTheDocument();
        expect(screen.getByText('Existing Bug 2')).toBeInTheDocument();
      });
    });

    it('should not delete bug when confirmation is cancelled', async () => {
      bugService.getBugs.mockResolvedValue(mockBugs);
      global.window.confirm.mockReturnValue(false);

      render(
        <BugProvider>
          <App />
        </BugProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/bugs \(2\)/i)).toBeInTheDocument();
      });

      // Click delete
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      fireEvent.click(deleteButtons[0]);

      // Verify API was not called
      expect(bugService.deleteBug).not.toHaveBeenCalled();

      // Verify bug is still in list
      expect(screen.getByText('Existing Bug 1')).toBeInTheDocument();
    });

    it('should show alert when delete fails', async () => {
      bugService.getBugs.mockResolvedValue(mockBugs);
      bugService.deleteBug.mockRejectedValue(new Error('Failed to delete bug'));

      render(
        <BugProvider>
          <App />
        </BugProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/bugs \(2\)/i)).toBeInTheDocument();
      });

      // Click delete
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      fireEvent.click(deleteButtons[0]);

      // Verify alert is shown
      await waitFor(() => {
        expect(global.window.alert).toHaveBeenCalledWith(
          expect.stringContaining('Failed to delete bug')
        );
      });
    });

    it('should update bug count after deletion', async () => {
      bugService.getBugs.mockResolvedValue(mockBugs);
      bugService.deleteBug.mockResolvedValue(true);
      bugService.getBugs.mockResolvedValue([mockBugs[1]]);

      render(
        <BugProvider>
          <App />
        </BugProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/bugs \(2\)/i)).toBeInTheDocument();
      });

      // Delete a bug
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      fireEvent.click(deleteButtons[0]);

      // Verify count is updated
      await waitFor(() => {
        expect(screen.getByText(/bugs \(1\)/i)).toBeInTheDocument();
      });
    });
  });

  describe('Complete User Journey', () => {
    it('should complete full cycle: create, view, edit, delete', async () => {
      // Initial state - no bugs
      bugService.getBugs.mockResolvedValue([]);

      render(
        <BugProvider>
          <App />
        </BugProvider>
      );

      // Step 1: View empty state
      await waitFor(() => {
        expect(screen.getByText(/no bugs found/i)).toBeInTheDocument();
      });

      // Step 2: Create a bug
      const newBug = {
        _id: '1',
        title: 'Journey Bug',
        description: 'A bug for the complete journey',
        status: 'open',
        priority: 'medium',
        reporter: 'Journey User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      bugService.createBug.mockResolvedValue(newBug);
      bugService.getBugs.mockResolvedValue([newBug]);

      const reportButton = screen.getByRole('button', { name: /report new bug/i });
      fireEvent.click(reportButton);

      await waitFor(() => {
        expect(screen.getByText(/report new bug/i)).toBeInTheDocument();
      });

      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Journey Bug' } });
      fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'A bug for the complete journey' } });
      fireEvent.change(screen.getByLabelText(/reporter/i), { target: { value: 'Journey User' } });

      const createButton = screen.getByRole('button', { name: /create bug/i });
      fireEvent.click(createButton);

      // Step 3: View the created bug
      await waitFor(() => {
        expect(screen.getByText(/bugs \(1\)/i)).toBeInTheDocument();
        expect(screen.getByText('Journey Bug')).toBeInTheDocument();
      });

      // Step 4: Edit the bug
      const updatedBug = {
        ...newBug,
        status: 'in-progress',
        priority: 'high',
      };
      bugService.updateBug.mockResolvedValue(updatedBug);
      bugService.getBugs.mockResolvedValue([updatedBug]);

      const editButton = screen.getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);

      await waitFor(() => {
        expect(screen.getByText(/edit bug/i)).toBeInTheDocument();
      });

      fireEvent.change(screen.getByLabelText(/status/i), { target: { value: 'in-progress' } });
      fireEvent.change(screen.getByLabelText(/priority/i), { target: { value: 'high' } });

      const updateButton = screen.getByRole('button', { name: /update bug/i });
      fireEvent.click(updateButton);

      // Step 5: Verify update
      await waitFor(() => {
        expect(screen.getByText(/bugs \(1\)/i)).toBeInTheDocument();
      });

      // Step 6: Delete the bug
      bugService.deleteBug.mockResolvedValue(true);
      bugService.getBugs.mockResolvedValue([]);

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      // Step 7: Verify deletion
      await waitFor(() => {
        expect(screen.getByText(/no bugs found/i)).toBeInTheDocument();
        expect(screen.queryByText('Journey Bug')).not.toBeInTheDocument();
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle network errors gracefully', async () => {
      bugService.getBugs.mockRejectedValue(new Error('Network error'));

      render(
        <BugProvider>
          <App />
        </BugProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/error: network error/i)).toBeInTheDocument();
      });

      // Verify retry button is available
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    it('should handle partial form submission errors', async () => {
      bugService.getBugs.mockResolvedValue(mockBugs);
      bugService.createBug.mockRejectedValue(new Error('Server error'));

      render(
        <BugProvider>
          <App />
        </BugProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/bugs \(\d+\)/i)).toBeInTheDocument();
      });

      // Open form and fill it
      const reportButton = screen.getByRole('button', { name: /report new bug/i });
      fireEvent.click(reportButton);

      await waitFor(() => {
        expect(screen.getByText(/report new bug/i)).toBeInTheDocument();
      });

      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Bug' } });
      fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test Description' } });
      fireEvent.change(screen.getByLabelText(/reporter/i), { target: { value: 'Test Reporter' } });

      // Submit and get error
      const submitButton = screen.getByRole('button', { name: /create bug/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/server error/i)).toBeInTheDocument();
      });

      // Form should still be visible with error
      expect(screen.getByText(/report new bug/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Bug')).toBeInTheDocument();
    });

    it('should maintain form state after validation error', async () => {
      bugService.getBugs.mockResolvedValue(mockBugs);

      render(
        <BugProvider>
          <App />
        </BugProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/bugs \(\d+\)/i)).toBeInTheDocument();
      });

      // Open form
      const reportButton = screen.getByRole('button', { name: /report new bug/i });
      fireEvent.click(reportButton);

      await waitFor(() => {
        expect(screen.getByText(/report new bug/i)).toBeInTheDocument();
      });

      // Fill only title
      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Partial Bug' } });

      // Try to submit
      const submitButton = screen.getByRole('button', { name: /create bug/i });
      fireEvent.click(submitButton);

      // Verify validation errors
      await waitFor(() => {
        expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      });

      // Verify title is still filled
      expect(screen.getByDisplayValue('Partial Bug')).toBeInTheDocument();
    });
  });
});






