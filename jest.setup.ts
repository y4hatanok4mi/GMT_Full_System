import '@testing-library/jest-dom';

// jest.setup.ts

// Mock next-auth to avoid real authentication in tests
jest.mock('@/auth', () => ({
  auth: jest.fn().mockResolvedValue({
    user: { id: '123', role: 'student' },
  }),
}));

// Mock prisma to return mock user data
jest.mock('@/lib/prisma', () => ({
  user: {
    findMany: jest.fn().mockResolvedValue([
      { id: 1, name: 'John Doe', school: 'School A', points: 10 },
      { id: 2, name: 'Jane Smith', school: 'School B', points: 20 },
    ]),
  },
}));
