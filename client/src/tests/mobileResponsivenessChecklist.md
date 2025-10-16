# Mobile Responsiveness Test Checklist

This document provides a structured approach for testing the mobile responsiveness of the LiveCV application across different screen sizes and devices.

## Device Sizes to Test

| Device Category | Screen Width | Example Devices |
|----------------|--------------|-----------------|
| Small Mobile | 320px - 375px | iPhone SE, Small Android phones |
| Medium Mobile | 376px - 428px | iPhone X/11/12/13, Average Android phones |
| Large Mobile | 429px - 767px | iPhone Plus/Max/Pro Max, Large Android phones |
| Tablet - Portrait | 768px - 1023px | iPad Mini/Air/Pro (portrait) |
| Tablet - Landscape | 1024px - 1279px | iPad Mini/Air/Pro (landscape) |
| Desktop | 1280px+ | Laptops, Desktops, Large displays |

## Components to Test

### 1. LiveResumeViewer Component
- [ ] Preview renders correctly on all screen sizes
- [ ] Update indicators position properly on mobile devices
- [ ] Zoom controls are touch-friendly on mobile
- [ ] Fullscreen toggle works on mobile devices
- [ ] Orientation hint appears in portrait mode on small devices
- [ ] PDF download button is accessible on all screen sizes

### 2. Template Selection Page
- [ ] Template grid adjusts columns based on screen size
- [ ] Filter controls are usable on mobile
- [ ] Template cards are properly sized on mobile
- [ ] Preview modal is responsive and usable on small screens
- [ ] Loading overlay displays correctly when transitioning to Resume Builder

### 3. Resume Builder Page
- [ ] Form fields are accessible and usable on mobile
- [ ] Live preview scales appropriately
- [ ] Navigation between form sections works on small screens
- [ ] Collaboration panel is accessible and can be toggled on mobile
- [ ] Header navigation adapts to small screens with appropriate controls

## Testing Process

1. Use browser developer tools to simulate various device sizes
2. Test on real physical devices when possible
3. Check both portrait and landscape orientations
4. Test touch interactions for mobile-specific features
5. Verify loading states and transitions on slower connections

## Common Issues to Watch For

- Text that's too small to read on mobile
- Elements that extend beyond the viewport (horizontal scrolling)
- Overlapping UI elements at smaller sizes
- Touch targets that are too small (buttons, links, controls)
- Content that requires excessive scrolling
- Fixed position elements that take up too much space on mobile
- Images that don't scale correctly

## Viewport Testing Commands

Add these commands to the browser console to quickly test specific viewport sizes:

```javascript
// iPhone SE / Small Mobile
window.resizeTo(320, 568);

// iPhone 12/13 / Medium Mobile
window.resizeTo(390, 844);

// iPhone 12/13 Pro Max / Large Mobile
window.resizeTo(428, 926);

// iPad Mini / Tablet Portrait
window.resizeTo(768, 1024);

// iPad Pro / Tablet Landscape
window.resizeTo(1024, 1366);
```

## Documentation

Record screenshots of any issues found along with:
- Device/viewport size
- Issue description
- Steps to reproduce
- Suggested fix
