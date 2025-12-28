/**
 * Input Validation Utility
 * Provides validation functions for resume data, themes, and other inputs
 */

const logger = require('./logger');

// Supported RenderCV themes
const SUPPORTED_THEMES = [
  'classic',
  'moderncv',
  'sb2nov',
  'engineeringresumes',
  'engineeringclassic'
];

/**
 * Sanitize string input to prevent XSS and injection attacks
 */
function sanitizeString(input) {
  if (typeof input !== 'string') {
    return input;
  }
  
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
function isValidURL(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Validate phone number format (basic validation)
 */
function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  
  // Allow various phone formats
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/**
 * Validate theme parameter
 */
function validateTheme(theme) {
  if (!theme) {
    return {
      valid: true,
      theme: 'classic', // Default theme
      message: 'No theme provided, using default (classic)'
    };
  }
  
  if (typeof theme !== 'string') {
    return {
      valid: false,
      error: 'Theme must be a string',
      code: 'INVALID_THEME_TYPE'
    };
  }
  
  const normalizedTheme = theme.toLowerCase().trim();
  
  if (!SUPPORTED_THEMES.includes(normalizedTheme)) {
    return {
      valid: false,
      error: `Unsupported theme: ${theme}. Supported themes: ${SUPPORTED_THEMES.join(', ')}`,
      code: 'UNSUPPORTED_THEME',
      supportedThemes: SUPPORTED_THEMES
    };
  }
  
  return {
    valid: true,
    theme: normalizedTheme
  };
}

/**
 * Validate personal information section
 */
function validatePersonalInfo(personalInfo) {
  const errors = [];
  
  if (!personalInfo || typeof personalInfo !== 'object') {
    return {
      valid: false,
      errors: ['Personal information is required']
    };
  }
  
  // Required fields
  if (!personalInfo.fullName || personalInfo.fullName.trim() === '') {
    errors.push('Full name is required');
  }
  
  if (!personalInfo.email || !isValidEmail(personalInfo.email)) {
    errors.push('Valid email address is required');
  }
  
  // Optional fields validation
  if (personalInfo.phone && !isValidPhone(personalInfo.phone)) {
    errors.push('Invalid phone number format');
  }
  
  if (personalInfo.linkedIn && !isValidURL(personalInfo.linkedIn)) {
    errors.push('Invalid LinkedIn URL');
  }
  
  if (personalInfo.github && !isValidURL(personalInfo.github)) {
    errors.push('Invalid GitHub URL');
  }
  
  if (personalInfo.website && !isValidURL(personalInfo.website)) {
    errors.push('Invalid website URL');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate experience entry
 */
function validateExperience(experience) {
  const errors = [];
  
  if (!experience.company || experience.company.trim() === '') {
    errors.push('Company name is required');
  }
  
  if (!experience.position || experience.position.trim() === '') {
    errors.push('Position/title is required');
  }
  
  if (!experience.startDate) {
    errors.push('Start date is required');
  }
  
  if (!experience.current && !experience.endDate) {
    errors.push('End date is required for past positions');
  }
  
  if (!experience.description || experience.description.trim() === '') {
    errors.push('Job description is required');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate education entry
 */
function validateEducation(education) {
  const errors = [];
  
  if (!education.institution || education.institution.trim() === '') {
    errors.push('Institution name is required');
  }
  
  if (!education.degree || education.degree.trim() === '') {
    errors.push('Degree is required');
  }
  
  if (!education.fieldOfStudy || education.fieldOfStudy.trim() === '') {
    errors.push('Field of study is required');
  }
  
  if (!education.startDate) {
    errors.push('Start date is required');
  }
  
  if (!education.endDate) {
    errors.push('End date is required');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate project entry
 */
function validateProject(project) {
  const errors = [];
  
  if (!project.name || project.name.trim() === '') {
    errors.push('Project name is required');
  }
  
  if (!project.description || project.description.trim() === '') {
    errors.push('Project description is required');
  }
  
  if (project.githubLink && !isValidURL(project.githubLink)) {
    errors.push('Invalid GitHub link');
  }
  
  if (project.liveLink && !isValidURL(project.liveLink)) {
    errors.push('Invalid live link');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate complete resume data structure
 */
function validateResumeData(resumeData) {
  const errors = [];
  const warnings = [];
  
  if (!resumeData || typeof resumeData !== 'object') {
    return {
      valid: false,
      errors: ['Resume data must be an object'],
      warnings: []
    };
  }
  
  // Validate personal info (required)
  const personalInfoValidation = validatePersonalInfo(resumeData.personalInfo);
  if (!personalInfoValidation.valid) {
    errors.push(...personalInfoValidation.errors.map(e => `Personal Info: ${e}`));
  }
  
  // Validate experience entries (optional but validate if present)
  if (resumeData.experience && Array.isArray(resumeData.experience)) {
    if (resumeData.experience.length === 0) {
      warnings.push('No work experience provided');
    } else {
      resumeData.experience.forEach((exp, index) => {
        const expValidation = validateExperience(exp);
        if (!expValidation.valid) {
          errors.push(...expValidation.errors.map(e => `Experience ${index + 1}: ${e}`));
        }
      });
    }
  } else {
    warnings.push('No work experience section found');
  }
  
  // Validate education entries (optional but validate if present)
  if (resumeData.education && Array.isArray(resumeData.education)) {
    if (resumeData.education.length === 0) {
      warnings.push('No education provided');
    } else {
      resumeData.education.forEach((edu, index) => {
        const eduValidation = validateEducation(edu);
        if (!eduValidation.valid) {
          errors.push(...eduValidation.errors.map(e => `Education ${index + 1}: ${e}`));
        }
      });
    }
  } else {
    warnings.push('No education section found');
  }
  
  // Validate projects (optional but validate if present)
  if (resumeData.projects && Array.isArray(resumeData.projects)) {
    resumeData.projects.forEach((project, index) => {
      const projectValidation = validateProject(project);
      if (!projectValidation.valid) {
        errors.push(...projectValidation.errors.map(e => `Project ${index + 1}: ${e}`));
      }
    });
  }
  
  // Validate skills (optional)
  if (resumeData.skills && !Array.isArray(resumeData.skills)) {
    errors.push('Skills must be an array');
  } else if (resumeData.skills && resumeData.skills.length === 0) {
    warnings.push('No skills provided');
  }
  
  // Validate theme if present
  if (resumeData.rendercvTheme) {
    const themeValidation = validateTheme(resumeData.rendercvTheme);
    if (!themeValidation.valid) {
      errors.push(themeValidation.error);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Sanitize resume data to prevent XSS and injection attacks
 */
function sanitizeResumeData(resumeData) {
  if (!resumeData || typeof resumeData !== 'object') {
    return resumeData;
  }
  
  const sanitized = { ...resumeData };
  
  // Sanitize personal info
  if (sanitized.personalInfo) {
    sanitized.personalInfo = {
      ...sanitized.personalInfo,
      fullName: sanitizeString(sanitized.personalInfo.fullName),
      email: sanitizeString(sanitized.personalInfo.email),
      phone: sanitizeString(sanitized.personalInfo.phone),
      location: sanitizeString(sanitized.personalInfo.location),
      linkedIn: sanitizeString(sanitized.personalInfo.linkedIn),
      github: sanitizeString(sanitized.personalInfo.github),
      website: sanitizeString(sanitized.personalInfo.website)
    };
  }
  
  // Sanitize summary
  if (sanitized.summary) {
    sanitized.summary = sanitizeString(sanitized.summary);
  }
  
  // Sanitize experience
  if (sanitized.experience && Array.isArray(sanitized.experience)) {
    sanitized.experience = sanitized.experience.map(exp => ({
      ...exp,
      company: sanitizeString(exp.company),
      position: sanitizeString(exp.position),
      location: sanitizeString(exp.location),
      description: sanitizeString(exp.description)
    }));
  }
  
  // Sanitize education
  if (sanitized.education && Array.isArray(sanitized.education)) {
    sanitized.education = sanitized.education.map(edu => ({
      ...edu,
      institution: sanitizeString(edu.institution),
      degree: sanitizeString(edu.degree),
      fieldOfStudy: sanitizeString(edu.fieldOfStudy),
      location: sanitizeString(edu.location)
    }));
  }
  
  // Sanitize projects
  if (sanitized.projects && Array.isArray(sanitized.projects)) {
    sanitized.projects = sanitized.projects.map(project => ({
      ...project,
      name: sanitizeString(project.name),
      description: sanitizeString(project.description),
      githubLink: sanitizeString(project.githubLink),
      liveLink: sanitizeString(project.liveLink)
    }));
  }
  
  // Sanitize skills
  if (sanitized.skills && Array.isArray(sanitized.skills)) {
    sanitized.skills = sanitized.skills.map(skill => sanitizeString(skill));
  }
  
  return sanitized;
}

/**
 * Express middleware for validating resume data
 */
function validateResumeMiddleware(req, res, next) {
  const resumeData = req.body;
  
  // Validate resume data
  const validation = validateResumeData(resumeData);
  
  if (!validation.valid) {
    logger.warn('Resume validation failed', {
      requestId: req.requestId,
      userId: req.user?.id || req.clerkId || 'anonymous',
      errors: validation.errors
    });
    
    return res.status(400).json({
      success: false,
      message: 'Resume data validation failed',
      errors: validation.errors,
      warnings: validation.warnings
    });
  }
  
  // Log warnings if any
  if (validation.warnings.length > 0) {
    logger.info('Resume validation warnings', {
      requestId: req.requestId,
      userId: req.user?.id || req.clerkId || 'anonymous',
      warnings: validation.warnings
    });
  }
  
  // Sanitize the data
  req.body = sanitizeResumeData(resumeData);
  
  next();
}

/**
 * Express middleware for validating theme parameter
 */
function validateThemeMiddleware(req, res, next) {
  const theme = req.query.theme || req.body.theme;
  
  if (!theme) {
    // No theme provided, will use default
    next();
    return;
  }
  
  const validation = validateTheme(theme);
  
  if (!validation.valid) {
    logger.warn('Theme validation failed', {
      requestId: req.requestId,
      theme,
      error: validation.error
    });
    
    return res.status(400).json({
      success: false,
      message: validation.error,
      code: validation.code,
      supportedThemes: validation.supportedThemes
    });
  }
  
  // Update the theme in request
  if (req.query.theme) {
    req.query.theme = validation.theme;
  }
  if (req.body.theme) {
    req.body.theme = validation.theme;
  }
  
  next();
}

module.exports = {
  SUPPORTED_THEMES,
  sanitizeString,
  isValidEmail,
  isValidURL,
  isValidPhone,
  validateTheme,
  validatePersonalInfo,
  validateExperience,
  validateEducation,
  validateProject,
  validateResumeData,
  sanitizeResumeData,
  validateResumeMiddleware,
  validateThemeMiddleware
};
