# Resume Templates

This directory contains example YAML and PDF files for each RenderCV theme.

## Purpose

These files serve as:
- **Reference examples** for RenderCV schema and structure
- **Test data** for PDF generation verification
- **Documentation** of available themes and their output
- **Visual samples** for users to preview themes

## Important Notes

⚠️ **These files are NOT dynamically loaded by the application**

- RenderCV generates PDFs **on-demand** from user data
- Template metadata is configured in `client/src/config/templates.ts`
- Thumbnail images are stored in `client/public/images/`
- The application converts user JSON data to YAML at runtime

## Available Themes

### 1. Classic Theme
**Files:** `John_Doe_ClassicTheme_CV.yaml`, `John_Doe_ClassicTheme_CV.pdf`
- Traditional two-column layout with blue accents
- Professional typography
- Best for: Business professionals, finance, management

### 2. ModernCV Theme
**Files:** `John_Doe_ModerncvTheme_CV.yaml`, `John_Doe_ModerncvTheme_CV.pdf`
- Modern design with sidebar
- Clean and contemporary
- Best for: Software engineers, product managers, tech professionals

### 3. Sb2nov Theme
**Files:** `John_Doe_Sb2novTheme_CV.yaml`, `John_Doe_Sb2novTheme_CV.pdf`
- Popular among software engineers
- Compact layout
- Best for: Developers, tech leads, engineers

### 4. EngineeringResumes Theme
**Files:** `John_Doe_EngineeringresumesTheme_CV.yaml`, `John_Doe_EngineeringresumesTheme_CV.pdf`
- Optimized for technical roles
- Skills and projects highlighted
- Best for: Software engineers, hardware engineers, technical roles

### 5. EngineeringClassic Theme
**Files:** `John_Doe_EngineeringclassicTheme_CV.yaml`, `John_Doe_EngineeringclassicTheme_CV.pdf`
- Academic and research focused
- Publications ready
- Best for: Engineers, researchers, PhD candidates

## How Templates Work in LiveCV

1. **User creates resume** in the frontend form
2. **Frontend sends JSON data** to backend API
3. **Backend converts JSON to YAML** using `jsonToYamlMapper.js`
4. **RenderCV generates PDF** from YAML with selected theme
5. **PDF is cached and returned** to user

## Adding New Themes

To add a new theme to LiveCV:

1. Ensure the theme is supported by RenderCV
2. Add theme configuration to `server/utils/jsonToYamlMapper.js` in `getThemeDesign()`
3. Add template metadata to `client/src/config/templates.ts`
4. Add thumbnail image to `client/public/images/`
5. (Optional) Add example YAML/PDF to this directory for reference

## Testing Templates

To test PDF generation locally:

```bash
cd server
npm run render:local
```

This will generate PDFs for all themes and save them to `server/test-output/`.

## RenderCV Documentation

For more information about RenderCV themes and YAML schema:
- Official docs: https://docs.rendercv.com/
- GitHub: https://github.com/sinaatalay/rendercv
- Theme gallery: https://docs.rendercv.com/user_guide/themes/
