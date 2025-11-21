import { useState, useEffect } from 'react';
import BugItem from './BugItem';
import './BugList.css';

const BugList = ({ bugs, onStatusChange, onDelete, loading, error }) => {
  const [filter, setFilter] = useState('all');
  const [filteredBugs, setFilteredBugs] = useState([]);

  useEffect(() => {
    console.log('[BugList] Filtering bugs, current filter:', filter);
    
    if (filter === 'all') {
      setFilteredBugs(bugs);
    } else {
      setFilteredBugs(bugs.filter(bug => bug.status === filter));
    }
  }, [bugs, filter]);

  if (loading) {
    return (
      <div className="bug-list-container">
        <div className="loading" data-testid="loading">
          Loading bugs...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bug-list-container">
        <div className="error" role="alert" data-testid="error">
          ❌ Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bug-list-container">
      <div className="list-header">
        <h2>Bug List ({filteredBugs.length})</h2>
        
        <div className="filter-controls">
          <label htmlFor="status-filter">Filter by status:</label>
          <select
            id="status-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
            data-testid="filter-select"
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {filteredBugs.length === 0 ? (
        <div className="empty-state" data-testid="empty-state">
          <p>📋 No bugs found</p>
          <p className="empty-subtitle">
            {filter !== 'all' 
              ? `No bugs with status "${filter}"`
              : 'Start by reporting your first bug!'}
          </p>
        </div>
      ) : (
        <div className="bug-grid">
          {filteredBugs.map(bug => (
            <BugItem
              key={bug._id}
              bug={bug}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BugList;