// background.js - Handles API communications and messaging between extension components

// Store for API keys
const API_KEYS = {
  openrouter: "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",
  groq: "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",
  pawan: "pk-this-is-a-fake-key" // Replace with actual key
};

// API endpoint configurations
const API_ENDPOINTS = {
  openrouter: "https://openrouter.ai/api/v1/chat/completions",
  groq: "https://api.groq.com/openai/v1/chat/completions",
  pawan: "https://api.pawan.krd/v1/chat/completions"
};

// Default models for different modes
const MODELS = {
  speed: {
    openrouter: "anthropic/claude-instant-v1",
    groq: "llama2-70b-4096",
    pawan: "gpt-3.5-turbo"
  },
  accuracy: {
    openrouter: "openai/gpt-4-turbo",
    groq: "mixtral-8x7b-32768",
    pawan: "gpt-4"
  }
};

// Initialize default settings
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['apiProvider', 'mode', 'theme'], (result) => {
    if (!result.apiProvider) {
      chrome.storage.sync.set({
        apiProvider: 'openrouter',
        mode: 'speed',
        theme: 'light',
        opacity: 0.95,
        panelPosition: { top: '100px', left: '100px' },
        panelSize: { width: '400px', height: '500px' }
      });
    }
  });
});

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'getAnswers':
      generateBatchAnswers(request.questions, request.apiProvider, request.mode)
        .then(answers => sendResponse({ success: true, answers }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;

    case 'getSettings':
      chrome.storage.sync.get(null, (settings) => {
        sendResponse({ success: true, settings });
      });
      return true;
  }
});

/**
 * Generate answers for multiple questions in batch
 */
async function generateBatchAnswers(questions, apiProvider, mode) {
  const answers = [];
  const model = MODELS[mode][apiProvider];

  for (const question of questions) {
    try {
      const answer = await callAPI(apiProvider, model, question);
      answers.push({
        questionIndex: question.index,
        text: answer
      });
    } catch (error) {
      console.error('Error generating answer:', error);
      answers.push({
        questionIndex: question.index,
        error: error.message
      });
    }
  }

  return answers;
}

/**
 * Call the selected API provider
 */
async function callAPI(provider, model, question) {
  const endpoint = API_ENDPOINTS[provider];
  const apiKey = API_KEYS[provider];

  const systemPrompt = "You are a helpful AI that provides clear, concise answers. For multiple choice questions, first state the correct option letter, then briefly explain why.";
  
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: `${question.text}\n\nContext: ${question.context}` }
  ];

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: 0.3,
      max_tokens: 150
    })
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const result = await response.json();
  return result.choices[0]?.message?.content || 'No answer generated.';
}