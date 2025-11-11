// bugModel.test.js - Unit tests for Bug model validation

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Bug = require('../../src/models/Bug');

let mongoServer;

// Setup in-memory MongoDB before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// Clean up after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clean up database between tests
afterEach(async () => {
  await Bug.deleteMany({});
});

describe('Bug Model Validation', () => {
  describe('Positive Test Cases - Valid Bug Creation', () => {
    it('should create a bug with all required fields', async () => {
      const bugData = {
        title: 'Test Bug',
        description: 'This is a test bug description',
        reporter: 'John Doe',
      };

      const bug = await Bug.create(bugData);

      expect(bug).toBeDefined();
      expect(bug._id).toBeDefined();
      expect(bug.title).toBe('Test Bug');
      expect(bug.description).toBe('This is a test bug description');
      expect(bug.reporter).toBe('John Doe');
      expect(bug.status).toBe('open'); // Default value
      expect(bug.priority).toBe('medium'); // Default value
      expect(bug.createdAt).toBeDefined();
      expect(bug.updatedAt).toBeDefined();
    });

    it('should create a bug with all fields including status and priority', async () => {
      const bugData = {
        title: 'Critical Bug',
        description: 'This is a critical bug that needs immediate attention',
        status: 'in-progress',
        priority: 'critical',
        reporter: 'Jane Smith',
      };

      const bug = await Bug.create(bugData);

      expect(bug.status).toBe('in-progress');
      expect(bug.priority).toBe('critical');
    });

    it('should trim whitespace from title, description, and reporter', async () => {
      const bugData = {
        title: '  Trimmed Title  ',
        description: '  Trimmed Description  ',
        reporter: '  Trimmed Reporter  ',
      };

      const bug = await Bug.create(bugData);

      expect(bug.title).toBe('Trimmed Title');
      expect(bug.description).toBe('Trimmed Description');
      expect(bug.reporter).toBe('Trimmed Reporter');
    });

    it('should accept maximum length title (200 characters)', async () => {
      const longTitle = 'a'.repeat(200);
      const bugData = {
        title: longTitle,
        description: 'Test description',
        reporter: 'Test Reporter',
      };

      const bug = await Bug.create(bugData);
      expect(bug.title).toBe(longTitle);
      expect(bug.title.length).toBe(200);
    });
  });

  describe('Negative Test Cases - Required Fields', () => {
    it('should fail validation when title is missing', async () => {
      const bugData = {
        description: 'Test description',
        reporter: 'Test Reporter',
      };

      await expect(Bug.create(bugData)).rejects.toThrow();
    });

    it('should fail validation when description is missing', async () => {
      const bugData = {
        title: 'Test Bug',
        reporter: 'Test Reporter',
      };

      await expect(Bug.create(bugData)).rejects.toThrow();
    });

    it('should fail validation when reporter is missing', async () => {
      const bugData = {
        title: 'Test Bug',
        description: 'Test description',
      };

      await expect(Bug.create(bugData)).rejects.toThrow();
    });

    it('should fail validation when title is empty string', async () => {
      const bugData = {
        title: '',
        description: 'Test description',
        reporter: 'Test Reporter',
      };

      await expect(Bug.create(bugData)).rejects.toThrow();
    });

    it('should fail validation when description is empty string', async () => {
      const bugData = {
        title: 'Test Bug',
        description: '',
        reporter: 'Test Reporter',
      };

      await expect(Bug.create(bugData)).rejects.toThrow();
    });

    it('should fail validation when reporter is empty string', async () => {
      const bugData = {
        title: 'Test Bug',
        description: 'Test description',
        reporter: '',
      };

      await expect(Bug.create(bugData)).rejects.toThrow();
    });
  });

  describe('Negative Test Cases - Field Length Validation', () => {
    it('should fail validation when title exceeds 200 characters', async () => {
      const longTitle = 'a'.repeat(201);
      const bugData = {
        title: longTitle,
        description: 'Test description',
        reporter: 'Test Reporter',
      };

      await expect(Bug.create(bugData)).rejects.toThrow();
    });
  });

  describe('Status Enum Validation', () => {
    it('should accept valid status: open', async () => {
      const bugData = {
        title: 'Test Bug',
        description: 'Test description',
        reporter: 'Test Reporter',
        status: 'open',
      };

      const bug = await Bug.create(bugData);
      expect(bug.status).toBe('open');
    });

    it('should accept valid status: in-progress', async () => {
      const bugData = {
        title: 'Test Bug',
        description: 'Test description',
        reporter: 'Test Reporter',
        status: 'in-progress',
      };

      const bug = await Bug.create(bugData);
      expect(bug.status).toBe('in-progress');
    });

    it('should accept valid status: resolved', async () => {
      const bugData = {
        title: 'Test Bug',
        description: 'Test description',
        reporter: 'Test Reporter',
        status: 'resolved',
      };

      const bug = await Bug.create(bugData);
      expect(bug.status).toBe('resolved');
    });

    it('should reject invalid status value', async () => {
      const bugData = {
        title: 'Test Bug',
        description: 'Test description',
        reporter: 'Test Reporter',
        status: 'invalid-status',
      };

      await expect(Bug.create(bugData)).rejects.toThrow();
    });

    it('should reject empty status string', async () => {
      const bugData = {
        title: 'Test Bug',
        description: 'Test description',
        reporter: 'Test Reporter',
        status: '',
      };

      await expect(Bug.create(bugData)).rejects.toThrow();
    });

    it('should use default status "open" when status is not provided', async () => {
      const bugData = {
        title: 'Test Bug',
        description: 'Test description',
        reporter: 'Test Reporter',
      };

      const bug = await Bug.create(bugData);
      expect(bug.status).toBe('open');
    });
  });

  describe('Priority Enum Validation', () => {
    it('should accept valid priority: low', async () => {
      const bugData = {
        title: 'Test Bug',
        description: 'Test description',
        reporter: 'Test Reporter',
        priority: 'low',
      };

      const bug = await Bug.create(bugData);
      expect(bug.priority).toBe('low');
    });

    it('should accept valid priority: medium', async () => {
      const bugData = {
        title: 'Test Bug',
        description: 'Test description',
        reporter: 'Test Reporter',
        priority: 'medium',
      };

      const bug = await Bug.create(bugData);
      expect(bug.priority).toBe('medium');
    });

    it('should accept valid priority: high', async () => {
      const bugData = {
        title: 'Test Bug',
        description: 'Test description',
        reporter: 'Test Reporter',
        priority: 'high',
      };

      const bug = await Bug.create(bugData);
      expect(bug.priority).toBe('high');
    });

    it('should accept valid priority: critical', async () => {
      const bugData = {
        title: 'Test Bug',
        description: 'Test description',
        reporter: 'Test Reporter',
        priority: 'critical',
      };

      const bug = await Bug.create(bugData);
      expect(bug.priority).toBe('critical');
    });

    it('should reject invalid priority value', async () => {
      const bugData = {
        title: 'Test Bug',
        description: 'Test description',
        reporter: 'Test Reporter',
        priority: 'invalid-priority',
      };

      await expect(Bug.create(bugData)).rejects.toThrow();
    });

    it('should use default priority "medium" when priority is not provided', async () => {
      const bugData = {
        title: 'Test Bug',
        description: 'Test description',
        reporter: 'Test Reporter',
      };

      const bug = await Bug.create(bugData);
      expect(bug.priority).toBe('medium');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long description', async () => {
      const longDescription = 'a'.repeat(10000);
      const bugData = {
        title: 'Test Bug',
        description: longDescription,
        reporter: 'Test Reporter',
      };

      const bug = await Bug.create(bugData);
      expect(bug.description).toBe(longDescription);
    });

    it('should handle special characters in fields', async () => {
      const bugData = {
        title: 'Bug with "quotes" & <tags>',
        description: 'Description with special chars: !@#$%^&*()',
        reporter: 'Reporter-Name_123',
      };

      const bug = await Bug.create(bugData);
      expect(bug.title).toBe('Bug with "quotes" & <tags>');
      expect(bug.description).toBe('Description with special chars: !@#$%^&*()');
      expect(bug.reporter).toBe('Reporter-Name_123');
    });

    it('should handle unicode characters', async () => {
      const bugData = {
        title: 'Bug with émojis 🐛 and unicode 中文',
        description: 'Description with émojis 🐛 and unicode 中文',
        reporter: 'Reporter with émojis 🐛',
      };

      const bug = await Bug.create(bugData);
      expect(bug.title).toContain('🐛');
      expect(bug.description).toContain('🐛');
      expect(bug.reporter).toContain('🐛');
    });

    it('should automatically set timestamps on creation', async () => {
      const beforeCreation = new Date();
      const bugData = {
        title: 'Test Bug',
        description: 'Test description',
        reporter: 'Test Reporter',
      };

      const bug = await Bug.create(bugData);
      const afterCreation = new Date();

      expect(bug.createdAt).toBeDefined();
      expect(bug.updatedAt).toBeDefined();
      expect(bug.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(bug.createdAt.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
    });

    it('should update updatedAt timestamp on modification', async () => {
      const bugData = {
        title: 'Test Bug',
        description: 'Test description',
        reporter: 'Test Reporter',
      };

      const bug = await Bug.create(bugData);
      const originalUpdatedAt = bug.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      bug.title = 'Updated Title';
      await bug.save();

      expect(bug.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });
});






