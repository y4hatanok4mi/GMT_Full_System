/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import Leaderboard from '@/app/(dashboard)/student/leaderboard/page';
import { auth as mockAuth } from '@/auth';
import prisma from '@/lib/prisma';
import { redirect as mockRedirect } from 'next/navigation';

// Mock modules
jest.mock('@/auth');
jest.mock('@/lib/prisma');
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  redirect: jest.fn(),
}));

describe('Leaderboard Page', () => {
  const mockUser = {
    user: {
      id: '1',
      role: 'student',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders leaderboard with student data', async () => {
    (mockAuth as jest.Mock).mockResolvedValue(mockUser);
    (prisma.user.findMany as jest.Mock).mockResolvedValue([
      { id: 1, name: 'Alice', school: 'School A', points: 50 },
      { id: 2, name: 'Bob', school: 'School B', points: 30 },
    ]);

    render(await Leaderboard());

    expect(await screen.findByText('Leaderboard')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('shows message when no students have points', async () => {
    (mockAuth as jest.Mock).mockResolvedValue(mockUser);
    (prisma.user.findMany as jest.Mock).mockResolvedValue([]);

    render(await Leaderboard());

    expect(
      await screen.findByText('No students have earned points yet.')
    ).toBeInTheDocument();
  });

  it('redirects if user is not a student', async () => {
    (mockAuth as jest.Mock).mockResolvedValue({
      user: {
        id: '1',
        role: 'admin',
      },
    });

    await Leaderboard();

    expect(mockRedirect).toHaveBeenCalledWith('/auth/signin');
  });

  it('redirects if no session', async () => {
    (mockAuth as jest.Mock).mockResolvedValue(null);

    await Leaderboard();

    expect(mockRedirect).toHaveBeenCalledWith('/auth/signin');
  });
});
