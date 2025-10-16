// Console Error and Warning Monitoring Script

/**
 * This script helps monitor and log React warnings and errors during testing.
 * Add this script to your application for development/testing purposes.
 */

(function() {
  // Store original console methods
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  
  // Counter for errors and warnings
  const errorLog = [];
  const warningLog = [];
  
  // Override console.error
  console.error = function(...args) {
    // Call original function
    originalConsoleError.apply(console, args);
    
    // Log the error details
    const errorMessage = args.join(' ');
    const stackTrace = new Error().stack;
    const timestamp = new Date();
    
    errorLog.push({
      message: errorMessage,
      timestamp,
      stack: stackTrace,
      location: window.location.href
    });
    
    // Display count in UI if the error monitoring panel exists
    updateErrorCountDisplay();
  };
  
  // Override console.warn
  console.warn = function(...args) {
    // Call original function
    originalConsoleWarn.apply(console, args);
    
    // Check if this is a React-specific warning
    const warningMessage = args.join(' ');
    if (warningMessage.includes('React') || 
        warningMessage.includes('component') || 
        warningMessage.includes('prop') ||
        warningMessage.includes('state') ||
        warningMessage.includes('render')) {
      
      const stackTrace = new Error().stack;
      const timestamp = new Date();
      
      warningLog.push({
        message: warningMessage,
        timestamp,
        stack: stackTrace,
        location: window.location.href
      });
      
      // Display count in UI
      updateWarningCountDisplay();
    }
  };
  
  // Create UI for displaying error/warning counts
  function createMonitoringPanel() {
    const panel = document.createElement('div');
    panel.id = 'react-error-monitor';
    panel.style.position = 'fixed';
    panel.style.bottom = '10px';
    panel.style.right = '10px';
    panel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    panel.style.color = 'white';
    panel.style.padding = '8px 12px';
    panel.style.borderRadius = '4px';
    panel.style.fontSize = '12px';
    panel.style.fontFamily = 'monospace';
    panel.style.zIndex = '10000';
    panel.style.display = 'flex';
    panel.style.flexDirection = 'column';
    panel.style.gap = '4px';
    
    const title = document.createElement('div');
    title.textContent = 'React Error Monitor';
    title.style.fontWeight = 'bold';
    panel.appendChild(title);
    
    const errorCounter = document.createElement('div');
    errorCounter.id = 'error-counter';
    errorCounter.style.color = '#ff6b6b';
    errorCounter.textContent = 'Errors: 0';
    panel.appendChild(errorCounter);
    
    const warningCounter = document.createElement('div');
    warningCounter.id = 'warning-counter';
    warningCounter.style.color = '#ffd93d';
    warningCounter.textContent = 'Warnings: 0';
    panel.appendChild(warningCounter);
    
    const viewButton = document.createElement('button');
    viewButton.textContent = 'View Details';
    viewButton.style.marginTop = '6px';
    viewButton.style.padding = '4px 8px';
    viewButton.style.backgroundColor = '#4CAF50';
    viewButton.style.border = 'none';
    viewButton.style.borderRadius = '4px';
    viewButton.style.cursor = 'pointer';
    viewButton.style.color = 'white';
    viewButton.style.fontSize = '11px';
    viewButton.onclick = showDetailedLog;
    panel.appendChild(viewButton);
    
    document.body.appendChild(panel);
  }
  
  // Update error count in panel
  function updateErrorCountDisplay() {
    const counter = document.getElementById('error-counter');
    if (counter) {
      counter.textContent = `Errors: ${errorLog.length}`;
      counter.style.color = errorLog.length > 0 ? '#ff6b6b' : '#4CAF50';
    }
  }
  
  // Update warning count in panel
  function updateWarningCountDisplay() {
    const counter = document.getElementById('warning-counter');
    if (counter) {
      counter.textContent = `Warnings: ${warningLog.length}`;
      counter.style.color = warningLog.length > 0 ? '#ffd93d' : '#4CAF50';
    }
  }
  
  // Show detailed log modal
  function showDetailedLog() {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.zIndex = '10001';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    
    const content = document.createElement('div');
    content.style.backgroundColor = '#282c34';
    content.style.borderRadius = '8px';
    content.style.padding = '20px';
    content.style.maxWidth = '90%';
    content.style.maxHeight = '90%';
    content.style.overflow = 'auto';
    content.style.color = 'white';
    content.style.fontFamily = 'monospace';
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.backgroundColor = '#f44336';
    closeBtn.style.color = 'white';
    closeBtn.style.border = 'none';
    closeBtn.style.padding = '8px 16px';
    closeBtn.style.borderRadius = '4px';
    closeBtn.style.float = 'right';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = function() {
      document.body.removeChild(modal);
    };
    content.appendChild(closeBtn);
    
    // Clear logs button
    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear Logs';
    clearBtn.style.backgroundColor = '#2196F3';
    clearBtn.style.color = 'white';
    clearBtn.style.border = 'none';
    clearBtn.style.padding = '8px 16px';
    clearBtn.style.borderRadius = '4px';
    clearBtn.style.marginRight = '10px';
    clearBtn.style.float = 'right';
    clearBtn.style.cursor = 'pointer';
    clearBtn.onclick = function() {
      errorLog.length = 0;
      warningLog.length = 0;
      updateErrorCountDisplay();
      updateWarningCountDisplay();
      document.body.removeChild(modal);
    };
    content.appendChild(clearBtn);
    
    const title = document.createElement('h2');
    title.textContent = 'React Error & Warning Log';
    title.style.marginBottom = '20px';
    content.appendChild(title);
    
    // Create tabs for errors and warnings
    const tabs = document.createElement('div');
    tabs.style.display = 'flex';
    tabs.style.marginBottom = '20px';
    
    const errorTab = document.createElement('div');
    errorTab.textContent = `Errors (${errorLog.length})`;
    errorTab.style.padding = '10px 20px';
    errorTab.style.backgroundColor = '#ff6b6b';
    errorTab.style.borderTopLeftRadius = '4px';
    errorTab.style.cursor = 'pointer';
    
    const warningTab = document.createElement('div');
    warningTab.textContent = `Warnings (${warningLog.length})`;
    warningTab.style.padding = '10px 20px';
    warningTab.style.backgroundColor = '#333';
    warningTab.style.borderTopRightRadius = '4px';
    warningTab.style.cursor = 'pointer';
    
    tabs.appendChild(errorTab);
    tabs.appendChild(warningTab);
    content.appendChild(tabs);
    
    // Content containers
    const errorContent = document.createElement('div');
    const warningContent = document.createElement('div');
    warningContent.style.display = 'none';
    
    // Tab switching logic
    errorTab.onclick = function() {
      errorTab.style.backgroundColor = '#ff6b6b';
      warningTab.style.backgroundColor = '#333';
      errorContent.style.display = 'block';
      warningContent.style.display = 'none';
    };
    
    warningTab.onclick = function() {
      warningTab.style.backgroundColor = '#ffd93d';
      errorTab.style.backgroundColor = '#333';
      warningContent.style.display = 'block';
      errorContent.style.display = 'none';
    };
    
    // Populate error content
    if (errorLog.length === 0) {
      const noErrors = document.createElement('p');
      noErrors.textContent = 'No errors detected.';
      noErrors.style.padding = '20px';
      noErrors.style.color = '#4CAF50';
      errorContent.appendChild(noErrors);
    } else {
      errorLog.forEach((error, index) => {
        const errorItem = document.createElement('div');
        errorItem.style.padding = '15px';
        errorItem.style.marginBottom = '10px';
        errorItem.style.backgroundColor = '#3a3a3a';
        errorItem.style.borderRadius = '4px';
        
        const errorMessage = document.createElement('div');
        errorMessage.textContent = error.message;
        errorMessage.style.color = '#ff6b6b';
        errorMessage.style.fontWeight = 'bold';
        errorItem.appendChild(errorMessage);
        
        const errorTime = document.createElement('div');
        errorTime.textContent = `Time: ${error.timestamp.toLocaleString()}`;
        errorTime.style.fontSize = '12px';
        errorTime.style.marginTop = '8px';
        errorItem.appendChild(errorTime);
        
        const errorLocation = document.createElement('div');
        errorLocation.textContent = `Location: ${error.location}`;
        errorLocation.style.fontSize = '12px';
        errorLocation.style.marginTop = '4px';
        errorItem.appendChild(errorLocation);
        
        errorContent.appendChild(errorItem);
      });
    }
    
    // Populate warning content
    if (warningLog.length === 0) {
      const noWarnings = document.createElement('p');
      noWarnings.textContent = 'No warnings detected.';
      noWarnings.style.padding = '20px';
      noWarnings.style.color = '#4CAF50';
      warningContent.appendChild(noWarnings);
    } else {
      warningLog.forEach((warning, index) => {
        const warningItem = document.createElement('div');
        warningItem.style.padding = '15px';
        warningItem.style.marginBottom = '10px';
        warningItem.style.backgroundColor = '#3a3a3a';
        warningItem.style.borderRadius = '4px';
        
        const warningMessage = document.createElement('div');
        warningMessage.textContent = warning.message;
        warningMessage.style.color = '#ffd93d';
        warningMessage.style.fontWeight = 'bold';
        warningItem.appendChild(warningMessage);
        
        const warningTime = document.createElement('div');
        warningTime.textContent = `Time: ${warning.timestamp.toLocaleString()}`;
        warningTime.style.fontSize = '12px';
        warningTime.style.marginTop = '8px';
        warningItem.appendChild(warningTime);
        
        const warningLocation = document.createElement('div');
        warningLocation.textContent = `Location: ${warning.location}`;
        warningLocation.style.fontSize = '12px';
        warningLocation.style.marginTop = '4px';
        warningItem.appendChild(warningLocation);
        
        warningContent.appendChild(warningItem);
      });
    }
    
    content.appendChild(errorContent);
    content.appendChild(warningContent);
    modal.appendChild(content);
    document.body.appendChild(modal);
  }
  
  // Export logs for console access
  window.reactErrorMonitor = {
    getErrors: () => [...errorLog],
    getWarnings: () => [...warningLog],
    clearLogs: () => {
      errorLog.length = 0;
      warningLog.length = 0;
      updateErrorCountDisplay();
      updateWarningCountDisplay();
    }
  };
  
  // Create the monitoring panel when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createMonitoringPanel);
  } else {
    createMonitoringPanel();
  }
})();

/**
 * How to use:
 * 
 * 1. Add this script to your app during development/testing
 * 2. A small panel will appear in the bottom right of the screen
 * 3. It will track React errors and warnings
 * 4. Click "View Details" to see the full log
 * 5. Access the log programmatically through window.reactErrorMonitor
 * 
 * Example:
 * - window.reactErrorMonitor.getErrors() - Returns all errors
 * - window.reactErrorMonitor.getWarnings() - Returns all warnings
 * - window.reactErrorMonitor.clearLogs() - Clears all logs
 */
