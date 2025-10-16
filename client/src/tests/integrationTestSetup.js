// Integration Test Setup
// This file brings together all testing tools

/**
 * To use these test tools in your application:
 * 
 * 1. In development mode, import this file in your index.js/tsx:
 *    if (process.env.NODE_ENV === 'development') {
 *      import('./tests/integrationTestSetup');
 *    }
 * 
 * 2. Or add a conditional script tag in your index.html for manual testing:
 *    <script src="/tests/integrationTestSetup.js"></script>
 */

// Import test modules
import './consoleErrorCheck';
import { TEST_CASES } from './userFlowTest';

// Create a test launcher UI
(function() {
  let isTestPanelOpen = false;

  function createTestPanel() {
    // Create test launcher button
    const launcherButton = document.createElement('button');
    launcherButton.textContent = '🧪 Tests';
    launcherButton.style.position = 'fixed';
    launcherButton.style.top = '10px';
    launcherButton.style.left = '10px';
    launcherButton.style.padding = '8px 12px';
    launcherButton.style.backgroundColor = '#6366f1';
    launcherButton.style.color = 'white';
    launcherButton.style.border = 'none';
    launcherButton.style.borderRadius = '4px';
    launcherButton.style.cursor = 'pointer';
    launcherButton.style.zIndex = '9999';
    launcherButton.style.fontSize = '14px';
    launcherButton.style.fontWeight = 'bold';
    
    // Add click event to toggle test panel
    launcherButton.addEventListener('click', toggleTestPanel);
    
    document.body.appendChild(launcherButton);
  }
  
  function toggleTestPanel() {
    if (isTestPanelOpen) {
      const panel = document.getElementById('livecv-test-panel');
      if (panel) {
        document.body.removeChild(panel);
      }
      isTestPanelOpen = false;
    } else {
      createFullTestPanel();
      isTestPanelOpen = true;
    }
  }
  
  function createFullTestPanel() {
    const panel = document.createElement('div');
    panel.id = 'livecv-test-panel';
    panel.style.position = 'fixed';
    panel.style.top = '50px';
    panel.style.left = '10px';
    panel.style.width = '400px';
    panel.style.maxHeight = '80vh';
    panel.style.backgroundColor = '#ffffff';
    panel.style.border = '1px solid #e5e7eb';
    panel.style.borderRadius = '8px';
    panel.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    panel.style.zIndex = '9998';
    panel.style.overflow = 'hidden';
    panel.style.display = 'flex';
    panel.style.flexDirection = 'column';
    
    // Panel header
    const header = document.createElement('div');
    header.style.padding = '12px 16px';
    header.style.backgroundColor = '#f3f4f6';
    header.style.borderBottom = '1px solid #e5e7eb';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    
    const title = document.createElement('h3');
    title.textContent = 'LiveCV Test Tools';
    title.style.margin = '0';
    title.style.fontSize = '16px';
    title.style.fontWeight = 'bold';
    title.style.color = '#111827';
    
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '20px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = '#6b7280';
    closeButton.addEventListener('click', toggleTestPanel);
    
    header.appendChild(title);
    header.appendChild(closeButton);
    panel.appendChild(header);
    
    // Panel content
    const content = document.createElement('div');
    content.style.padding = '16px';
    content.style.overflowY = 'auto';
    content.style.maxHeight = 'calc(80vh - 50px)';
    
    // Add section: Test Flow
    const flowSection = document.createElement('div');
    flowSection.style.marginBottom = '24px';
    
    const flowTitle = document.createElement('h4');
    flowTitle.textContent = 'User Flow Tests';
    flowTitle.style.fontSize = '14px';
    flowTitle.style.fontWeight = 'bold';
    flowTitle.style.marginBottom = '12px';
    flowTitle.style.color = '#374151';
    flowSection.appendChild(flowTitle);
    
    TEST_CASES.forEach(testCase => {
      const testCaseEl = document.createElement('div');
      testCaseEl.style.marginBottom = '16px';
      
      const testCaseTitle = document.createElement('div');
      testCaseTitle.textContent = testCase.name;
      testCaseTitle.style.fontSize = '14px';
      testCaseTitle.style.fontWeight = '500';
      testCaseTitle.style.marginBottom = '8px';
      testCaseTitle.style.paddingLeft = '8px';
      testCaseTitle.style.borderLeft = '2px solid #6366f1';
      testCaseEl.appendChild(testCaseTitle);
      
      testCase.steps.forEach(step => {
        const stepEl = document.createElement('div');
        stepEl.style.display = 'flex';
        stepEl.style.alignItems = 'center';
        stepEl.style.marginBottom = '4px';
        stepEl.style.padding = '6px 8px';
        stepEl.style.backgroundColor = '#f9fafb';
        stepEl.style.borderRadius = '4px';
        stepEl.style.fontSize = '13px';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.marginRight = '8px';
        stepEl.appendChild(checkbox);
        
        const stepDesc = document.createElement('span');
        stepDesc.textContent = step.description;
        stepDesc.style.flexGrow = '1';
        stepEl.appendChild(stepDesc);
        
        testCaseEl.appendChild(stepEl);
      });
      
      flowSection.appendChild(testCaseEl);
    });
    
    content.appendChild(flowSection);
    
    // Add section: Mobile Responsiveness Testing
    const mobileSection = document.createElement('div');
    mobileSection.style.marginBottom = '24px';
    
    const mobileTitle = document.createElement('h4');
    mobileTitle.textContent = 'Mobile Responsiveness Testing';
    mobileTitle.style.fontSize = '14px';
    mobileTitle.style.fontWeight = 'bold';
    mobileTitle.style.marginBottom = '12px';
    mobileTitle.style.color = '#374151';
    mobileSection.appendChild(mobileTitle);
    
    const viewportSizes = [
      { name: 'Small Mobile (320px)', width: 320, height: 568 },
      { name: 'Medium Mobile (390px)', width: 390, height: 844 },
      { name: 'Large Mobile (428px)', width: 428, height: 926 },
      { name: 'Tablet Portrait (768px)', width: 768, height: 1024 },
      { name: 'Tablet Landscape (1024px)', width: 1024, height: 1366 }
    ];
    
    viewportSizes.forEach(size => {
      const sizeButton = document.createElement('button');
      sizeButton.textContent = size.name;
      sizeButton.style.margin = '4px';
      sizeButton.style.padding = '8px 12px';
      sizeButton.style.backgroundColor = '#e5e7eb';
      sizeButton.style.border = 'none';
      sizeButton.style.borderRadius = '4px';
      sizeButton.style.fontSize = '13px';
      sizeButton.style.cursor = 'pointer';
      sizeButton.addEventListener('click', () => {
        // This doesn't actually work in modern browsers due to security restrictions
        // It's just a visual indication of the test sizes
        alert(`To test ${size.name} view, use browser dev tools to set viewport to ${size.width} x ${size.height}`);
      });
      mobileSection.appendChild(sizeButton);
    });
    
    content.appendChild(mobileSection);
    
    // Add section: Console Monitor
    const consoleSection = document.createElement('div');
    
    const consoleTitle = document.createElement('h4');
    consoleTitle.textContent = 'Console Error Monitor';
    consoleTitle.style.fontSize = '14px';
    consoleTitle.style.fontWeight = 'bold';
    consoleTitle.style.marginBottom = '12px';
    consoleTitle.style.color = '#374151';
    consoleSection.appendChild(consoleTitle);
    
    const consoleDesc = document.createElement('p');
    consoleDesc.textContent = 'Console error monitoring is active. Check the bottom-right corner for error counts.';
    consoleDesc.style.fontSize = '13px';
    consoleDesc.style.marginBottom = '8px';
    consoleSection.appendChild(consoleDesc);
    
    const showLogButton = document.createElement('button');
    showLogButton.textContent = 'View Error Log';
    showLogButton.style.padding = '8px 12px';
    showLogButton.style.backgroundColor = '#ef4444';
    showLogButton.style.color = 'white';
    showLogButton.style.border = 'none';
    showLogButton.style.borderRadius = '4px';
    showLogButton.style.fontSize = '13px';
    showLogButton.style.cursor = 'pointer';
    showLogButton.addEventListener('click', () => {
      if (window.reactErrorMonitor) {
        window.reactErrorMonitor.showDetailedLog();
      }
    });
    consoleSection.appendChild(showLogButton);
    
    content.appendChild(consoleSection);
    
    panel.appendChild(content);
    document.body.appendChild(panel);
  }
  
  // Initialize test panel when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createTestPanel);
  } else {
    createTestPanel();
  }
})();

// Export utility functions for console use
window.livecvTestUtils = {
  runAllTests: () => {
    console.log('LiveCV Test Suite:');
    console.log('==================');
    console.log('Test Cases:', TEST_CASES.length);
    console.log('Total Test Steps:', TEST_CASES.reduce((sum, testCase) => sum + testCase.steps.length, 0));
    console.log('');
    console.log('Begin manual testing using the test panel UI.');
  },
  
  checkMobileResponsiveness: () => {
    console.log('Mobile Responsiveness Checklist loaded.');
    console.log('See the file at: /tests/mobileResponsivenessChecklist.md');
  }
};

// Notify that tests are ready
console.log('%cLiveCV Test Tools Loaded', 'color: white; background-color: #6366f1; padding: 4px 8px; border-radius: 4px;');
console.log('Open the test panel by clicking the "🧪 Tests" button in the top-left corner.');
