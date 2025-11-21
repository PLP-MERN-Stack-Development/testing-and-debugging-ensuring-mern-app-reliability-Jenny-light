import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BugItem from '../components/BugItem';

describe('BugItem Component', () => {
  const mockBug = {
    _id: '123',
    title: 'Test Bug',
    description: 'Test Description',
    status: 'open',
    priority: 'high',
    reportedBy: 'Tester',
    createdAt: '2024-01-01T00:00:00.000Z'
  };

  const mockOnStatusChange = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    mockOnStatusChange.mockClear();
    mockOnDelete.mockClear();
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders bug information', () => {
    render(
      <BugItem
        bug={mockBug}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText('Test Bug')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('open')).toBeInTheDocument();
    expect(screen.getByText(/Tester/)).toBeInTheDocument();
  });

  it('calls onStatusChange when status is changed', async () => {
    const user = userEvent.setup();
    mockOnStatusChange.mockResolvedValue();
    
    render(
      <BugItem
        bug={mockBug}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
      />
    );
    
    const statusSelect = screen.getByTestId('status-select');
    await user.selectOptions(statusSelect, 'in-progress');
    
    await waitFor(() => {
      expect(mockOnStatusChange).toHaveBeenCalledWith('123', 'in-progress');
    });
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    mockOnDelete.mockResolvedValue();
    
    render(
      <BugItem
        bug={mockBug}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
      />
    );
    
    const deleteButton = screen.getByTestId('delete-button');
    await user.click(deleteButton);
    
    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith('123');
    });
  });

  it('shows confirmation dialog before deleting', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    
    render(
      <BugItem
        bug={mockBug}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
      />
    );
    
    const deleteButton = screen.getByTestId('delete-button');
    await user.click(deleteButton);
    
    expect(confirmSpy).toHaveBeenCalled();
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('disables controls while updating', async () => {
    const user = userEvent.setup();
    mockOnStatusChange.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(
      <BugItem
        bug={mockBug}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
      />
    );
    
    const statusSelect = screen.getByTestId('status-select');
    const deleteButton = screen.getByTestId('delete-button');
    
    await user.selectOptions(statusSelect, 'resolved');
    
    expect(statusSelect).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });

  it('shows deleting state on delete button', async () => {
    const user = userEvent.setup();
    mockOnDelete.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(
      <BugItem
        bug={mockBug}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
      />
    );
    
    const deleteButton = screen.getByTestId('delete-button');
    await user.click(deleteButton);
    
    expect(screen.getByText(/deleting/i)).toBeInTheDocument();
  });

  it('formats date correctly', () => {
    render(
      <BugItem
        bug={mockBug}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
      />
    );
    
    // Date should be formatted and displayed
    const dateElement = screen.getByText(/📅/);
    expect(dateElement).toBeInTheDocument();
  });
});