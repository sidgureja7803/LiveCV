/**
 * Mock PDF generator for testing purposes
 * This creates a simple PDF blob when the backend is not available
 */

export const generateMockPDF = (resumeData: any, theme: string = 'classic'): Blob => {
  // Create a simple PDF-like content using canvas and converting to blob
  // For now, we'll create an HTML that looks more like a PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Resume - ${resumeData.personalInfo?.fullName || 'Resume'}</title>
      <style>
        @page { margin: 0.5in; size: letter; }
        body { 
          font-family: 'Times New Roman', serif; 
          margin: 0; 
          padding: 20px;
          line-height: 1.4; 
          color: #000;
          background: white;
          font-size: 11pt;
        }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 15px; }
        .name { font-size: 18pt; font-weight: bold; margin-bottom: 8px; color: #2c3e50; }
        .contact { font-size: 10pt; color: #555; margin-bottom: 10px; }
        .section { margin-bottom: 18px; page-break-inside: avoid; }
        .section-title { 
          font-size: 12pt; 
          font-weight: bold; 
          border-bottom: 1px solid #2c3e50; 
          margin-bottom: 10px; 
          padding-bottom: 2px;
          color: #2c3e50;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .experience-item, .education-item, .project-item { 
          margin-bottom: 12px; 
          padding-left: 0;
        }
        .job-title { font-weight: bold; font-size: 11pt; }
        .company { font-style: italic; color: #555; font-size: 10pt; }
        .date { float: right; color: #666; font-size: 10pt; }
        .description { margin-top: 4px; font-size: 10pt; text-align: justify; }
        .skills { margin-top: 8px; }
        .skill { 
          display: inline-block;
          background: #f8f9fa; 
          padding: 3px 8px; 
          margin: 2px 4px 2px 0;
          border-radius: 3px; 
          font-size: 9pt;
          border: 1px solid #e9ecef;
        }
        .clearfix::after { content: ""; display: table; clear: both; }
        .theme-${theme} .section-title { color: ${theme === 'moderncv' ? '#e74c3c' : theme === 'sb2nov' ? '#3498db' : '#2c3e50'}; }
      </style>
    </head>
    <body class="theme-${theme}">
      <div class="header">
        <div class="name">${resumeData.personalInfo?.fullName || 'Your Name'}</div>
        <div class="contact">
          ${resumeData.personalInfo?.email || 'email@example.com'}
          ${resumeData.personalInfo?.phone ? ` • ${resumeData.personalInfo.phone}` : ''}
          ${resumeData.personalInfo?.address ? ` • ${resumeData.personalInfo.address}` : ''}
        </div>
        ${resumeData.personalInfo?.linkedIn || resumeData.personalInfo?.github ? `
          <div class="contact">
            ${resumeData.personalInfo?.linkedIn ? `LinkedIn: ${resumeData.personalInfo.linkedIn}` : ''}
            ${resumeData.personalInfo?.linkedIn && resumeData.personalInfo?.github ? ' • ' : ''}
            ${resumeData.personalInfo?.github ? `GitHub: ${resumeData.personalInfo.github}` : ''}
          </div>
        ` : ''}
      </div>

      ${resumeData.summary ? `
        <div class="section">
          <div class="section-title">Professional Summary</div>
          <p style="margin: 0; text-align: justify;">${resumeData.summary}</p>
        </div>
      ` : ''}

      ${resumeData.experience?.length ? `
        <div class="section">
          <div class="section-title">Professional Experience</div>
          ${resumeData.experience.map((exp: any) => `
            <div class="experience-item clearfix">
              <div class="job-title">${exp.position || 'Position'}</div>
              <div class="company">${exp.company || 'Company'} <span class="date">${exp.startDate || 'Start'} - ${exp.current ? 'Present' : exp.endDate || 'End'}</span></div>
              <div class="description">${(exp.description || 'Job description...').replace(/\n/g, '<br>')}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${resumeData.education?.length ? `
        <div class="section">
          <div class="section-title">Education</div>
          ${resumeData.education.map((edu: any) => `
            <div class="education-item clearfix">
              <div class="job-title">${edu.degree || 'Degree'} in ${edu.fieldOfStudy || 'Field of Study'}</div>
              <div class="company">${edu.institution || 'Institution'} <span class="date">${edu.endDate || 'Graduation Date'}</span></div>
              ${edu.gpa ? `<div style="font-size: 10pt; margin-top: 2px;">GPA: ${edu.gpa}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${resumeData.skills?.length ? `
        <div class="section">
          <div class="section-title">Technical Skills</div>
          <div class="skills">
            ${resumeData.skills.map((skill: string) => `<span class="skill">${skill}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      ${resumeData.projects?.length ? `
        <div class="section">
          <div class="section-title">Projects</div>
          ${resumeData.projects.map((project: any) => `
            <div class="project-item">
              <div class="job-title">${project.name || 'Project Name'}</div>
              <div class="description">${project.description || 'Project description...'}</div>
              ${project.technologies?.length ? `<div style="font-size: 10pt; margin-top: 4px;"><strong>Technologies:</strong> ${project.technologies.join(', ')}</div>` : ''}
              ${project.githubLink ? `<div style="font-size: 10pt; margin-top: 2px;"><strong>GitHub:</strong> ${project.githubLink}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div style="margin-top: 30px; text-align: center; color: #999; font-size: 8pt; border-top: 1px solid #eee; padding-top: 10px;">
        Generated with LiveCV • Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}
      </div>
    </body>
    </html>
  `;

  // Convert HTML to blob with proper MIME type for PDF-like rendering
  const blob = new Blob([htmlContent], { type: 'text/html' });
  return blob;
};

export const createMockPdfUrl = (resumeData: any, theme: string = 'classic'): string => {
  const pdfBlob = generateMockPDF(resumeData, theme);
  return URL.createObjectURL(pdfBlob);
};