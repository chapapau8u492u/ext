// popup.js - Handles popup user interface and interactions

// DOM elements
const scanButton = document.getElementById('scan-page');
const toggleButton = document.getElementById('toggle-panel');
const optionsButton = document.getElementById('open-options');
const currentApiSpan = document.getElementById('current-api');
const currentModeSpan = document.getElementById('current-mode');
const currentThemeSpan = document.getElementById('current-theme');
const questionCountSpan = document.getElementById('question-count');

// Load and display current settings
function loadSettings() {
  chrome.storage.sync.get(null, (settings) => {
    // Map API provider names to friendly display names
    const apiNames = {
      'huggingface': 'Hugging Face',
      'cohere': 'Cohere',
      'groq': 'Groq',
      'openrouter': 'OpenRouter'
    };
    
    // Display current settings
    currentApiSpan.textContent = apiNames[settings.apiProvider] || settings.apiProvider;
    currentModeSpan.textContent = settings.mode === 'speed' ? 'Speed' : 'Accuracy';
    currentThemeSpan.textContent = settings.theme === 'light' ? 'Light' : 'Dark';
  });
}

// Get the count of detected questions from the active tab
function getQuestionCount() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getDetectedQuestions' }, (response) => {
        if (response && response.success) {
          const count = response.questions.length;
          questionCountSpan.textContent = count === 1 
            ? '1 question detected' 
            : `${count} questions detected`;
        }
      });
    }
  });
}

// Scan the current page for questions
function scanPage() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      scanButton.disabled = true;
      scanButton.textContent = 'Scanning...';
      
      chrome.tabs.sendMessage(tabs[0].id, { action: 'scanForQuestions' }, (response) => {
        scanButton.disabled = false;
        scanButton.innerHTML = '<span class="icon-search"></span> Scan for Questions';
        
        // Update question count after scanning
        getQuestionCount();
      });
    }
  });
}

// Toggle the answer panel visibility
function togglePanel() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'togglePanel' });
    }
  });
}

// Open the options page
function openOptions() {
  chrome.runtime.openOptionsPage();
}

// Event listeners
scanButton.addEventListener('click', scanPage);
toggleButton.addEventListener('click', togglePanel);
optionsButton.addEventListener('click', openOptions);

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  getQuestionCount();
});