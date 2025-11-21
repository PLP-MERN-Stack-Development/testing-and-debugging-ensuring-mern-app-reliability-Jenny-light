import { 
    validateBugTitle, 
    validateBugDescription, 
    validateStatus,
    validatePriority,
    sanitizeInput 
  } from '../../src/utils/validation.js';
  
  describe('Validation Utils', () => {
    describe('validateBugTitle', () => {
      test('should validate correct title', () => {
        const result = validateBugTitle('Valid Bug Title');
        expect(result.valid).toBe(true);
        expect(result.value).toBe('Valid Bug Title');
      });
  
      test('should reject empty title', () => {
        const result = validateBugTitle('');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('empty');
      });
  
      test('should reject null title', () => {
        const result = validateBugTitle(null);
        expect(result.valid).toBe(false);
      });
  
      test('should reject title exceeding 100 characters', () => {
        const longTitle = 'a'.repeat(101);
        const result = validateBugTitle(longTitle);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('100');
      });
  
      test('should trim whitespace', () => {
        const result = validateBugTitle('  Title with spaces  ');
        expect(result.valid).toBe(true);
        expect(result.value).toBe('Title with spaces');
      });
    });
  
    describe('validateBugDescription', () => {
      test('should validate correct description', () => {
        const result = validateBugDescription('Valid description');
        expect(result.valid).toBe(true);
      });
  
      test('should reject empty description', () => {
        const result = validateBugDescription('');
        expect(result.valid).toBe(false);
      });
  
      test('should reject description exceeding 500 characters', () => {
        const longDesc = 'a'.repeat(501);
        const result = validateBugDescription(longDesc);
        expect(result.valid).toBe(false);
      });
    });
  
    describe('validateStatus', () => {
      test('should validate correct status', () => {
        expect(validateStatus('open').valid).toBe(true);
        expect(validateStatus('in-progress').valid).toBe(true);
        expect(validateStatus('resolved').valid).toBe(true);
      });
  
      test('should reject invalid status', () => {
        const result = validateStatus('invalid-status');
        expect(result.valid).toBe(false);
      });
    });
  
    describe('validatePriority', () => {
      test('should validate correct priority', () => {
        expect(validatePriority('low').valid).toBe(true);
        expect(validatePriority('medium').valid).toBe(true);
        expect(validatePriority('high').valid).toBe(true);
        expect(validatePriority('critical').valid).toBe(true);
      });
  
      test('should reject invalid priority', () => {
        const result = validatePriority('invalid');
        expect(result.valid).toBe(false);
      });
    });
  
    describe('sanitizeInput', () => {
      test('should remove script tags', () => {
        const malicious = 'alert("xss")Hello';
        const result = sanitizeInput(malicious);
        expect(result).toBe('Hello');
        expect(result).not.toContain('script');
      });
  
      test('should handle non-string input', () => {
        expect(sanitizeInput(123)).toBe(123);
        expect(sanitizeInput(null)).toBe(null);
      });
    });
  });