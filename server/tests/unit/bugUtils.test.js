// bugUtils.test.js - Unit tests for bug utility functions

const {
  isValidStatusTransition,
  getValidNextStatuses,
  isValidPriority,
  getPriorityWeight,
  validateBugData,
} = require('../../src/utils/bugUtils');

describe('Bug Utility Functions', () => {
  describe('isValidStatusTransition', () => {
    describe('Positive Test Cases - Valid Transitions', () => {
      it('should allow transition from open to in-progress', () => {
        expect(isValidStatusTransition('open', 'in-progress')).toBe(true);
      });

      it('should allow transition from open to resolved', () => {
        expect(isValidStatusTransition('open', 'resolved')).toBe(true);
      });

      it('should allow transition from in-progress to open', () => {
        expect(isValidStatusTransition('in-progress', 'open')).toBe(true);
      });

      it('should allow transition from in-progress to resolved', () => {
        expect(isValidStatusTransition('in-progress', 'resolved')).toBe(true);
      });

      it('should allow transition from resolved to open', () => {
        expect(isValidStatusTransition('resolved', 'open')).toBe(true);
      });

      it('should allow transition from resolved to in-progress', () => {
        expect(isValidStatusTransition('resolved', 'in-progress')).toBe(true);
      });
    });

    describe('Negative Test Cases - Invalid Transitions', () => {
      it('should reject transition from open to open (same status)', () => {
        expect(isValidStatusTransition('open', 'open')).toBe(false);
      });

      it('should reject transition from in-progress to in-progress', () => {
        expect(isValidStatusTransition('in-progress', 'in-progress')).toBe(false);
      });

      it('should reject transition from resolved to resolved', () => {
        expect(isValidStatusTransition('resolved', 'resolved')).toBe(false);
      });

      it('should reject invalid current status', () => {
        expect(isValidStatusTransition('invalid', 'open')).toBe(false);
      });

      it('should reject invalid new status', () => {
        expect(isValidStatusTransition('open', 'invalid')).toBe(false);
      });

      it('should reject null current status', () => {
        expect(isValidStatusTransition(null, 'open')).toBe(false);
      });

      it('should reject null new status', () => {
        expect(isValidStatusTransition('open', null)).toBe(false);
      });

      it('should reject undefined current status', () => {
        expect(isValidStatusTransition(undefined, 'open')).toBe(false);
      });

      it('should reject undefined new status', () => {
        expect(isValidStatusTransition('open', undefined)).toBe(false);
      });
    });

    describe('Edge Cases', () => {
      it('should handle empty string current status', () => {
        expect(isValidStatusTransition('', 'open')).toBe(false);
      });

      it('should handle empty string new status', () => {
        expect(isValidStatusTransition('open', '')).toBe(false);
      });

      it('should handle case-sensitive status values', () => {
        expect(isValidStatusTransition('Open', 'in-progress')).toBe(false);
        expect(isValidStatusTransition('OPEN', 'in-progress')).toBe(false);
      });
    });
  });

  describe('getValidNextStatuses', () => {
    describe('Positive Test Cases', () => {
      it('should return valid next statuses for open', () => {
        const nextStatuses = getValidNextStatuses('open');
        expect(nextStatuses).toEqual(['in-progress', 'resolved']);
        expect(nextStatuses.length).toBe(2);
      });

      it('should return valid next statuses for in-progress', () => {
        const nextStatuses = getValidNextStatuses('in-progress');
        expect(nextStatuses).toEqual(['open', 'resolved']);
        expect(nextStatuses.length).toBe(2);
      });

      it('should return valid next statuses for resolved', () => {
        const nextStatuses = getValidNextStatuses('resolved');
        expect(nextStatuses).toEqual(['open', 'in-progress']);
        expect(nextStatuses.length).toBe(2);
      });
    });

    describe('Negative Test Cases', () => {
      it('should return empty array for invalid status', () => {
        const nextStatuses = getValidNextStatuses('invalid');
        expect(nextStatuses).toEqual([]);
      });

      it('should return empty array for null status', () => {
        const nextStatuses = getValidNextStatuses(null);
        expect(nextStatuses).toEqual([]);
      });

      it('should return empty array for undefined status', () => {
        const nextStatuses = getValidNextStatuses(undefined);
        expect(nextStatuses).toEqual([]);
      });

      it('should return empty array for empty string', () => {
        const nextStatuses = getValidNextStatuses('');
        expect(nextStatuses).toEqual([]);
      });
    });
  });

  describe('isValidPriority', () => {
    describe('Positive Test Cases', () => {
      it('should return true for low priority', () => {
        expect(isValidPriority('low')).toBe(true);
      });

      it('should return true for medium priority', () => {
        expect(isValidPriority('medium')).toBe(true);
      });

      it('should return true for high priority', () => {
        expect(isValidPriority('high')).toBe(true);
      });

      it('should return true for critical priority', () => {
        expect(isValidPriority('critical')).toBe(true);
      });
    });

    describe('Negative Test Cases', () => {
      it('should return false for invalid priority', () => {
        expect(isValidPriority('invalid')).toBe(false);
      });

      it('should return false for null', () => {
        expect(isValidPriority(null)).toBe(false);
      });

      it('should return false for undefined', () => {
        expect(isValidPriority(undefined)).toBe(false);
      });

      it('should return false for empty string', () => {
        expect(isValidPriority('')).toBe(false);
      });

      it('should return false for case variations', () => {
        expect(isValidPriority('Low')).toBe(false);
        expect(isValidPriority('LOW')).toBe(false);
        expect(isValidPriority('Medium')).toBe(false);
      });
    });
  });

  describe('getPriorityWeight', () => {
    describe('Positive Test Cases', () => {
      it('should return weight 1 for low priority', () => {
        expect(getPriorityWeight('low')).toBe(1);
      });

      it('should return weight 2 for medium priority', () => {
        expect(getPriorityWeight('medium')).toBe(2);
      });

      it('should return weight 3 for high priority', () => {
        expect(getPriorityWeight('high')).toBe(3);
      });

      it('should return weight 4 for critical priority', () => {
        expect(getPriorityWeight('critical')).toBe(4);
      });
    });

    describe('Edge Cases', () => {
      it('should return 0 for invalid priority', () => {
        expect(getPriorityWeight('invalid')).toBe(0);
      });

      it('should return 0 for null', () => {
        expect(getPriorityWeight(null)).toBe(0);
      });

      it('should return 0 for undefined', () => {
        expect(getPriorityWeight(undefined)).toBe(0);
      });
    });
  });

  describe('validateBugData', () => {
    describe('Positive Test Cases - Valid Data', () => {
      it('should validate bug data with all required fields', () => {
        const bugData = {
          title: 'Test Bug',
          description: 'Test description',
          reporter: 'Test Reporter',
        };

        const result = validateBugData(bugData);
        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
      });

      it('should validate bug data with all fields including status and priority', () => {
        const bugData = {
          title: 'Test Bug',
          description: 'Test description',
          reporter: 'Test Reporter',
          status: 'in-progress',
          priority: 'high',
        };

        const result = validateBugData(bugData);
        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
      });

      it('should validate bug data with maximum length title (200 chars)', () => {
        const bugData = {
          title: 'a'.repeat(200),
          description: 'Test description',
          reporter: 'Test Reporter',
        };

        const result = validateBugData(bugData);
        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
      });
    });

    describe('Negative Test Cases - Missing Required Fields', () => {
      it('should fail validation when title is missing', () => {
        const bugData = {
          description: 'Test description',
          reporter: 'Test Reporter',
        };

        const result = validateBugData(bugData);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Title is required and must be a non-empty string');
      });

      it('should fail validation when description is missing', () => {
        const bugData = {
          title: 'Test Bug',
          reporter: 'Test Reporter',
        };

        const result = validateBugData(bugData);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Description is required and must be a non-empty string');
      });

      it('should fail validation when reporter is missing', () => {
        const bugData = {
          title: 'Test Bug',
          description: 'Test description',
        };

        const result = validateBugData(bugData);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Reporter is required and must be a non-empty string');
      });

      it('should fail validation when title is empty string', () => {
        const bugData = {
          title: '',
          description: 'Test description',
          reporter: 'Test Reporter',
        };

        const result = validateBugData(bugData);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Title is required and must be a non-empty string');
      });

      it('should fail validation when description is empty string', () => {
        const bugData = {
          title: 'Test Bug',
          description: '',
          reporter: 'Test Reporter',
        };

        const result = validateBugData(bugData);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Description is required and must be a non-empty string');
      });

      it('should fail validation when reporter is empty string', () => {
        const bugData = {
          title: 'Test Bug',
          description: 'Test description',
          reporter: '',
        };

        const result = validateBugData(bugData);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Reporter is required and must be a non-empty string');
      });
    });

    describe('Negative Test Cases - Invalid Field Types', () => {
      it('should fail validation when title is not a string', () => {
        const bugData = {
          title: 123,
          description: 'Test description',
          reporter: 'Test Reporter',
        };

        const result = validateBugData(bugData);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Title is required and must be a non-empty string');
      });

      it('should fail validation when description is not a string', () => {
        const bugData = {
          title: 'Test Bug',
          description: 123,
          reporter: 'Test Reporter',
        };

        const result = validateBugData(bugData);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Description is required and must be a non-empty string');
      });

      it('should fail validation when reporter is not a string', () => {
        const bugData = {
          title: 'Test Bug',
          description: 'Test description',
          reporter: 123,
        };

        const result = validateBugData(bugData);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Reporter is required and must be a non-empty string');
      });
    });

    describe('Negative Test Cases - Field Length Validation', () => {
      it('should fail validation when title exceeds 200 characters', () => {
        const bugData = {
          title: 'a'.repeat(201),
          description: 'Test description',
          reporter: 'Test Reporter',
        };

        const result = validateBugData(bugData);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Title cannot exceed 200 characters');
      });
    });

    describe('Negative Test Cases - Invalid Enum Values', () => {
      it('should fail validation when status is invalid', () => {
        const bugData = {
          title: 'Test Bug',
          description: 'Test description',
          reporter: 'Test Reporter',
          status: 'invalid-status',
        };

        const result = validateBugData(bugData);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Status must be one of: open, in-progress, resolved');
      });

      it('should fail validation when priority is invalid', () => {
        const bugData = {
          title: 'Test Bug',
          description: 'Test description',
          reporter: 'Test Reporter',
          priority: 'invalid-priority',
        };

        const result = validateBugData(bugData);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Priority must be one of: low, medium, high, critical');
      });
    });

    describe('Edge Cases', () => {
      it('should handle multiple validation errors', () => {
        const bugData = {
          title: '',
          description: '',
          reporter: '',
          status: 'invalid',
          priority: 'invalid',
        };

        const result = validateBugData(bugData);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(1);
      });

      it('should handle whitespace-only strings as invalid', () => {
        const bugData = {
          title: '   ',
          description: '   ',
          reporter: '   ',
        };

        const result = validateBugData(bugData);
        expect(result.valid).toBe(false);
        // Note: trim() check happens in model, but validation should catch empty after trim
        expect(result.errors.length).toBeGreaterThan(0);
      });

      it('should allow valid status and priority values', () => {
        const bugData = {
          title: 'Test Bug',
          description: 'Test description',
          reporter: 'Test Reporter',
          status: 'resolved',
          priority: 'critical',
        };

        const result = validateBugData(bugData);
        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
      });
    });
  });
});






