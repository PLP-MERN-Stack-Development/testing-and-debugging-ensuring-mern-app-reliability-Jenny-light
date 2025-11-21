// Helper functions for validation
export const validateBugTitle = (title) => {
    if (!title || typeof title !== 'string') {
      return { valid: false, error: 'Title is required and must be a string' };
    }
    
    const trimmedTitle = title.trim();
    if (trimmedTitle.length === 0) {
      return { valid: false, error: 'Title cannot be empty' };
    }
    
    if (trimmedTitle.length > 100) {
      return { valid: false, error: 'Title cannot exceed 100 characters' };
    }
    
    return { valid: true, value: trimmedTitle };
  };
  
  export const validateBugDescription = (description) => {
    if (!description || typeof description !== 'string') {
      return { valid: false, error: 'Description is required and must be a string' };
    }
    
    const trimmedDesc = description.trim();
    if (trimmedDesc.length === 0) {
      return { valid: false, error: 'Description cannot be empty' };
    }
    
    if (trimmedDesc.length > 500) {
      return { valid: false, error: 'Description cannot exceed 500 characters' };
    }
    
    return { valid: true, value: trimmedDesc };
  };
  
  export const validateStatus = (status) => {
    const validStatuses = ['open', 'in-progress', 'resolved'];
    if (!validStatuses.includes(status)) {
      return { valid: false, error: `Status must be one of: ${validStatuses.join(', ')}` };
    }
    return { valid: true, value: status };
  };
  
  export const validatePriority = (priority) => {
    const validPriorities = ['low', 'medium', 'high', 'critical'];
    if (!validPriorities.includes(priority)) {
      return { valid: false, error: `Priority must be one of: ${validPriorities.join(', ')}` };
    }
    return { valid: true, value: priority };
  };
  
  export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    // Remove potential XSS attempts
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  };
  