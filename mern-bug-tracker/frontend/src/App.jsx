import { useState, useEffect } from 'react';
import BugForm from './components/BugForm';
import BugList from './components/BugList';
import ErrorBoundary from './components/ErrorBoundary';
import { bugAPI } from './services/api';
import './App.css';

function App() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bugs on mount
  useEffect(() => {
    fetchBugs();
  }, []);

  const fetchBugs = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('[App] Fetching bugs...');
      
      const response = await bugAPI.getAllBugs();
      setBugs(response.data);
      
      console.log('[App] Bugs fetched successfully:', response.data.length);
    } catch (err) {
      console.error('[App] Error fetching bugs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBug = async (bugData) => {
    console.log('[App] Creating new bug:', bugData);
    
    try {
      const response = await bugAPI.createBug(bugData);
      setBugs(prev => [response.data, ...prev]);
      
      console.log('[App] Bug created successfully:', response.data);
      alert('Bug reported successfully!');
    } catch (err) {
      console.error('[App] Error creating bug:', err);
      throw err;
    }
  };

  const handleStatusChange = async (bugId, newStatus) => {
    console.log(`[App] Updating bug ${bugId} status to ${newStatus}`);
    
    try {
      const response = await bugAPI.updateBug(bugId, { status: newStatus });
      
      setBugs(prev => prev.map(bug => 
        bug._id === bugId ? response.data : bug
      ));
      
      console.log('[App] Bug updated successfully');
    } catch (err) {
      console.error('[App] Error updating bug:', err);
      alert(`Failed to update bug: ${err.message}`);
    }
  };

  const handleDelete = async (bugId) => {
    console.log(`[App] Deleting bug ${bugId}`);
    
    try {
      await bugAPI.deleteBug(bugId);
      setBugs(prev => prev.filter(bug => bug._id !== bugId));
      
      console.log('[App] Bug deleted successfully');
    } catch (err) {
      console.error('[App] Error deleting bug:', err);
      alert(`Failed to delete bug: ${err.message}`);
    }
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <header className="app-header">
          <h1>🐛 Bug Tracker</h1>
          <p>Track and manage software bugs efficiently</p>
        </header>

        <main className="app-main">
          <div className="container">
            <BugForm onSubmit={handleCreateBug} />
            
            <BugList
              bugs={bugs}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              loading={loading}
              error={error}
            />
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
