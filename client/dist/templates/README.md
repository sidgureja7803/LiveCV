# Resume Templates Directory

This directory contains all resume template files including PDFs, HTML structures, and CSS styles.

## Required Files:

### PDF Preview Templates:
- `template-1.pdf` - Modern Professional
- `template-2.pdf` - Classic Executive  
- `template-3.pdf` - Creative Portfolio
- `template-4.pdf` - Tech Minimalist
- `template-5.pdf` - Academic Research
- `template-6.pdf` - Sales Impact
- `template-7.pdf` - Startup Entrepreneur
- `template-8.pdf` - Healthcare Professional

### HTML & CSS Template Files:
- `modern-professional.html` & `modern-professional.css` - Modern Professional template
- `professional-elegant.html` & `professional-elegant.css` - Classic Executive template
- `creative-portfolio.html` & `creative-portfolio.css` - Creative Portfolio template
- Additional HTML/CSS files for other templates

### Thumbnail Images (Optional):
- `template-1-thumb.jpg` - Thumbnail for template 1
- `template-2-thumb.jpg` - Thumbnail for template 2
- ... and so on for all 8 templates

## Template Categories:
- **Modern**: Templates 1, 4, 7 (Modern Professional, Tech Minimalist, Startup Entrepreneur)
- **Professional**: Templates 2, 5, 6, 8 (Classic Executive, Academic Research, Sales Impact, Healthcare)
- **Creative**: Template 3 (Creative Portfolio)
- **Classic**: Template 2 (Classic Executive)

## Notes:
- PDF files are used as preview images in the template selector
- HTML and CSS files contain the actual template structure and styling used for rendering resumes
- HTML templates use a Handlebars-like syntax for dynamic data insertion
- Thumbnail images should be approximately 300x400 pixels
- If thumbnails are not provided, the system will use PDF previews

## HTML Template Structure
The HTML templates use placeholders like `{{fullName}}` and `{{jobTitle}}` which get replaced with actual user data. Template sections include:

- Personal information (name, title, contact details)
- Professional summary
- Work experience
- Education
- Skills
- Projects (optional)
- Certifications (optional)

Conditional sections use Handlebars-style `{{#if}}...{{/if}}` syntax.

## Usage
The template system loads these files and makes them available in the template selector. When a user selects a template, the application:

1. Loads the corresponding HTML template
2. Applies the CSS styles
3. Injects the user's resume data
4. Renders the final resume for preview and download