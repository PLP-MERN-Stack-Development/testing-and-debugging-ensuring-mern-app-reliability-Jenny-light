import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BugList from '../components/BugList';

describe('BugList Component', () => {
  const mockBugs = [
    {
      _id: '1',
      title: 'Bug 1',
      description: 'Description 1',
      status: 'open',
      priority: 'high',
      reportedBy: 'User 1',
      createdAt: '2024-01-01'
    },
    {
      _id: '2',
      title: 'Bug 2',
      description: 'Description 2',
      status: 'in-progress',
      priority: 'medium',
      reportedBy: 'User 2',
      createdAt: '2024-01-02'
    },
    {
      _id: '3',
      title: 'Bug 3',
      description: 'Description 3',
      status: 'resolved',
      priority: 'low',
      reportedBy: 'User 3',
      createdAt: '2024-01-03'
    }
  ];

  const mockOnStatusChange = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    mockOnStatusChange.mockClear();
    mockOnDelete.mockClear();
  });

  it('displays loading state', () => {
    render(
      <BugList
        bugs={[]}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
        loading={true}
        error={null}
      />
    );
    
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.getByText(/loading bugs/i)).toBeInTheDocument();
  });

  it('displays error state', () => {
    const errorMessage = 'Failed to fetch bugs';
    render(
      <BugList
        bugs={[]}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
        loading={false}
        error={errorMessage}
      />
    );
    
    expect(screen.getByTestId('error')).toBeInTheDocument();
    expect(screen.getByText(new RegExp(errorMessage, 'i'))).toBeInTheDocument();
  });

  it('displays empty state when no bugs', () => {
    render(
      <BugList
        bugs={[]}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
        loading={false}
        error={null}
      />
    );
    
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText(/no bugs found/i)).toBeInTheDocument();
  });

  it('renders all bugs', () => {
    render(
      <BugList
        bugs={mockBugs}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
        loading={false}
        error={null}
      />
    );
    
    expect(screen.getAllByTestId('bug-item')).toHaveLength(3);
    expect(screen.getByText('Bug 1')).toBeInTheDocument();
    expect(screen.getByText('Bug 2')).toBeInTheDocument();
    expect(screen.getByText('Bug 3')).toBeInTheDocument();
  });

  it('displays bug count', () => {
    render(
      <BugList
        bugs={mockBugs}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
        loading={false}
        error={null}
      />
    );
    
    expect(screen.getByText(/bug list \\(3\\)/i)).toBeInTheDocument();
  });

  it('filters bugs by status', async () => {
    const user = userEvent.setup();
    render(
      <BugList
        bugs={mockBugs}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
        loading={false}
        error={null}
      />
    );
    
    const filterSelect = screen.getByTestId('filter-select');
    
    // Filter by "open"
    await user.selectOptions(filterSelect, 'open');
    expect(screen.getAllByTestId('bug-item')).toHaveLength(1);
    expect(screen.getByText('Bug 1')).toBeInTheDocument();
    
    // Filter by "in-progress"
    await user.selectOptions(filterSelect, 'in-progress');
    expect(screen.getAllByTestId('bug-item')).toHaveLength(1);
    expect(screen.getByText('Bug 2')).toBeInTheDocument();
    
    // Filter by "resolved"
    await user.selectOptions(filterSelect, 'resolved');
    expect(screen.getAllByTestId('bug-item')).toHaveLength(1);
    expect(screen.getByText('Bug 3')).toBeInTheDocument();
    
    // Show all
    await user.selectOptions(filterSelect, 'all');
    expect(screen.getAllByTestId('bug-item')).toHaveLength(3);
  });

  it('shows appropriate empty message for filtered results', async () => {
    const user = userEvent.setup();
    const bugsWithoutOpen = mockBugs.filter(b => b.status !== 'open');
    
    render(
      <BugList
        bugs={bugsWithoutOpen}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
        loading={false}
        error={null}
      />
    );
    
    const filterSelect = screen.getByTestId('filter-select');
    await user.selectOptions(filterSelect, 'open');
    
    expect(screen.getByText(/no bugs with status "open"/i)).toBeInTheDocument();
  });

  it('passes correct props to BugItem components', () => {
    render(
      <BugList
        bugs={[mockBugs[0]]}
        onStatusChange={mockOnStatusChange}
        onDelete={mockOnDelete}
        loading={false}
        error={null}
      />
    );
    
    expect(screen.getByText('Bug 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('open')).toBeInTheDocument();
  });
});