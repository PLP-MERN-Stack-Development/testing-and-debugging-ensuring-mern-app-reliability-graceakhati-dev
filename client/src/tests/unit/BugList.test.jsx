// BugList.test.jsx - Unit tests for BugList component

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BugList from '../../components/BugList';
import { BugProvider } from '../../context/BugContext';
import * as bugService from '../../services/bugService';

// Mock the bug service
jest.mock('../../services/bugService');

// Mock BugContext
const mockDeleteBug = jest.fn();
const mockUpdateFilters = jest.fn();

const createMockContext = (overrides = {}) => ({
  bugs: [],
  loading: false,
  error: null,
  filters: {},
  createBug: jest.fn(),
  updateBug: jest.fn(),
  deleteBug: mockDeleteBug,
  loadBugs: jest.fn(),
  updateFilters: mockUpdateFilters,
  ...overrides,
});

jest.mock('../../context/BugContext', () => ({
  ...jest.requireActual('../../context/BugContext'),
  useBugs: jest.fn(),
}));

import { useBugs } from '../../context/BugContext';

describe('BugList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.window.confirm = jest.fn(() => true);
    global.window.alert = jest.fn();
  });

  describe('Rendering', () => {
    it('should render bug list with header', () => {
      useBugs.mockReturnValue(createMockContext({ bugs: [] }));

      render(
        <BugProvider>
          <BugList />
        </BugProvider>
      );

      expect(screen.getByText(/bugs \(0\)/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /show filters/i })).toBeInTheDocument();
    });

    it('should display correct bug count', () => {
      const bugs = [
        { _id: '1', title: 'Bug 1', description: 'Desc 1', status: 'open', priority: 'low', reporter: 'Reporter 1', createdAt: new Date() },
        { _id: '2', title: 'Bug 2', description: 'Desc 2', status: 'open', priority: 'medium', reporter: 'Reporter 2', createdAt: new Date() },
      ];

      useBugs.mockReturnValue(createMockContext({ bugs }));

      render(
        <BugProvider>
          <BugList />
        </BugProvider>
      );

      expect(screen.getByText(/bugs \(2\)/i)).toBeInTheDocument();
    });

    it('should render all bugs', () => {
      const bugs = [
        { _id: '1', title: 'Bug 1', description: 'Desc 1', status: 'open', priority: 'low', reporter: 'Reporter 1', createdAt: new Date() },
        { _id: '2', title: 'Bug 2', description: 'Desc 2', status: 'in-progress', priority: 'high', reporter: 'Reporter 2', createdAt: new Date() },
      ];

      useBugs.mockReturnValue(createMockContext({ bugs }));

      render(
        <BugProvider>
          <BugList />
        </BugProvider>
      );

      expect(screen.getByText('Bug 1')).toBeInTheDocument();
      expect(screen.getByText('Bug 2')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading message when loading and no bugs', () => {
      useBugs.mockReturnValue(createMockContext({ loading: true, bugs: [] }));

      render(
        <BugProvider>
          <BugList />
        </BugProvider>
      );

      expect(screen.getByText(/loading bugs/i)).toBeInTheDocument();
    });

    it('should show updating indicator when loading with existing bugs', () => {
      const bugs = [
        { _id: '1', title: 'Bug 1', description: 'Desc 1', status: 'open', priority: 'low', reporter: 'Reporter 1', createdAt: new Date() },
      ];

      useBugs.mockReturnValue(createMockContext({ loading: true, bugs }));

      render(
        <BugProvider>
          <BugList />
        </BugProvider>
      );

      expect(screen.getByText(/updating/i)).toBeInTheDocument();
    });

    it('should not show loading when bugs exist and not loading', () => {
      const bugs = [
        { _id: '1', title: 'Bug 1', description: 'Desc 1', status: 'open', priority: 'low', reporter: 'Reporter 1', createdAt: new Date() },
      ];

      useBugs.mockReturnValue(createMockContext({ bugs }));

      render(
        <BugProvider>
          <BugList />
        </BugProvider>
      );

      expect(screen.queryByText(/loading bugs/i)).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error message when error occurs and no bugs', () => {
      useBugs.mockReturnValue(createMockContext({ error: 'Failed to load bugs', bugs: [] }));

      render(
        <BugProvider>
          <BugList />
        </BugProvider>
      );

      expect(screen.getByText(/error: failed to load bugs/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    it('should show error indicator when error occurs with existing bugs', () => {
      const bugs = [
        { _id: '1', title: 'Bug 1', description: 'Desc 1', status: 'open', priority: 'low', reporter: 'Reporter 1', createdAt: new Date() },
      ];

      useBugs.mockReturnValue(createMockContext({ error: 'Update failed', bugs }));

      render(
        <BugProvider>
          <BugList />
        </BugProvider>
      );

      expect(screen.getByText(/error: update failed/i)).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty state message when no bugs', () => {
      useBugs.mockReturnValue(createMockContext({ bugs: [] }));

      render(
        <BugProvider>
          <BugList />
        </BugProvider>
      );

      expect(screen.getByText(/no bugs found/i)).toBeInTheDocument();
    });

    it('should not show empty state when bugs exist', () => {
      const bugs = [
        { _id: '1', title: 'Bug 1', description: 'Desc 1', status: 'open', priority: 'low', reporter: 'Reporter 1', createdAt: new Date() },
      ];

      useBugs.mockReturnValue(createMockContext({ bugs }));

      render(
        <BugProvider>
          <BugList />
        </BugProvider>
      );

      expect(screen.queryByText(/no bugs found/i)).not.toBeInTheDocument();
    });
  });

  describe('Filter Functionality', () => {
    it('should toggle filters visibility', () => {
      useBugs.mockReturnValue(createMockContext({ bugs: [] }));

      render(
        <BugProvider>
          <BugList />
        </BugProvider>
      );

      const filterButton = screen.getByRole('button', { name: /show filters/i });
      fireEvent.click(filterButton);

      expect(screen.getByText(/hide filters/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    });

    it('should show filters when showFilters is true', () => {
      useBugs.mockReturnValue(createMockContext({ bugs: [] }));

      render(
        <BugProvider>
          <BugList />
        </BugProvider>
      );

      const filterButton = screen.getByRole('button', { name: /show filters/i });
      fireEvent.click(filterButton);

      expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/sort/i)).toBeInTheDocument();
    });

    it('should update filters when status is selected', () => {
      useBugs.mockReturnValue(createMockContext({ bugs: [], filters: {} }));

      render(
        <BugProvider>
          <BugList />
        </BugProvider>
      );

      const filterButton = screen.getByRole('button', { name: /show filters/i });
      fireEvent.click(filterButton);

      const statusSelect = screen.getByLabelText(/status/i);
      fireEvent.change(statusSelect, { target: { value: 'open' } });

      expect(mockUpdateFilters).toHaveBeenCalledWith({ status: 'open' });
    });

    it('should update filters when priority is selected', () => {
      useBugs.mockReturnValue(createMockContext({ bugs: [], filters: {} }));

      render(
        <BugProvider>
          <BugList />
        </BugProvider>
      );

      const filterButton = screen.getByRole('button', { name: /show filters/i });
      fireEvent.click(filterButton);

      const prioritySelect = screen.getByLabelText(/priority/i);
      fireEvent.change(prioritySelect, { target: { value: 'high' } });

      expect(mockUpdateFilters).toHaveBeenCalledWith({ priority: 'high' });
    });

    it('should update filters when sort is selected', () => {
      useBugs.mockReturnValue(createMockContext({ bugs: [], filters: {} }));

      render(
        <BugProvider>
          <BugList />
        </BugProvider>
      );

      const filterButton = screen.getByRole('button', { name: /show filters/i });
      fireEvent.click(filterButton);

      const sortSelect = screen.getByLabelText(/sort/i);
      fireEvent.change(sortSelect, { target: { value: 'oldest' } });

      expect(mockUpdateFilters).toHaveBeenCalledWith({ sort: 'oldest' });
    });

    it('should show clear filters button when filters are active', () => {
      useBugs.mockReturnValue(createMockContext({ 
        bugs: [], 
        filters: { status: 'open' } 
      }));

      render(
        <BugProvider>
          <BugList />
        </BugProvider>
      );

      const filterButton = screen.getByRole('button', { name: /show filters/i });
      fireEvent.click(filterButton);

      expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();
    });

    it('should clear filters when clear button is clicked', () => {
      useBugs.mockReturnValue(createMockContext({ 
        bugs: [], 
        filters: { status: 'open', priority: 'high' } 
      }));

      render(
        <BugProvider>
          <BugList />
        </BugProvider>
      );

      const filterButton = screen.getByRole('button', { name: /show filters/i });
      fireEvent.click(filterButton);

      const clearButton = screen.getByRole('button', { name: /clear filters/i });
      fireEvent.click(clearButton);

      expect(mockUpdateFilters).toHaveBeenCalledWith({});
    });
  });

  describe('Delete Functionality', () => {
    it('should call deleteBug when delete is confirmed', async () => {
      const bugs = [
        { _id: '1', title: 'Bug 1', description: 'Desc 1', status: 'open', priority: 'low', reporter: 'Reporter 1', createdAt: new Date() },
      ];

      useBugs.mockReturnValue(createMockContext({ bugs }));
      mockDeleteBug.mockResolvedValue(true);
      global.window.confirm = jest.fn(() => true);

      render(
        <BugProvider>
          <BugList />
        </BugProvider>
      );

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockDeleteBug).toHaveBeenCalledWith('1');
      });
    });

    it('should not call deleteBug when delete is cancelled', async () => {
      const bugs = [
        { _id: '1', title: 'Bug 1', description: 'Desc 1', status: 'open', priority: 'low', reporter: 'Reporter 1', createdAt: new Date() },
      ];

      useBugs.mockReturnValue(createMockContext({ bugs }));
      global.window.confirm = jest.fn(() => false);

      render(
        <BugProvider>
          <BugList />
        </BugProvider>
      );

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockDeleteBug).not.toHaveBeenCalled();
      });
    });

    it('should show alert when delete fails', async () => {
      const bugs = [
        { _id: '1', title: 'Bug 1', description: 'Desc 1', status: 'open', priority: 'low', reporter: 'Reporter 1', createdAt: new Date() },
      ];

      useBugs.mockReturnValue(createMockContext({ bugs }));
      mockDeleteBug.mockRejectedValue(new Error('Delete failed'));
      global.window.confirm = jest.fn(() => true);

      render(
        <BugProvider>
          <BugList />
        </BugProvider>
      );

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(global.window.alert).toHaveBeenCalledWith(expect.stringContaining('Delete failed'));
      });
    });
  });

  describe('Edit Functionality', () => {
    it('should call onEditBug when edit button is clicked', () => {
      const bugs = [
        { _id: '1', title: 'Bug 1', description: 'Desc 1', status: 'open', priority: 'low', reporter: 'Reporter 1', createdAt: new Date() },
      ];

      const onEditBug = jest.fn();
      useBugs.mockReturnValue(createMockContext({ bugs }));

      render(
        <BugProvider>
          <BugList onEditBug={onEditBug} />
        </BugProvider>
      );

      const editButton = screen.getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);

      expect(onEditBug).toHaveBeenCalledWith(bugs[0]);
    });

    it('should not show edit button when onEditBug is not provided', () => {
      const bugs = [
        { _id: '1', title: 'Bug 1', description: 'Desc 1', status: 'open', priority: 'low', reporter: 'Reporter 1', createdAt: new Date() },
      ];

      useBugs.mockReturnValue(createMockContext({ bugs }));

      render(
        <BugProvider>
          <BugList />
        </BugProvider>
      );

      expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
    });
  });

  describe('Retry Functionality', () => {
    it('should reload page when retry button is clicked', () => {
      const originalReload = window.location.reload;
      window.location.reload = jest.fn();

      useBugs.mockReturnValue(createMockContext({ error: 'Failed to load', bugs: [] }));

      render(
        <BugProvider>
          <BugList />
        </BugProvider>
      );

      const retryButton = screen.getByRole('button', { name: /retry/i });
      fireEvent.click(retryButton);

      expect(window.location.reload).toHaveBeenCalled();

      window.location.reload = originalReload;
    });
  });
});






