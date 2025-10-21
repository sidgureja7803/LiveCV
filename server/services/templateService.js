const fs = require('fs').promises;
const path = require('path');
const ejs = require('ejs');
const Resume = require('../models/Resume');
const userService = require('./userService');

/**
 * Gets the current resume data for a user
 * @param {string} clerkId - The Clerk user ID
 * @returns {Object} The resume data
 */
async function getCurrentResumeData(clerkId) {
  try {
    // If no clerkId, return default data
    if (!clerkId) {
      return getDefaultResumeData();
    }
    
    // Find user's resume in MongoDB
    const resume = await Resume.findOne({ clerkId }).sort({ updatedAt: -1 });
    
    // If resume exists, return it
    if (resume) {
      return resume.toObject();
    }
    
    // Otherwise return default data
    return getDefaultResumeData();
  } catch (error) {
    console.error('Error getting current resume data:', error);
    throw error;
  }
};

/**
 * Gets default resume data for new users
 * @returns {Object} The default resume data
 */
const getDefaultResumeData = () => {
  return {
    personalInfo: {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(123) 456-7890',
      address: 'New York, NY',
      title: 'Software Engineer',
      linkedIn: 'linkedin.com/in/johndoe',
      github: 'github.com/johndoe',
      website: 'johndoe.com'
    },
    summary: 'Experienced software engineer with a passion for building scalable applications.',
    skills: [
      'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'GraphQL'
    ],
    experience: [
      {
        company: 'Tech Company',
        position: 'Senior Software Engineer',
        location: 'New York, NY',
        startDate: '2020-01',
        endDate: 'Present',
        current: true,
        description: 'Led development of a full-stack web application using React and Node.js.'
      },
      {
        company: 'Startup Inc',
        position: 'Software Engineer',
        location: 'San Francisco, CA',
        startDate: '2018-03',
        endDate: '2019-12',
        current: false,
        description: 'Developed and maintained RESTful APIs using Express and MongoDB.'
      }
    ],
    education: [
      {
        institution: 'University of Technology',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        location: 'Boston, MA',
        startDate: '2014-09',
        endDate: '2018-05',
        gpa: '3.8/4.0'
      }
    ],
    projects: [
      {
        name: 'E-commerce Platform',
        description: 'Built a full-stack e-commerce platform using MERN stack.',
        technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
        githubLink: 'https://github.com/johndoe/ecommerce',
        liveLink: 'https://example.com'
      }
    ]
  };
};

/**
 * Saves resume data for a user
 * @param {Object} resumeData - The resume data to save
 * @param {string} clerkId - The Clerk user ID
 * @returns {Promise<Object>} The saved resume
 */
exports.saveResumeData = async (resumeData, clerkId) => {
  try {
    if (!clerkId) {
      throw new Error('No user ID provided');
    }
    
    // Get the user by clerkId
    const user = await userService.getUserByClerkId(clerkId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Check if user has a resume already
    let resume = await Resume.findOne({ clerkId }).sort({ updatedAt: -1 });
    
    if (resume) {
      // Update existing resume
      Object.assign(resume, { 
        ...resumeData,
        clerkId,
        userId: user._id,
        updatedAt: Date.now()
      });
    } else {
      // Create new resume
      resume = new Resume({
        ...resumeData,
        clerkId,
        userId: user._id
      });
    }
    
    await resume.save();
    return resume;
  } catch (error) {
    console.error('Error saving resume data:', error);
    throw error;
  }
};

/**
 * Gets all resumes for a user
 * @param {string} clerkId - The Clerk user ID
 * @returns {Promise<Array>} Array of resumes
 */
exports.getUserResumes = async (clerkId) => {
  try {
    if (!clerkId) {
      return [];
    }
    
    return await Resume.find({ clerkId }).sort({ updatedAt: -1 });
  } catch (error) {
    console.error('Error getting user resumes:', error);
    throw error;
  }
};

/**
 * Renders a resume template with data
 * @param {string} templateName - The name of the template to render
 * @param {Object} data - The data to inject into the template
 * @returns {Promise<string>} The rendered HTML
 */
exports.renderTemplate = async (templateName, data) => {
  try {
    // Get the template file path
    const templatePath = path.join(__dirname, '..', 'views', 'templates', `${templateName}.ejs`);
    
    // Read the template file
    const template = await fs.readFile(templatePath, 'utf8');
    
    // Render the template with the data
    return ejs.render(template, data);
  } catch (error) {
    console.error('Error rendering template:', error);
    throw error;
  }
};

/**
 * Gets all available resume templates
 * @returns {Promise<Array<Object>>} Array of template objects with id and name
 */
/**
 * Gets all available resume templates
 * @returns {Promise<Array<Object>>} Array of template objects with id and name
 */
async function getAvailableTemplates() {
  try {
    const templatesDir = path.join(__dirname, '..', 'views', 'templates');
    const files = await fs.readdir(templatesDir);
    
    // Filter out non-EJS files and format as template objects
    return files
      .filter(file => file.endsWith('.ejs'))
      .map(file => {
        const templateId = file.replace('.ejs', '');
        return {
          id: templateId,
          name: templateId
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        };
      });
  } catch (error) {
    console.error('Error getting available templates:', error);
    return [{ id: 'default', name: 'Default' }]; // Fallback to default template
  }
}

// Export all functions
exports.getCurrentResumeData = getCurrentResumeData;
exports.getDefaultResumeData = getDefaultResumeData;
exports.getAvailableTemplates = getAvailableTemplates;
