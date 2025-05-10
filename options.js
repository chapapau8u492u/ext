// options.js - Handles options page functionality

// DOM elements
const apiProviderSelect = document.getElementById('api-provider');
const defaultModeSelect = document.getElementById('default-mode');
const themeSelect = document.getElementById('theme');
const opacitySlider = document.getElementById('opacity-slider');
const opacityValue = document.getElementById('opacity-value');
const autoScanCheckbox = document.getElementById('auto-scan');
const includeContextCheckbox = document.getElementById('include-context');
const resetButton = document.getElementById('reset-settings');
const saveButton = document.getElementById('save-settings');
const statusMessage = document.getElementById('status-message');

// Default settings
const defaultSettings = {
  apiProvider: 'cohere',
  mode: 'speed',
  theme: 'light',
  opacity: 0.95,
  autoScan: false,
  includeContext: true,
  panelPosition: { top: '100px', left: '100px' },
  panelSize: { width: '400px', height: '500px' }
};

// Load current settings
function loadSettings() {
  chrome.storage.sync.get(null, (settings) => {
    // Merge with default settings
    const currentSettings = { ...defaultSettings, ...settings };
    
    // Apply settings to form
    apiProviderSelect.value = currentSettings.apiProvider;
    defaultModeSelect.value = currentSettings.mode;
    themeSelect.value = currentSettings.theme;
    opacitySlider.value = currentSettings.opacity;
    updateOpacityLabel(currentSettings.opacity);
    autoScanCheckbox.checked = currentSettings.autoScan || false;
    includeContextCheckbox.checked = currentSettings.includeContext || true;
  });
}

// Save settings
function saveSettings() {
  const newSettings = {
    apiProvider: apiProviderSelect.value,
    mode: defaultModeSelect.value,
    theme: themeSelect.value,
    opacity: parseFloat(opacitySlider.value),
    autoScan: autoScanCheckbox.checked,
    includeContext: includeContextCheckbox.checked
  };
  
  chrome.storage.sync.set(newSettings, () => {
    // Show success message
    statusMessage.textContent = 'Settings saved!';
    statusMessage.classList.add('success');
    
    // Clear message after a delay
    setTimeout(() => {
      statusMessage.textContent = '';
      statusMessage.classList.remove('success');
    }, 3000);
  });
}

// Reset settings
function resetSettings() {
  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    chrome.storage.sync.set(defaultSettings, () => {
      loadSettings();
      
      // Show success message
      statusMessage.textContent = 'Settings reset to defaults!';
      statusMessage.classList.add('success');
      
      // Clear message after a delay
      setTimeout(() => {
        statusMessage.textContent = '';
        statusMessage.classList.remove('success');
      }, 3000);
    });
  }
}

// Update opacity label when slider moves
function updateOpacityLabel(value) {
  opacityValue.textContent = `${Math.round(value * 100)}%`;
}

// Event listeners
opacitySlider.addEventListener('input', () => {
  updateOpacityLabel(opacitySlider.value);
});

saveButton.addEventListener('click', saveSettings);
resetButton.addEventListener('click', resetSettings);

// Initialize options page
document.addEventListener('DOMContentLoaded', loadSettings);