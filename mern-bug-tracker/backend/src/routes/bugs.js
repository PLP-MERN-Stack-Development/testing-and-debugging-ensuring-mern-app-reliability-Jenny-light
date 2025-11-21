import express from 'express';
import Bug from '../models/Bug.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { 
  validateBugTitle, 
  validateBugDescription, 
  validateStatus,
  validatePriority,
  sanitizeInput 
} from '../utils/validation.js';

const router = express.Router();

// @route   GET /api/bugs
// @desc    Get all bugs
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  // Intentional bug for debugging: Uncomment to test error handling
  // throw new Error('Simulated server error');
  
  const bugs = await Bug.find().sort({ createdAt: -1 });
  
  console.log(`[DEBUG] Fetched ${bugs.length} bugs`); // Debug log
  
  res.status(200).json({
    success: true,
    count: bugs.length,
    data: bugs
  });
}));

// @route   GET /api/bugs/:id
// @desc    Get single bug
// @access  Public
router.get('/:id', asyncHandler(async (req, res, next) => {
  const bug = await Bug.findById(req.params.id);
  
  if (!bug) {
    return next(new AppError(`Bug not found with id of ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: bug
  });
}));

// @route   POST /api/bugs
// @desc    Create new bug
// @access  Public
router.post('/', asyncHandler(async (req, res, next) => {
  const { title, description, status, priority, reportedBy } = req.body;
  
  console.log('[DEBUG] Creating bug:', { title, status, priority }); // Debug log
  
  // Validate inputs
  const titleValidation = validateBugTitle(title);
  if (!titleValidation.valid) {
    return next(new AppError(titleValidation.error, 400));
  }
  
  const descValidation = validateBugDescription(description);
  if (!descValidation.valid) {
    return next(new AppError(descValidation.error, 400));
  }
  
  if (status && !validateStatus(status).valid) {
    return next(new AppError(validateStatus(status).error, 400));
  }
  
  if (priority && !validatePriority(priority).valid) {
    return next(new AppError(validatePriority(priority).error, 400));
  }
  
  // Sanitize inputs
  const sanitizedData = {
    title: sanitizeInput(titleValidation.value),
    description: sanitizeInput(descValidation.value),
    status: status || 'open',
    priority: priority || 'medium',
    reportedBy: sanitizeInput(reportedBy || 'Anonymous')
  };
  
  const bug = await Bug.create(sanitizedData);
  
  res.status(201).json({
    success: true,
    data: bug
  });
}));

// @route   PUT /api/bugs/:id
// @desc    Update bug
// @access  Public
router.put('/:id', asyncHandler(async (req, res, next) => {
  let bug = await Bug.findById(req.params.id);
  
  if (!bug) {
    return next(new AppError(`Bug not found with id of ${req.params.id}`, 404));
  }
  
  // Validate status if provided
  if (req.body.status) {
    const statusValidation = validateStatus(req.body.status);
    if (!statusValidation.valid) {
      return next(new AppError(statusValidation.error, 400));
    }
  }
  
  // Validate priority if provided
  if (req.body.priority) {
    const priorityValidation = validatePriority(req.body.priority);
    if (!priorityValidation.valid) {
      return next(new AppError(priorityValidation.error, 400));
    }
  }
  
  console.log(`[DEBUG] Updating bug ${req.params.id}:`, req.body); // Debug log
  
  bug = await Bug.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: bug
  });
}));

// @route   DELETE /api/bugs/:id
// @desc    Delete bug
// @access  Public
router.delete('/:id', asyncHandler(async (req, res, next) => {
  const bug = await Bug.findById(req.params.id);
  
  if (!bug) {
    return next(new AppError(`Bug not found with id of ${req.params.id}`, 404));
  }
  
  await bug.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {}
  });
}));

export default router;