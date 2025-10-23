import type { ResumeData } from '../types';

/**
 * Parse RenderCV YAML content to ResumeData format
 */
export function parseRenderCVYaml(yamlContent: string): Partial<ResumeData> {
  try {
    // Simple YAML parser for RenderCV format
    const lines = yamlContent.split('\n');
    const data: any = {};
    
    // Extract name
    const nameMatch = yamlContent.match(/name:\s*([^\n]+)/);
    const emailMatch = yamlContent.match(/email:\s*([^\n]+)/);
    const phoneMatch = yamlContent.match(/phone:\s*([^\n]+)/);
    const locationMatch = yamlContent.match(/location:\s*([^\n]+)/);
    
    // Extract social networks
    const linkedInMatch = yamlContent.match(/network:\s*LinkedIn[\s\S]*?username:\s*([^\n]+)/);
    const githubMatch = yamlContent.match(/network:\s*GitHub[\s\S]*?username:\s*([^\n]+)/);
    
    // Extract summary
    const summaryMatch = yamlContent.match(/summary:\s*([^\n]+)/);
    
    const resumeData: Partial<ResumeData> = {
      personalInfo: {
        fullName: nameMatch ? nameMatch[1].trim() : 'John Doe',
        email: emailMatch ? emailMatch[1].trim() : 'email@example.com',
        phone: phoneMatch ? phoneMatch[1].trim() : '',
        address: locationMatch ? locationMatch[1].trim() : '',
        linkedIn: linkedInMatch ? linkedInMatch[1].trim() : '',
        github: githubMatch ? githubMatch[1].trim() : ''
      },
      summary: summaryMatch ? summaryMatch[1].trim() : '',
      experience: extractExperience(yamlContent),
      education: extractEducation(yamlContent),
      skills: extractSkills(yamlContent),
      projects: []
    };
    
    return resumeData;
  } catch (error) {
    console.error('Error parsing YAML:', error);
    return {};
  }
}

function extractExperience(yamlContent: string): any[] {
  const experiences: any[] = [];
  
  // Match experience entries
  const experienceSection = yamlContent.match(/experience:([\s\S]*?)(?=\n\w+:|$)/);
  if (!experienceSection) return experiences;
  
  // Split into individual entries (looking for "- company:")
  const entries = experienceSection[1].split(/\n\s*-\s+company:/);
  
  entries.forEach((entry, index) => {
    if (index === 0 && !entry.trim()) return; // Skip empty first entry
    
    const companyMatch = entry.match(/^\s*([^\n]+)/);
    const positionMatch = entry.match(/position:\s*([^\n]+)/);
    const startMatch = entry.match(/start_date:\s*([^\n]+)/);
    const endMatch = entry.match(/end_date:\s*([^\n]+)/);
    const highlightsMatch = entry.match(/highlights:([\s\S]*?)(?=\n\s{0,4}\w+:|$)/);
    
    if (companyMatch) {
      const highlights = highlightsMatch ? 
        highlightsMatch[1]
          .split('\n')
          .filter(line => line.trim().startsWith('-'))
          .map(line => line.replace(/^\s*-\s*/, '').trim())
          .join('\n') : '';
      
      experiences.push({
        id: `exp-${index}`,
        company: companyMatch[1].trim(),
        position: positionMatch ? positionMatch[1].trim() : '',
        startDate: startMatch ? startMatch[1].trim() : '',
        endDate: endMatch ? endMatch[1].trim() : 'Present',
        current: !endMatch || endMatch[1].trim().toLowerCase() === 'present',
        description: highlights
      });
    }
  });
  
  return experiences;
}

function extractEducation(yamlContent: string): any[] {
  const education: any[] = [];
  
  const educationSection = yamlContent.match(/education:([\s\S]*?)(?=\n\w+:|$)/);
  if (!educationSection) return education;
  
  const entries = educationSection[1].split(/\n\s*-\s+institution:/);
  
  entries.forEach((entry, index) => {
    if (index === 0 && !entry.trim()) return;
    
    const institutionMatch = entry.match(/^\s*([^\n]+)/);
    const areaMatch = entry.match(/area:\s*([^\n]+)/);
    const degreeMatch = entry.match(/degree:\s*([^\n]+)/);
    const startMatch = entry.match(/start_date:\s*([^\n]+)/);
    const endMatch = entry.match(/end_date:\s*([^\n]+)/);
    const gpaMatch = entry.match(/gpa:\s*([^\n]+)/);
    
    if (institutionMatch) {
      education.push({
        id: `edu-${index}`,
        institution: institutionMatch[1].trim(),
        degree: degreeMatch ? degreeMatch[1].trim() : '',
        fieldOfStudy: areaMatch ? areaMatch[1].trim() : '',
        startDate: startMatch ? startMatch[1].trim() : '',
        endDate: endMatch ? endMatch[1].trim() : '',
        gpa: gpaMatch ? gpaMatch[1].trim() : ''
      });
    }
  });
  
  return education;
}

function extractSkills(yamlContent: string): string[] {
  const skills: string[] = [];
  
  // Match various skill formats in RenderCV
  const skillsSection = yamlContent.match(/(?:skills|technologies):([\s\S]*?)(?=\n\w+:|$)/);
  if (!skillsSection) return skills;
  
  // Extract skills from bullet points or comma-separated
  const skillLines = skillsSection[1].split('\n');
  skillLines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('-')) {
      const skill = trimmed.replace(/^\s*-\s*/, '').trim();
      if (skill) {
        // Check if it's a labeled skill (e.g., "Languages: Python, Java")
        const labelMatch = skill.match(/^([^:]+):\s*(.+)/);
        if (labelMatch) {
          const skillsList = labelMatch[2].split(',').map(s => s.trim());
          skills.push(...skillsList);
        } else {
          skills.push(skill);
        }
      }
    }
  });
  
  return skills;
}

/**
 * Convert ResumeData to RenderCV YAML format
 */
export function convertToRenderCVYaml(data: ResumeData, theme: string = 'classic'): string {
  const yaml = `cv:
  name: ${data.personalInfo?.fullName || 'John Doe'}
  email: ${data.personalInfo?.email || 'email@example.com'}
  phone: ${data.personalInfo?.phone || ''}
  location: ${data.personalInfo?.address || ''}
  social_networks:
    - network: LinkedIn
      username: ${data.personalInfo?.linkedIn || ''}
    - network: GitHub
      username: ${data.personalInfo?.github || ''}
  summary: ${data.summary || ''}
  
  experience:
${data.experience?.map(exp => `    - company: ${exp.company}
      position: ${exp.position}
      start_date: ${exp.startDate}
      end_date: ${exp.current ? 'present' : exp.endDate}
      highlights:
${exp.description?.split('\n').map(line => `        - ${line}`).join('\n') || '        - Description here'}`).join('\n') || ''}

  education:
${data.education?.map(edu => `    - institution: ${edu.institution}
      degree: ${edu.degree}
      area: ${edu.fieldOfStudy}
      start_date: ${edu.startDate}
      end_date: ${edu.endDate}
      ${edu.gpa ? `gpa: ${edu.gpa}` : ''}`).join('\n') || ''}

  skills:
${data.skills?.map(skill => `    - ${skill}`).join('\n') || ''}

design:
  theme: ${theme}
  color: blue
  page_size: letterpaper
  `;
  
  return yaml;
}
