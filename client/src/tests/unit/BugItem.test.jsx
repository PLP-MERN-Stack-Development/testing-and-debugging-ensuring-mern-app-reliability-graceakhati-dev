// BugItem.test.jsx - Unit tests for BugItem component

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BugItem from '../../components/BugItem';

describe('BugItem Component', () => {
  const mockBug = {
    _id: '123',
    title: 'Test Bug',
    description: 'This is a test bug description',
    status: 'open',
    priority: 'medium',
    reporter: 'John Doe',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  };

  describe('Rendering', () => {
    it('should render bug with all fields', () => {
      render(<BugItem bug={mockBug} />);

      expect(screen.getByText('Test Bug')).toBeInTheDocument();
      expect(screen.getByText('This is a test bug description')).toBeInTheDocument();
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
      expect(screen.getByText(/created:/i)).toBeInTheDocument();
    });

    it('should display status badge', () => {
      render(<BugItem bug={mockBug} />);

      const statusBadge = screen.getByText('open');
      expect(statusBadge).toBeInTheDocument();
      expect(statusBadge).toHaveClass('status-badge');
    });

    it('should display priority badge', () => {
      render(<BugItem bug={mockBug} />);

      const priorityBadge = screen.getByText('medium');
      expect(priorityBadge).toBeInTheDocument();
      expect(priorityBadge).toHaveClass('priority-badge');
    });

    it('should format and display date correctly', () => {
      render(<BugItem bug={mockBug} />);

      const dateElement = screen.getByText(/created:/i);
      expect(dateElement).toBeInTheDocument();
      // Date should be formatted
      expect(dateElement.textContent).toMatch(/jan|january/i);
    });
  });

  describe('Status Display', () => {
    it('should apply correct class for open status', () => {
      const bug = { ...mockBug, status: 'open' };
      render(<BugItem bug={bug} />);

      const statusBadge = screen.getByText('open');
      expect(statusBadge).toHaveClass('status-open');
    });

    it('should apply correct class for in-progress status', () => {
      const bug = { ...mockBug, status: 'in-progress' };
      render(<BugItem bug={bug} />);

      const statusBadge = screen.getByText('in-progress');
      expect(statusBadge).toHaveClass('status-in-progress');
    });

    it('should apply correct class for resolved status', () => {
      const bug = { ...mockBug, status: 'resolved' };
      render(<BugItem bug={bug} />);

      const statusBadge = screen.getByText('resolved');
      expect(statusBadge).toHaveClass('status-resolved');
    });
  });

  describe('Priority Display', () => {
    it('should apply correct class for low priority', () => {
      const bug = { ...mockBug, priority: 'low' };
      render(<BugItem bug={bug} />);

      const priorityBadge = screen.getByText('low');
      expect(priorityBadge).toHaveClass('priority-low');
    });

    it('should apply correct class for medium priority', () => {
      const bug = { ...mockBug, priority: 'medium' };
      render(<BugItem bug={bug} />);

      const priorityBadge = screen.getByText('medium');
      expect(priorityBadge).toHaveClass('priority-medium');
    });

    it('should apply correct class for high priority', () => {
      const bug = { ...mockBug, priority: 'high' };
      render(<BugItem bug={bug} />);

      const priorityBadge = screen.getByText('high');
      expect(priorityBadge).toHaveClass('priority-high');
    });

    it('should apply correct class for critical priority', () => {
      const bug = { ...mockBug, priority: 'critical' };
      render(<BugItem bug={bug} />);

      const priorityBadge = screen.getByText('critical');
      expect(priorityBadge).toHaveClass('priority-critical');
    });
  });

  describe('Edit Functionality', () => {
    it('should render edit button when onEdit is provided', () => {
      const onEdit = jest.fn();
      render(<BugItem bug={mockBug} onEdit={onEdit} />);

      const editButton = screen.getByRole('button', { name: /edit/i });
      expect(editButton).toBeInTheDocument();
    });

    it('should not render edit button when onEdit is not provided', () => {
      render(<BugItem bug={mockBug} />);

      expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
    });

    it('should call onEdit with bug object when edit button is clicked', () => {
      const onEdit = jest.fn();
      render(<BugItem bug={mockBug} onEdit={onEdit} />);

      const editButton = screen.getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);

      expect(onEdit).toHaveBeenCalledTimes(1);
      expect(onEdit).toHaveBeenCalledWith(mockBug);
    });

    it('should have correct aria-label for edit button', () => {
      const onEdit = jest.fn();
      render(<BugItem bug={mockBug} onEdit={onEdit} />);

      const editButton = screen.getByLabelText(/edit bug: test bug/i);
      expect(editButton).toBeInTheDocument();
    });
  });

  describe('Delete Functionality', () => {
    it('should render delete button when onDelete is provided', () => {
      const onDelete = jest.fn();
      render(<BugItem bug={mockBug} onDelete={onDelete} />);

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      expect(deleteButton).toBeInTheDocument();
    });

    it('should not render delete button when onDelete is not provided', () => {
      render(<BugItem bug={mockBug} />);

      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });

    it('should call onDelete with bug ID when delete button is clicked', () => {
      const onDelete = jest.fn();
      render(<BugItem bug={mockBug} onDelete={onDelete} />);

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onDelete).toHaveBeenCalledWith('123');
    });

    it('should have correct aria-label for delete button', () => {
      const onDelete = jest.fn();
      render(<BugItem bug={mockBug} onDelete={onDelete} />);

      const deleteButton = screen.getByLabelText(/delete bug: test bug/i);
      expect(deleteButton).toBeInTheDocument();
    });
  });

  describe('Both Edit and Delete', () => {
    it('should render both buttons when both callbacks are provided', () => {
      const onEdit = jest.fn();
      const onDelete = jest.fn();
      render(<BugItem bug={mockBug} onEdit={onEdit} onDelete={onDelete} />);

      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('should call correct callback for each button', () => {
      const onEdit = jest.fn();
      const onDelete = jest.fn();
      render(<BugItem bug={mockBug} onEdit={onEdit} onDelete={onDelete} />);

      const editButton = screen.getByRole('button', { name: /edit/i });
      const deleteButton = screen.getByRole('button', { name: /delete/i });

      fireEvent.click(editButton);
      expect(onEdit).toHaveBeenCalledTimes(1);
      expect(onDelete).not.toHaveBeenCalled();

      fireEvent.click(deleteButton);
      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onEdit).toHaveBeenCalledTimes(1); // Still 1, not incremented
    });
  });

  describe('Edge Cases', () => {
    it('should handle bug with missing optional fields', () => {
      const minimalBug = {
        _id: '123',
        title: 'Minimal Bug',
        description: 'Description',
        status: 'open',
        priority: 'medium',
        reporter: 'Reporter',
        createdAt: new Date().toISOString(),
      };

      render(<BugItem bug={minimalBug} />);

      expect(screen.getByText('Minimal Bug')).toBeInTheDocument();
    });

    it('should handle very long title', () => {
      const longTitleBug = {
        ...mockBug,
        title: 'a'.repeat(200),
      };

      render(<BugItem bug={longTitleBug} />);

      expect(screen.getByText('a'.repeat(200))).toBeInTheDocument();
    });

    it('should handle very long description', () => {
      const longDescBug = {
        ...mockBug,
        description: 'a'.repeat(1000),
      };

      render(<BugItem bug={longDescBug} />);

      expect(screen.getByText('a'.repeat(1000))).toBeInTheDocument();
    });

    it('should handle different date formats', () => {
      const bugWithDate = {
        ...mockBug,
        createdAt: '2024-12-25T00:00:00.000Z',
      };

      render(<BugItem bug={bugWithDate} />);

      const dateElement = screen.getByText(/created:/i);
      expect(dateElement).toBeInTheDocument();
    });

    it('should handle special characters in title', () => {
      const specialCharBug = {
        ...mockBug,
        title: 'Bug with "quotes" & <tags>',
      };

      render(<BugItem bug={specialCharBug} />);

      expect(screen.getByText('Bug with "quotes" & <tags>')).toBeInTheDocument();
    });

    it('should handle unicode characters', () => {
      const unicodeBug = {
        ...mockBug,
        title: 'Bug with émojis 🐛 and unicode 中文',
        reporter: 'Reporter with émojis 🐛',
      };

      render(<BugItem bug={unicodeBug} />);

      expect(screen.getByText(/bug with émojis 🐛/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper structure for screen readers', () => {
      render(<BugItem bug={mockBug} onEdit={jest.fn()} onDelete={jest.fn()} />);

      const editButton = screen.getByLabelText(/edit bug: test bug/i);
      const deleteButton = screen.getByLabelText(/delete bug: test bug/i);

      expect(editButton).toBeInTheDocument();
      expect(deleteButton).toBeInTheDocument();
    });

    it('should display reporter with strong tag', () => {
      render(<BugItem bug={mockBug} />);

      const reporterElement = screen.getByText(/reporter:/i);
      expect(reporterElement).toBeInTheDocument();
      expect(reporterElement.querySelector('strong')).toBeInTheDocument();
    });
  });
});






