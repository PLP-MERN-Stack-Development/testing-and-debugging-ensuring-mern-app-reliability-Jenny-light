import { useState } from 'react';
import './BugForm.css';

const BugForm = ({ onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'medium',
    reportedBy: initialData?.reportedBy || ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    
    if (!formData.reportedBy.trim()) {
      newErrors.reportedBy = 'Reporter name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('[BugForm] Validating form data:', formData);
    
    if (!validateForm()) {
      console.log('[BugForm] Validation failed:', errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      
      // Reset form after successful submission
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        reportedBy: ''
      });
      setErrors({});
    } catch (error) {
      console.error('[BugForm] Submission error:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bug-form-container">
      <h2>{initialData ? 'Edit Bug' : 'Report New Bug'}</h2>
      
      <form onSubmit={handleSubmit} className="bug-form" data-testid="bug-form">
        {errors.submit && (
          <div className="error-message submit-error" role="alert">
            {errors.submit}
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="title">
            Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'error' : ''}
            placeholder="Brief description of the bug"
            data-testid="title-input"
          />
          {errors.title && (
            <span className="error-message" role="alert">{errors.title}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">
            Description <span className="required">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? 'error' : ''}
            placeholder="Detailed description of the bug"
            rows="5"
            data-testid="description-input"
          />
          {errors.description && (
            <span className="error-message" role="alert">{errors.description}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            data-testid="priority-select"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="reportedBy">
            Reported By <span className="required">*</span>
          </label>
          <input
            type="text"
            id="reportedBy"
            name="reportedBy"
            value={formData.reportedBy}
            onChange={handleChange}
            className={errors.reportedBy ? 'error' : ''}
            placeholder="Your name"
            data-testid="reporter-input"
          />
          {errors.reportedBy && (
            <span className="error-message" role="alert">{errors.reportedBy}</span>
          )}
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
          data-testid="submit-button"
        >
          {isSubmitting ? 'Submitting...' : (initialData ? 'Update Bug' : 'Report Bug')}
        </button>
      </form>
    </div>
  );
};

export default BugForm;
