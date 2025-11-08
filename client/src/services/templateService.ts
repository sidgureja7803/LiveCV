import type { ResumeTemplate } from '../types/templates';
import type { ResumeData } from '../types';

export class TemplateService {
  /**
   * Load template HTML from the public templates directory and inject data
   * Note: Currently not used - we generate HTML directly
   */
  static async loadTemplateHTML(templateId: string): Promise<string> {
    // Templates are generated directly, not loaded from files
    console.log(`[TemplateService] Generating HTML for template: ${templateId}`);
    return '';
  }

  /**
   * Generate HTML content based on template and resume data
   */
  static generateTemplateHTML(template: ResumeTemplate, resumeData: ResumeData): string {
    const templateId = template.htmlStructure;
    
    // Use the hardcoded template generators as fallback
    switch (templateId) {
      case 'modern-professional':
        return this.generateModernProfessionalHTML(resumeData);
      case 'creative-portfolio':
        return this.generateCreativePortfolioHTML(resumeData);
      case 'professional-elegant':
        return this.generateProfessionalElegantHTML(resumeData);
      default:
        return this.generateModernProfessionalHTML(resumeData);
    }
  }
  
  /**
   * Process template HTML with resume data
   * This method replaces handlebars-style placeholders with actual data
   */
  static processTemplateWithData(templateHtml: string, data: ResumeData): string {
    let processedHtml = templateHtml;
    
    // Replace basic fields
    processedHtml = processedHtml
      .replace(/{{personalInfo.fullName}}/g, data.personalInfo.fullName)
      .replace(/{{personalInfo.email}}/g, data.personalInfo.email)
      .replace(/{{personalInfo.phone}}/g, data.personalInfo.phone)
      .replace(/{{personalInfo.address}}/g, data.personalInfo.address || '')
      .replace(/{{personalInfo.title}}/g, data.personalInfo.title || '')
      .replace(/{{personalInfo.linkedIn}}/g, data.personalInfo.linkedIn || '')
      .replace(/{{personalInfo.github}}/g, data.personalInfo.github || '')
      .replace(/{{summary}}/g, data.summary);
      
    // Process skills
    if (Array.isArray(data.skills)) {
      processedHtml = processedHtml.replace(/{{skills}}/g, data.skills.join(', '));
    }
    
    // Handle more complex conditionals and loops for experience, education, and projects
    // This is a simplified approach - a real templating engine would be better
    
    // For experience
    let experienceHtml = '';
    data.experience.forEach(exp => {
      const endDate = exp.current ? 'Present' : exp.endDate;
      const expItem = `
        <div class="experience-item">
          <div class="company-info">
            <strong>${exp.company}</strong>
            <span class="duration">${exp.startDate} - ${endDate}</span>
          </div>
          <div class="job-title">${exp.position}</div>
          <ul class="achievements">
            <li>${exp.description}</li>
          </ul>
        </div>
      `;
      experienceHtml += expItem;
    });
    
    // Replace experience section
    processedHtml = processedHtml.replace(
      /{{#each experience}}[\s\S]*?{{\/each}}/gm, 
      experienceHtml
    );
    
    // For education
    let educationHtml = '';
    data.education.forEach(edu => {
      const eduItem = `
        <tr>
          <td>${edu.degree} in ${edu.fieldOfStudy}</td>
          <td>${edu.institution}</td>
          <td>${edu.gpa || ''}</td>
          <td>${edu.startDate} - ${edu.endDate}</td>
        </tr>
      `;
      educationHtml += eduItem;
    });
    
    // Replace education section
    processedHtml = processedHtml.replace(
      /{{#each education}}[\s\S]*?{{\/each}}/gm, 
      educationHtml
    );
    
    // For projects
    if (data.projects && data.projects.length > 0) {
      let projectsHtml = '';
      data.projects.forEach(project => {
        const techString = Array.isArray(project.technologies) ? project.technologies.join(', ') : '';
        const projectItem = `
          <div class="project-item">
            <div class="project-header">
              <strong>${project.name}</strong>
              <span class="project-link">${project.githubLink ? `[<a href="${project.githubLink}">GitHub</a>]` : ''}</span>
            </div>
            <div class="project-tools">Tools: ${techString}</div>
            <ul class="project-details">
              <li>${project.description}</li>
            </ul>
          </div>
        `;
        projectsHtml += projectItem;
      });
      
      // Replace projects section
      processedHtml = processedHtml.replace(
        /{{#if projects}}[\s\S]*?{{\/if}}/gm,
        `<section class="projects-section">
          <h2>Projects</h2>
          ${projectsHtml}
        </section>`
      );
    } else {
      // Remove projects section if no projects
      processedHtml = processedHtml.replace(
        /{{#if projects}}[\s\S]*?{{\/if}}/gm,
        ''
      );
    }
    
    return processedHtml;
  }

  /**
   * Modern Professional Template
   */
  private static generateModernProfessionalHTML(data: ResumeData): string {
    return `
      <div class="modern-professional-template">
        <style>
          .modern-professional-template {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.75in;
            background: white;
            color: #1f2937;
            line-height: 1.5;
          }
          .header { text-align: center; margin-bottom: 2rem; border-bottom: 2px solid #3b82f6; padding-bottom: 1rem; }
          .name { font-size: 2.5rem; font-weight: 700; color: #1e40af; margin-bottom: 0.5rem; }
          .contact { color: #4b5563; font-size: 1rem; }
          .section { margin-bottom: 1.5rem; }
          .section-title { font-size: 1.25rem; font-weight: 600; color: #1e40af; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.25rem; margin-bottom: 0.75rem; }
          .job-title { font-weight: 600; color: #374151; }
          .company { color: #6b7280; font-style: italic; }
          .date { color: #9ca3af; font-size: 0.9rem; }
          .skills-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
          .skill-tag { background: #eff6ff; color: #1d4ed8; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.9rem; }
        </style>
        
        <header class="header">
          <h1 class="name">${data.personalInfo.fullName}</h1>
          <div class="contact">
            ${data.personalInfo.email} • ${data.personalInfo.phone} • ${data.personalInfo.address}
            ${data.personalInfo.linkedIn ? ` • ${data.personalInfo.linkedIn}` : ''}
            ${data.personalInfo.github ? ` • ${data.personalInfo.github}` : ''}
          </div>
        </header>

        <section class="section">
          <h2 class="section-title">Professional Summary</h2>
          <p>${data.summary}</p>
        </section>

        <section class="section">
          <h2 class="section-title">Skills</h2>
          <div class="skills-list">
            ${data.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
          </div>
        </section>

        <section class="section">
          <h2 class="section-title">Experience</h2>
          ${data.experience.map(exp => `
            <div style="margin-bottom: 1rem;">
              <div style="display: flex; justify-content: between; align-items: flex-start;">
                <div>
                  <div class="job-title">${exp.position}</div>
                  <div class="company">${exp.company}</div>
                </div>
                <div class="date">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</div>
              </div>
              <p style="margin-top: 0.5rem;">${exp.description}</p>
            </div>
          `).join('')}
        </section>

        <section class="section">
          <h2 class="section-title">Education</h2>
          ${data.education.map(edu => `
            <div style="margin-bottom: 1rem;">
              <div style="display: flex; justify-content: between;">
                <div>
                  <div class="job-title">${edu.degree} in ${edu.fieldOfStudy}</div>
                  <div class="company">${edu.institution}</div>
                </div>
                <div class="date">${edu.startDate} - ${edu.endDate}</div>
              </div>
              ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
            </div>
          `).join('')}
        </section>

        ${data.projects && data.projects.length > 0 ? `
          <section class="section">
            <h2 class="section-title">Projects</h2>
            ${data.projects.map(project => `
              <div style="margin-bottom: 1rem;">
                <div class="job-title">${project.name}</div>
                <p>${project.description}</p>
                <div class="skills-list">
                  ${project.technologies.map(tech => `<span class="skill-tag">${tech}</span>`).join('')}
                </div>
              </div>
            `).join('')}
          </section>
        ` : ''}
      </div>
    `;
  }

  /**
   * Classic Executive Template
   */
  private static generateClassicExecutiveHTML(data: ResumeData): string {
    return `
      <div class="classic-executive-template">
        <style>
          .classic-executive-template {
            font-family: 'Times New Roman', Times, serif;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 1in;
            background: white;
            color: #000;
            line-height: 1.4;
          }
          .header { text-align: center; margin-bottom: 2rem; }
          .name { font-size: 2rem; font-weight: normal; margin-bottom: 0.5rem; letter-spacing: 1px; }
          .contact { font-size: 0.9rem; }
          .section { margin-bottom: 1.5rem; }
          .section-title { font-size: 1.1rem; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 0.25rem; margin-bottom: 0.75rem; letter-spacing: 0.5px; }
          .job-header { display: flex; justify-content: between; margin-bottom: 0.25rem; }
          .job-title { font-weight: bold; }
          .company { font-weight: normal; }
        </style>
        
        <header class="header">
          <h1 class="name">${data.personalInfo.fullName}</h1>
          <div class="contact">
            ${data.personalInfo.address}<br>
            ${data.personalInfo.phone} • ${data.personalInfo.email}
          </div>
        </header>

        <section class="section">
          <h2 class="section-title">Executive Summary</h2>
          <p>${data.summary}</p>
        </section>

        <section class="section">
          <h2 class="section-title">Professional Experience</h2>
          ${data.experience.map(exp => `
            <div style="margin-bottom: 1.25rem;">
              <div class="job-header">
                <div><span class="job-title">${exp.position}</span>, <span class="company">${exp.company}</span></div>
                <div>${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</div>
              </div>
              <p>${exp.description}</p>
            </div>
          `).join('')}
        </section>

        <section class="section">
          <h2 class="section-title">Education</h2>
          ${data.education.map(edu => `
            <div style="margin-bottom: 0.75rem;">
              <div class="job-header">
                <div><strong>${edu.degree}</strong>, ${edu.fieldOfStudy}, ${edu.institution}</div>
                <div>${edu.endDate}</div>
              </div>
            </div>
          `).join('')}
        </section>

        <section class="section">
          <h2 class="section-title">Core Competencies</h2>
          <p>${data.skills.join(' • ')}</p>
        </section>
      </div>
    `;
  }

  /**
   * Creative Portfolio Template
   */
  private static generateCreativePortfolioHTML(data: ResumeData): string {
    return `
      <div class="creative-portfolio-template">
        <style>
          .creative-portfolio-template {
            font-family: 'Poppins', 'Helvetica Neue', sans-serif;
            max-width: 8.5in;
            margin: 0 auto;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 11in;
          }
          .sidebar { background: rgba(0,0,0,0.2); padding: 2rem; width: 35%; float: left; height: 11in; box-sizing: border-box; }
          .main-content { padding: 2rem; width: 65%; float: right; height: 11in; box-sizing: border-box; }
          .name { font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem; }
          .title { font-size: 1.2rem; opacity: 0.9; margin-bottom: 2rem; }
          .contact-item { margin-bottom: 0.5rem; opacity: 0.9; }
          .section-title { font-size: 1.3rem; font-weight: 600; margin-bottom: 1rem; border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 0.5rem; }
          .skill-item { background: rgba(255,255,255,0.2); margin: 0.25rem; padding: 0.25rem 0.75rem; border-radius: 15px; display: inline-block; }
          .experience-item { margin-bottom: 1.5rem; }
          .job-title { font-weight: 600; font-size: 1.1rem; }
          .company-date { opacity: 0.8; margin-bottom: 0.5rem; }
        </style>
        
        <div class="sidebar">
          <h1 class="name">${data.personalInfo.fullName}</h1>
          <div class="title">Creative Professional</div>
          
          <div class="contact-item">📧 ${data.personalInfo.email}</div>
          <div class="contact-item">📱 ${data.personalInfo.phone}</div>
          <div class="contact-item">📍 ${data.personalInfo.address}</div>
          ${data.personalInfo.linkedIn ? `<div class="contact-item">💼 ${data.personalInfo.linkedIn}</div>` : ''}
          
          <h3 class="section-title">Skills</h3>
          <div>
            ${data.skills.map(skill => `<span class="skill-item">${skill}</span>`).join('')}
          </div>

          <h3 class="section-title">Education</h3>
          ${data.education.map(edu => `
            <div style="margin-bottom: 1rem;">
              <div style="font-weight: 600;">${edu.degree}</div>
              <div style="opacity: 0.8;">${edu.institution}</div>
              <div style="opacity: 0.6; font-size: 0.9rem;">${edu.endDate}</div>
            </div>
          `).join('')}
        </div>

        <div class="main-content">
          <h2 class="section-title">About Me</h2>
          <p style="margin-bottom: 2rem; line-height: 1.6;">${data.summary}</p>

          <h2 class="section-title">Experience</h2>
          ${data.experience.map(exp => `
            <div class="experience-item">
              <div class="job-title">${exp.position}</div>
              <div class="company-date">${exp.company} | ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</div>
              <p style="line-height: 1.5;">${exp.description}</p>
            </div>
          `).join('')}

          ${data.projects && data.projects.length > 0 ? `
            <h2 class="section-title">Portfolio</h2>
            ${data.projects.map(project => `
              <div class="experience-item">
                <div class="job-title">${project.name}</div>
                <p style="line-height: 1.5; margin-bottom: 0.5rem;">${project.description}</p>
                <div>
                  ${project.technologies.map(tech => `<span class="skill-item">${tech}</span>`).join('')}
                </div>
              </div>
            `).join('')}
          ` : ''}
        </div>
        
        <div style="clear: both;"></div>
      </div>
    `;
  }

  /**
   * Tech Minimalist Template
   */
  private static generateTechMinimalistHTML(data: ResumeData): string {
    return `
      <div class="tech-minimalist-template">
        <style>
          .tech-minimalist-template {
            font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 1in;
            background: #0d1117;
            color: #c9d1d9;
            line-height: 1.5;
          }
          .header { margin-bottom: 2rem; }
          .name { font-size: 2rem; color: #58a6ff; margin-bottom: 0.5rem; }
          .contact { color: #8b949e; font-size: 0.9rem; }
          .section { margin-bottom: 2rem; }
          .section-title { font-size: 1.1rem; color: #f85149; margin-bottom: 1rem; }
          .section-title:before { content: '> '; color: #7c3aed; }
          .job-line { display: flex; justify-content: between; margin-bottom: 0.25rem; }
          .job-title { color: #58a6ff; }
          .company { color: #f0883e; }
          .date { color: #8b949e; }
          .skill-tag { background: #21262d; border: 1px solid #30363d; color: #58a6ff; padding: 0.125rem 0.5rem; margin: 0.125rem; border-radius: 3px; font-size: 0.8rem; }
        </style>
        
        <header class="header">
          <h1 class="name">${data.personalInfo.fullName}</h1>
          <div class="contact">
            ${data.personalInfo.email} | ${data.personalInfo.phone} | ${data.personalInfo.address}
            ${data.personalInfo.github ? ` | github.com/${data.personalInfo.github.replace('github.com/', '')}` : ''}
          </div>
        </header>

        <section class="section">
          <h2 class="section-title">about</h2>
          <p>${data.summary}</p>
        </section>

        <section class="section">
          <h2 class="section-title">skills</h2>
          <div>
            ${data.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
          </div>
        </section>

        <section class="section">
          <h2 class="section-title">experience</h2>
          ${data.experience.map(exp => `
            <div style="margin-bottom: 1.5rem;">
              <div class="job-line">
                <div><span class="job-title">${exp.position}</span> @ <span class="company">${exp.company}</span></div>
                <div class="date">${exp.startDate} - ${exp.current ? 'present' : exp.endDate}</div>
              </div>
              <p style="margin-left: 1rem; color: #8b949e;">${exp.description}</p>
            </div>
          `).join('')}
        </section>

        ${data.projects && data.projects.length > 0 ? `
          <section class="section">
            <h2 class="section-title">projects</h2>
            ${data.projects.map(project => `
              <div style="margin-bottom: 1.5rem;">
                <div class="job-title">${project.name}</div>
                <p style="margin-left: 1rem; color: #8b949e; margin-bottom: 0.5rem;">${project.description}</p>
                <div style="margin-left: 1rem;">
                  ${project.technologies.map(tech => `<span class="skill-tag">${tech}</span>`).join('')}
                </div>
              </div>
            `).join('')}
          </section>
        ` : ''}

        <section class="section">
          <h2 class="section-title">education</h2>
          ${data.education.map(edu => `
            <div style="margin-bottom: 1rem;">
              <div class="job-line">
                <div><span class="job-title">${edu.degree}</span> in <span class="company">${edu.fieldOfStudy}</span></div>
                <div class="date">${edu.endDate}</div>
              </div>
              <p style="margin-left: 1rem; color: #8b949e;">${edu.institution}</p>
            </div>
          `).join('')}
        </section>
      </div>
    `;
  }

  // Placeholder implementations for other templates (you can customize these)
  // Instead of recursively calling other template methods, implement basic templates directly
  // to avoid potential stack issues during deep recursion
  private static generateAcademicResearchHTML(data: ResumeData): string {
    // Basic implementation without recursive calls
    return `
      <div class="academic-template">
        <style>
          .academic-template {
            font-family: 'Times New Roman', Times, serif;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 1in;
            background: white;
            color: #000;
            line-height: 1.4;
          }
          .header { text-align: center; margin-bottom: 1.5rem; }
          .name { font-size: 1.8rem; font-weight: normal; margin-bottom: 0.5rem; }
          .section-title { font-size: 1.1rem; font-weight: bold; margin-bottom: 0.5rem; }
        </style>
        <header class="header">
          <h1 class="name">${data.personalInfo.fullName}</h1>
          <div>${data.personalInfo.email} • ${data.personalInfo.phone}</div>
        </header>
        <section>
          <h2 class="section-title">Summary</h2>
          <p>${data.summary}</p>
        </section>
        <!-- Simplified template to reduce complexity -->
      </div>
    `;
  }

  private static generateSalesImpactHTML(data: ResumeData): string {
    // Basic implementation without recursive calls
    return `
      <div class="sales-template">
        <style>
          .sales-template {
            font-family: 'Arial', sans-serif;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.75in;
            background: white;
          }
          .header { text-align: center; margin-bottom: 1rem; }
          .name { font-size: 2rem; font-weight: bold; }
        </style>
        <header class="header">
          <h1 class="name">${data.personalInfo.fullName}</h1>
          <div>${data.personalInfo.email} • ${data.personalInfo.phone}</div>
        </header>
        <section>
          <h2>Professional Summary</h2>
          <p>${data.summary}</p>
        </section>
        <!-- Simplified template to reduce complexity -->
      </div>
    `;
  }

  private static generateStartupEntrepreneurHTML(data: ResumeData): string {
    // Basic implementation without recursive calls
    return `
      <div class="startup-template">
        <style>
          .startup-template {
            font-family: 'Helvetica', sans-serif;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.75in;
            background: white;
          }
          .header { margin-bottom: 1rem; }
          .name { font-size: 2rem; font-weight: bold; }
        </style>
        <header class="header">
          <h1 class="name">${data.personalInfo.fullName}</h1>
          <div>${data.personalInfo.email} • ${data.personalInfo.phone}</div>
        </header>
        <section>
          <h2>About</h2>
          <p>${data.summary}</p>
        </section>
        <!-- Simplified template to reduce complexity -->
      </div>
    `;
  }

  private static generateHealthcareProfessionalHTML(data: ResumeData): string {
    // Basic implementation without recursive calls
    return `
      <div class="healthcare-template">
        <style>
          .healthcare-template {
            font-family: 'Calibri', sans-serif;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.75in;
            background: white;
          }
          .header { margin-bottom: 1rem; }
          .name { font-size: 1.8rem; font-weight: bold; }
        </style>
        <header class="header">
          <h1 class="name">${data.personalInfo.fullName}</h1>
          <div>${data.personalInfo.email} • ${data.personalInfo.phone}</div>
        </header>
        <section>
          <h2>Professional Summary</h2>
          <p>${data.summary}</p>
        </section>
        <!-- Simplified template to reduce complexity -->
      </div>
    `;
  }
  
  /**
   * Professional Elegant Template
   */
  private static generateProfessionalElegantHTML(data: ResumeData): string {
    return `
      <div class="professional-elegant-template">
        <style>
          .professional-elegant-template {
            font-family: 'Baskerville', 'Georgia', serif;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.75in;
            background: white;
            color: #333;
            line-height: 1.5;
          }
          .header { text-align: center; margin-bottom: 2rem; border-bottom: 1px solid #333; padding-bottom: 1rem; }
          .name { font-size: 2.5rem; font-weight: normal; color: #333; margin-bottom: 0.5rem; letter-spacing: 2px; }
          .contact { color: #555; font-size: 0.9rem; }
          .contact span { margin: 0 0.5rem; }
          .section { margin-bottom: 1.5rem; }
          .section-title { font-size: 1.2rem; font-weight: normal; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 0.25rem; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 1px; }
          .company { font-weight: bold; }
          .position { font-style: italic; }
          .date { color: #777; font-size: 0.9rem; }
          .skills { display: flex; flex-wrap: wrap; gap: 1rem; }
          .skill { font-size: 0.9rem; }
        </style>
        
        <header class="header">
          <h1 class="name">${data.personalInfo.fullName}</h1>
          <div class="contact">
            ${data.personalInfo.email} <span>•</span> ${data.personalInfo.phone} <span>•</span> ${data.personalInfo.address}
            ${data.personalInfo.linkedIn ? `<span>•</span> ${data.personalInfo.linkedIn}` : ''}
            ${data.personalInfo.github ? `<span>•</span> ${data.personalInfo.github}` : ''}
          </div>
        </header>

        <section class="section">
          <h2 class="section-title">Summary</h2>
          <p>${data.summary}</p>
        </section>

        <section class="section">
          <h2 class="section-title">Experience</h2>
          ${data.experience.map(exp => `
            <div style="margin-bottom: 1.25rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                <span class="company">${exp.company}</span>
                <span class="date">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <div class="position">${exp.position}</div>
              <p style="margin-top: 0.5rem;">${exp.description}</p>
            </div>
          `).join('')}
        </section>

        <section class="section">
          <h2 class="section-title">Education</h2>
          ${data.education.map(edu => `
            <div style="margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between;">
                <span class="company">${edu.institution}</span>
                <span class="date">${edu.startDate} - ${edu.endDate}</span>
              </div>
              <div class="position">${edu.degree} in ${edu.fieldOfStudy}</div>
              ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ''}
            </div>
          `).join('')}
        </section>

        <section class="section">
          <h2 class="section-title">Skills</h2>
          <div class="skills">
            ${data.skills.map(skill => `<span class="skill">${skill}</span>`).join(' • ')}
          </div>
        </section>

        ${data.projects && data.projects.length > 0 ? `
          <section class="section">
            <h2 class="section-title">Projects</h2>
            ${data.projects.map(project => `
              <div style="margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between;">
                  <span class="company">${project.name}</span>
                </div>
                <p>${project.description}</p>
                <div style="font-size: 0.9rem; margin-top: 0.25rem;">
                  Technologies: ${project.technologies.join(', ')}
                </div>
              </div>
            `).join('')}
          </section>
        ` : ''}
      </div>
    `;
  }
} 