import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BugForm from '../components/BugForm';

describe('BugForm Component', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders the form with all fields', () => {
    render(<BugForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reported by/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /report bug/i })).toBeInTheDocument();
  });

  it('displays validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /report bug/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      expect(screen.getByText(/reporter name is required/i)).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates title length', async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={mockOnSubmit} />);
    
    const titleInput = screen.getByTestId('title-input');
    const longTitle = 'a'.repeat(101);
    
    await user.type(titleInput, longTitle);
    await user.click(screen.getByRole('button', { name: /report bug/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/title must be less than 100 characters/i)).toBeInTheDocument();
    });
  });

  it('validates description length', async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={mockOnSubmit} />);
    
    const descInput = screen.getByTestId('description-input');
    const longDesc = 'a'.repeat(501);
    
    await user.type(descInput, longDesc);
    await user.click(screen.getByRole('button', { name: /report bug/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/description must be less than 500 characters/i)).toBeInTheDocument();
    });
  });

  it('submits valid form data', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue();
    
    render(<BugForm onSubmit={mockOnSubmit} />);
    
    await user.type(screen.getByTestId('title-input'), 'Test Bug');
    await user.type(screen.getByTestId('description-input'), 'Test Description');
    await user.selectOptions(screen.getByTestId('priority-select'), 'high');
    await user.type(screen.getByTestId('reporter-input'), 'Tester');
    
    await user.click(screen.getByRole('button', { name: /report bug/i }));
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Bug',
        description: 'Test Description',
        priority: 'high',
        reportedBy: 'Tester'
      });
    });
  });

  it('clears errors when user types', async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={mockOnSubmit} />);
    
    // Trigger validation error
    await user.click(screen.getByRole('button', { name: /report bug/i }));
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
    
    // Type in the field
    await user.type(screen.getByTestId('title-input'), 'New Title');
    
    // Error should be cleared
    expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument();
  });

  it('resets form after successful submission', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue();
    
    render(<BugForm onSubmit={mockOnSubmit} />);
    
    const titleInput = screen.getByTestId('title-input');
    const descInput = screen.getByTestId('description-input');
    const reporterInput = screen.getByTestId('reporter-input');
    
    await user.type(titleInput, 'Test Bug');
    await user.type(descInput, 'Test Description');
    await user.type(reporterInput, 'Tester');
    
    await user.click(screen.getByRole('button', { name: /report bug/i }));
    
    await waitFor(() => {
      expect(titleInput.value).toBe('');
      expect(descInput.value).toBe('');
      expect(reporterInput.value).toBe('');
    });
  });

  it('displays submit error message', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Failed to submit';
    mockOnSubmit.mockRejectedValue(new Error(errorMessage));
    
    render(<BugForm onSubmit={mockOnSubmit} />);
    
    await user.type(screen.getByTestId('title-input'), 'Test');
    await user.type(screen.getByTestId('description-input'), 'Description');
    await user.type(screen.getByTestId('reporter-input'), 'Tester');
    
    await user.click(screen.getByRole('button', { name: /report bug/i }));
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('disables submit button while submitting', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<BugForm onSubmit={mockOnSubmit} />);
    
    await user.type(screen.getByTestId('title-input'), 'Test');
    await user.type(screen.getByTestId('description-input'), 'Description');
    await user.type(screen.getByTestId('reporter-input'), 'Tester');
    
    const submitButton = screen.getByRole('button');
    await user.click(submitButton);
    
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/submitting/i);
  });
});