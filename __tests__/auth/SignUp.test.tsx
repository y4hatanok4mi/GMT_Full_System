import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as authActions from '@/app/actions/authActions';
import SignUp from '@/app/auth/signup/page';

jest.mock('@/actions/authActions', () => ({
  handleSignUp: jest.fn(), // Ensure handleSignUp is mocked as a jest function
}));

describe('SignUp Page', () => {
  it('successfully submits the form when handleSignUp returns success', async () => {
    // Cast handleSignUp as jest.Mock and mock its resolved value
    (authActions.handleSignUp as jest.Mock).mockResolvedValue({ success: true });

    render(<SignUp />);

    // Simulate user input
    fireEvent.input(screen.getByLabelText(/Email/i), { target: { value: 'geometriks@example.com' } });
    fireEvent.input(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.input(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });
    fireEvent.input(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.input(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Gender/i), { target: { value: 'Male' } });
    fireEvent.input(screen.getByLabelText(/Date of Birth/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/School/i), { target: { value: 'SNHS' } });
    fireEvent.input(screen.getByLabelText(/ID Number/i), { target: { value: '21B1569' } });

    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: /Sign Up/i }));

    // Wait for the success modal or success behavior to appear
    await waitFor(() => expect(authActions.handleSignUp).toHaveBeenCalledTimes(1)); // Ensure handleSignUp was called
    await waitFor(() => expect(screen.getByText(/Verification email sent/i)).toBeInTheDocument()); // Check for success message
  });

  it('displays an error message when handleSignUp returns failure', async () => {
    // Cast handleSignUp as jest.Mock and mock its resolved value
    (authActions.handleSignUp as jest.Mock).mockResolvedValue({ success: false, message: 'Sign up failed' });

    render(<SignUp />);

    // Simulate user input
    fireEvent.input(screen.getByLabelText(/Email/i), { target: { value: 'geometriks@example.com' } });
    fireEvent.input(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.input(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });
    fireEvent.input(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.input(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Gender/i), { target: { value: 'Male' } });
    fireEvent.input(screen.getByLabelText(/Date of Birth/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/School/i), { target: { value: 'SNHS' } });
    fireEvent.input(screen.getByLabelText(/ID Number/i), { target: { value: '21B1569' } });

    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: /Sign Up/i }));

    // Wait for the failure response to be processed
    await waitFor(() => expect(authActions.handleSignUp).toHaveBeenCalledTimes(1)); // Ensure handleSignUp was called
    await waitFor(() => expect(screen.getByText(/Sign up failed/i)).toBeInTheDocument()); // Check for error message
  });
});
