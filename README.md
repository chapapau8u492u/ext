# QuestionSolver AI Chrome Extension

A Chrome extension that extracts questions from webpages and provides AI-generated answers in a floating, resizable panel.

## Features

- Intelligent question extraction (MCQs, fill-in-blanks, short answers)
- Multiple AI provider integration:
  - Hugging Face
  - Cohere
  - Groq
  - OpenRouter
- Toggle between Speed and Accuracy modes
- Draggable, resizable floating panel with customizable appearance
- Light and dark theme support

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked" and select the extension directory

## Usage

1. Click the extension icon in the toolbar to open the popup
2. Click "Scan for Questions" to analyze the current webpage
3. Questions will appear in the floating panel
4. Click on a question to generate an AI answer
5. Choose your preferred AI provider and mode (Speed/Accuracy)

## Customization

Access the Options page to customize:
- Default API provider
- Default mode (Speed/Accuracy)
- Theme (Light/Dark)
- Panel opacity
- Auto-scan settings

## Privacy & Security

- All API calls are made securely over HTTPS
- No user data is stored or transmitted beyond what's needed for question answering
- API keys are stored securely in the extension

## Development

This extension is built using vanilla JavaScript, HTML, and CSS, following Chrome's Manifest V3 specifications.

### Project Structure

```
my-extension/
├── manifest.json        // Extension configuration
├── background.js        // API communication
├── content.js           // Question extraction and panel
├── popup.html           // Extension popup
├── popup.js             // Popup interaction
├── options.html         // Settings page
├── options.js           // Options functionality
├── styles/              // CSS stylesheets
│   ├── content.css
│   ├── popup.css
│   └── options.css
└── icons/               // Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## License

MIT