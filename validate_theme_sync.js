#!/usr/bin/env node

/**
 * Validate theme synchronization between client and server
 */

const fs = require('fs');
const path = require('path');

console.log('='.repeat(60));
console.log('Theme Synchronization Validation');
console.log('='.repeat(60));
console.log();

// Read client template configuration
const clientTemplatesPath = path.join(__dirname, 'client/src/config/templates.ts');
const clientTemplatesContent = fs.readFileSync(clientTemplatesPath, 'utf8');

// Extract template IDs from client config
const templateIdMatches = clientTemplatesContent.matchAll(/id:\s*'([^']+)'/g);
const clientTemplateIds = Array.from(templateIdMatches, m => m[1]);

console.log('Client Template IDs:');
clientTemplateIds.forEach(id => console.log(`  - ${id}`));
console.log();

// Read server YAML mapper
const yamlMapperPath = path.join(__dirname, 'server/utils/jsonToYamlMapper.js');
const yamlMapperContent = fs.readFileSync(yamlMapperPath, 'utf8');

// Extract theme mappings from getThemeDesign function
const themeMappings = {};

// Match each theme block individually
const themeBlocks = yamlMapperContent.match(/(\w+):\s*\{\s*theme:\s*'([^']+)'/g);

if (themeBlocks) {
  themeBlocks.forEach(block => {
    const match = block.match(/(\w+):\s*\{\s*theme:\s*'([^']+)'/);
    if (match) {
      const [, clientTheme, rendercvTheme] = match;
      themeMappings[clientTheme] = rendercvTheme;
    }
  });
}

console.log('Server Theme Mappings:');
Object.entries(themeMappings).forEach(([client, rendercv]) => {
  console.log(`  ${client} → ${rendercv}`);
});
console.log();

// Validate all client themes have mappings
console.log('Validation Results:');
console.log('-'.repeat(60));

let allValid = true;

clientTemplateIds.forEach(id => {
  if (themeMappings[id]) {
    console.log(`✓ ${id} → ${themeMappings[id]}`);
  } else {
    console.log(`✗ ${id} → MISSING MAPPING`);
    allValid = false;
  }
});

console.log();

// Check RenderCV supported themes
const supportedThemes = ['classic', 'moderncv', 'sb2nov', 'engineeringresumes', 'engineeringclassic'];
console.log('RenderCV Supported Themes:');
supportedThemes.forEach(theme => console.log(`  - ${theme}`));
console.log();

// Validate all mapped themes are supported by RenderCV
console.log('RenderCV Theme Validation:');
console.log('-'.repeat(60));

const uniqueRendercvThemes = [...new Set(Object.values(themeMappings))];
uniqueRendercvThemes.forEach(theme => {
  if (supportedThemes.includes(theme)) {
    console.log(`✓ ${theme} is supported by RenderCV`);
  } else {
    console.log(`✗ ${theme} is NOT supported by RenderCV`);
    allValid = false;
  }
});

console.log();

// Special case: engineeringclassic mapping
console.log('Special Mappings:');
console.log('-'.repeat(60));
if (themeMappings['engineeringclassic'] === 'engineeringresumes') {
  console.log('✓ engineeringclassic correctly maps to engineeringresumes');
  console.log('  (RenderCV v2.6 uses engineeringresumes for both themes)');
} else {
  console.log('⚠️  engineeringclassic mapping may need verification');
}

console.log();
console.log('='.repeat(60));

if (allValid) {
  console.log('✅ All themes are properly synchronized!');
  process.exit(0);
} else {
  console.log('❌ Theme synchronization issues found!');
  process.exit(1);
}
