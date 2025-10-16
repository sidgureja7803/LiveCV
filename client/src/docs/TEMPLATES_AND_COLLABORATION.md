# LiveCV Template System and Live Collaboration

This document explains how the LiveCV template system works and how the live collaboration feature is implemented.

## Template Structure

Templates in LiveCV are defined in two places:

1. **Frontend Configuration**: `client/src/config/templates.ts` - Contains metadata about templates
2. **Backend EJS Templates**: `server/views/templates/*.ejs` - The actual template files

### Template Files

Each template consists of:

1. **EJS Template**: Located in `server/views/templates/` (e.g., `modern-professional.ejs`)
   - Contains the HTML structure of the template
   - Uses EJS syntax to insert dynamic content

2. **CSS Styles**: 
   - Can be embedded within the EJS file
   - Or linked as separate files

### Template Selection Flow

The correct flow for using templates is:

1. User selects a template from the Template Selector page
2. User is redirected to the Resume Builder with the selected template
3. User makes changes to their resume using the template
4. Resume is rendered in real-time with the selected template

### Adding New Templates

To add a new template:

1. Create a new EJS file in `server/views/templates/`
2. Add template metadata in `client/src/config/templates.ts`
3. Include any CSS styles needed
4. Test the template with different resume data

### Rendering Templates

Templates are rendered using the following process:

1. Frontend sends resume data to server
2. Server uses EJS to render the template with the provided data
3. HTML is returned to the client and displayed in the preview

## Live Collaboration System

The live collaboration feature allows multiple users to work on a resume simultaneously.

### How It Works

1. **Socket.IO Connection**: 
   - Each client connects to the server via Socket.IO
   - Clients join a "room" based on the resume ID

2. **Real-time Updates**:
   - When a user makes changes, they're sent to the server
   - Server broadcasts changes to all clients in the same room
   - Other clients update their UI based on the received data

3. **Cursor Tracking**:
   - Each user's cursor position is tracked and broadcast
   - Other users see cursors with the user's name
   - Cursor positions are mapped to DOM elements using data attributes

4. **Selection Tracking**:
   - Text selections are also tracked and broadcast
   - Other users see highlighted selections with the user's color

### Integration with Templates

The live collaboration system integrates with templates through:

1. **Data Synchronization**:
   - Resume data is synchronized between users
   - The template renders with the updated data in real-time

2. **DOM Mapping**:
   - Template HTML elements have data attributes (e.g., `data-section-id="skills"`)
   - These attributes help map cursor positions to the correct locations

### Implementation Details

The core components involved in live collaboration:

1. **Socket.IO Hook** (`useSocketIo.ts`):
   - Manages Socket.IO connection
   - Handles sending/receiving updates
   - Tracks cursor positions and selections

2. **LiveCoding Component** (`LiveCoding.tsx`):
   - Renders collaborator cursors and selections
   - Maps positions to the DOM

3. **Server Socket Handler** (`server.js`):
   - Manages Socket.IO connections
   - Routes messages to the appropriate clients
   - Tracks active editing sessions

## Debugging Templates

If templates are not rendering correctly:

1. **Check Template Files**: Ensure the template files exist in `server/views/templates/`
2. **Check Server Logs**: Look for errors in template rendering
3. **Check Network Requests**: Verify that the client is requesting the correct template
4. **Test Template Directly**: Try rendering the template directly with test data

## Debugging Live Collaboration

If live collaboration is not working:

1. **Check Socket.IO Connection**: Verify the connection is established
2. **Check Room Joining**: Ensure clients are joining the correct rooms
3. **Monitor Socket Events**: Use browser dev tools to monitor Socket.IO events
4. **Check Server Socket Handlers**: Verify the server is properly routing messages

## Future Improvements

Planned improvements for templates and collaboration:

1. **Template Preview**: Better preview system for templates
2. **Template Customization**: Allow users to customize templates
3. **Conflict Resolution**: Improve handling of conflicting edits
4. **Presence Awareness**: Show which section each user is editing
5. **Change History**: Track and display a history of changes

## Template File Example

Here's an example of a template file structure:

```
server/views/templates/modern-professional.ejs
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= title %></title>
  <style>
    /* Modern Professional Template */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    body {
      font-family: 'Inter', sans-serif;
      line-height: 1.6;
      color: #1f2937;
      margin: 0;
      padding: 0;
    }
    
    .resume-container {
      max-width: 8.5in;
      margin: 0 auto;
      padding: 0.75in;
    }
    
    /* More styles... */
  </style>
</head>
<body>
  <div class="resume-container">
    <!-- Header Section -->
    <header class="header">
      <h1 class="name"><%= resumeData.personalInfo.fullName %></h1>
      <!-- More header content... -->
    </header>

    <!-- Other resume sections... -->
  </div>
</body>
</html>
```
