const YAML = require('yaml');

/**
 * Maps frontend Resume JSON data to RenderCV YAML schema
 * @param {Object} resumeData - Frontend resume data structure
 * @param {string} theme - RenderCV theme (classic, moderncv, sb2nov, engineering, etc.)
 * @returns {string} YAML string compatible with RenderCV
 */
function mapJsonToRenderCVYaml(resumeData, theme = 'classic') {
  const { personalInfo, summary, experience, education, skills, projects } = resumeData;
  
  // Build social networks array
  const socialNetworks = [];
  if (personalInfo.linkedIn) {
    socialNetworks.push({
      network: 'LinkedIn',
      username: personalInfo.linkedIn.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/(in\/)?/, '')
    });
  }
  if (personalInfo.github) {
    socialNetworks.push({
      network: 'GitHub',
      username: personalInfo.github.replace(/^(https?:\/\/)?(www\.)?github\.com\//, '')
    });
  }
  
  // Map experience entries
  const experienceEntries = (experience || []).map(exp => {
    const entry = {
      company: exp.company || 'Company Name',
      position: exp.position || 'Position',
      location: exp.location || '',
      highlights: exp.description ? [exp.description] : []
    };
    
    // Handle dates
    if (exp.startDate) {
      entry.start_date = formatDateForRenderCV(exp.startDate);
    }
    if (exp.current) {
      entry.end_date = 'present';
    } else if (exp.endDate) {
      entry.end_date = formatDateForRenderCV(exp.endDate);
    }
    
    return entry;
  });
  
  // Map education entries
  const educationEntries = (education || []).map(edu => {
    const entry = {
      institution: edu.institution || 'University Name',
      area: edu.fieldOfStudy || 'Field of Study',
      degree: edu.degree || 'Degree',
      location: edu.location || ''
    };
    
    if (edu.startDate) {
      entry.start_date = formatDateForRenderCV(edu.startDate);
    }
    if (edu.endDate) {
      entry.end_date = formatDateForRenderCV(edu.endDate);
    }
    
    const highlights = [];
    if (edu.gpa) {
      highlights.push(`GPA: ${edu.gpa}`);
    }
    if (highlights.length > 0) {
      entry.highlights = highlights;
    }
    
    return entry;
  });
  
  // Map projects entries
  const projectEntries = (projects || []).map(proj => {
    const entry = {
      name: proj.name || 'Project Name',
      highlights: []
    };
    
    if (proj.description) {
      entry.highlights.push(proj.description);
    }
    
    if (proj.technologies && proj.technologies.length > 0) {
      entry.highlights.push(`Technologies: ${proj.technologies.join(', ')}`);
    }
    
    if (proj.githubLink) {
      entry.highlights.push(`GitHub: ${proj.githubLink}`);
    }
    
    if (proj.liveLink) {
      entry.highlights.push(`Live: ${proj.liveLink}`);
    }
    
    return entry;
  });
  
  // Map skills to RenderCV one-line entry format
  const skillEntries = [];
  if (skills && skills.length > 0) {
    skillEntries.push({
      label: 'Technical Skills',
      details: skills.join(', ')
    });
  }
  
  // Build the RenderCV data structure
  const rendercvData = {
    cv: {
      name: personalInfo.fullName || 'Your Name',
      location: personalInfo.address || '',
      email: personalInfo.email || 'email@example.com',
      phone: personalInfo.phone || '',
      website: personalInfo.website || '',
      social_networks: socialNetworks,
      sections: {}
    },
    design: getThemeDesign(theme),
    locale: getDefaultLocale()
  };
  
  // Add summary if present
  if (summary) {
    rendercvData.cv.sections.summary = [summary];
  }
  
  // Add sections in order
  if (educationEntries.length > 0) {
    rendercvData.cv.sections.education = educationEntries;
  }
  
  if (experienceEntries.length > 0) {
    rendercvData.cv.sections.experience = experienceEntries;
  }
  
  if (projectEntries.length > 0) {
    rendercvData.cv.sections.projects = projectEntries;
  }
  
  if (skillEntries.length > 0) {
    rendercvData.cv.sections.skills = skillEntries;
  }
  
  // Convert to YAML
  return YAML.stringify(rendercvData);
}

/**
 * Formats date from 'YYYY-MM' or ISO format to RenderCV format 'YYYY-MM'
 */
function formatDateForRenderCV(dateString) {
  if (!dateString) return '';
  
  // If already in YYYY-MM format
  if (/^\d{4}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  // If in ISO format, extract year and month
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }
  
  return dateString;
}

/**
 * Returns theme-specific design configuration
 */
function getThemeDesign(theme) {
  const designs = {
    classic: {
      theme: 'classic',
      page: {
        size: 'us-letter',
        top_margin: '2cm',
        bottom_margin: '2cm',
        left_margin: '2cm',
        right_margin: '2cm',
        show_page_numbering: false,
        show_last_updated_date: true
      },
      colors: {
        text: 'rgb(0, 0, 0)',
        name: 'rgb(0, 79, 144)',
        connections: 'rgb(0, 79, 144)',
        section_titles: 'rgb(0, 79, 144)',
        links: 'rgb(0, 79, 144)',
        last_updated_date_and_page_numbering: 'rgb(128, 128, 128)'
      },
      text: {
        font_family: 'Source Sans 3',
        font_size: '10pt',
        leading: '0.6em',
        alignment: 'justified'
      }
    },
    moderncv: {
      theme: 'moderncv',
      page: {
        size: 'us-letter',
        top_margin: '2cm',
        bottom_margin: '2cm',
        left_margin: '2cm',
        right_margin: '2cm'
      }
    },
    sb2nov: {
      theme: 'sb2nov',
      page: {
        size: 'us-letter',
        top_margin: '2cm',
        bottom_margin: '2cm',
        left_margin: '2cm',
        right_margin: '2cm'
      }
    },
    engineeringresumes: {
      theme: 'engineeringresumes',
      page: {
        size: 'us-letter',
        top_margin: '2cm',
        bottom_margin: '2cm',
        left_margin: '2cm',
        right_margin: '2cm'
      }
    },
    engineeringclassic: {
      theme: 'engineeringresumes',
      page: {
        size: 'us-letter',
        top_margin: '2cm',
        bottom_margin: '2cm',
        left_margin: '2cm',
        right_margin: '2cm'
      }
    }
  };
  
  return designs[theme] || designs.classic;
}

/**
 * Returns default locale configuration
 */
function getDefaultLocale() {
  return {
    language: 'en',
    phone_number_format: 'national',
    date_template: 'MONTH_ABBREVIATION YEAR',
    month: 'month',
    months: 'months',
    year: 'year',
    years: 'years',
    present: 'present',
    to: '–',
    abbreviations_for_months: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
      'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
    ]
  };
}

/**
 * Validates RenderCV YAML structure
 * @param {string} yamlString - YAML string to validate
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateRenderCVYaml(yamlString) {
  const errors = [];
  
  try {
    const parsed = YAML.parse(yamlString);
    
    // Check required fields
    if (!parsed.cv) {
      errors.push('Missing required "cv" section');
    } else {
      if (!parsed.cv.name) errors.push('Missing cv.name');
      if (!parsed.cv.email) errors.push('Missing cv.email');
    }
    
    if (!parsed.design) {
      errors.push('Missing required "design" section');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  } catch (error) {
    return {
      valid: false,
      errors: [`YAML parse error: ${error.message}`]
    };
  }
}

module.exports = {
  mapJsonToRenderCVYaml,
  validateRenderCVYaml,
  formatDateForRenderCV
};
