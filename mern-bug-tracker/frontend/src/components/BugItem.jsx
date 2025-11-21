import { useState } from 'react';
import './BugItem.css';

const BugItem = ({ bug, onStatusChange, onDelete }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    console.log(`[BugItem] Changing status of bug ${bug._id} to ${newStatus}`);
    
    try {
      await onStatusChange(bug._id, newStatus);
    } catch (error) {
      console.error('[BugItem] Status change failed:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this bug?')) {
      return;
    }
    
    setIsDeleting(true);
    console.log(`[BugItem] Deleting bug ${bug._id}`);
    
    try {
      await onDelete(bug._id);
    } catch (error) {
      console.error('[BugItem] Delete failed:', error);
      setIsDeleting(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#4caf50',
      medium: '#ff9800',
      high: '#f44336',
      critical: '#9c27b0'
    };
    return colors[priority] || '#999';
  };

  const getStatusColor = (status) => {
    const colors = {
      open: '#2196f3',
      'in-progress': '#ff9800',
      resolved: '#4caf50'
    };
    return colors[status] || '#999';
  };

  return (
    <div className="bug-item" data-testid="bug-item">
      <div className="bug-header">
        <h3 className="bug-title">{bug.title}</h3>
        <div className="bug-badges">
          <span 
            className="badge priority-badge"
            style={{ backgroundColor: getPriorityColor(bug.priority) }}
          >
            {bug.priority}
          </span>
          <span 
            className="badge status-badge"
            style={{ backgroundColor: getStatusColor(bug.status) }}
          >
            {bug.status}
          </span>
        </div>
      </div>

      <p className="bug-description">{bug.description}</p>

      <div className="bug-meta">
        <span className="bug-reporter">👤 {bug.reportedBy}</span>
        <span className="bug-date">
          📅 {new Date(bug.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="bug-actions">
        <select
          value={bug.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={isUpdating || isDeleting}
          className="status-select"
          data-testid="status-select"
        >
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        <button
          onClick={handleDelete}
          disabled={isUpdating || isDeleting}
          className="delete-button"
          data-testid="delete-button"
        >
          {isDeleting ? 'Deleting...' : '🗑️ Delete'}
        </button>
      </div>
    </div>
  );
};

export default BugItem;
