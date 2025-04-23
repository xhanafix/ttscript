// Constants
const MAX_HISTORY_SIZE = 50;
const STORAGE_KEY = 'tiktokHistory';
const API_KEY_STORAGE = 'openRouterApiKey';
const LANGUAGE_FULL_NAMES = {
    'EN': 'English',
    'MS': 'Bahasa Malaysia'
};
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = 'google/gemini-2.0-flash-exp:free';

// DOM Elements
const languageSelect = document.getElementById('languageSelect');
const topicInput = document.getElementById('topicInput');
const apiKeyInput = document.getElementById('apiKeyInput');
const toggleApiKeyBtn = document.getElementById('toggleApiKeyBtn');
const generateBtn = document.getElementById('generateBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const resultContainer = document.getElementById('resultContainer');
const languageBadge = document.getElementById('languageBadge');
const copyAllBtn = document.getElementById('copyAllBtn');
const exportHistoryBtn = document.getElementById('exportHistoryBtn');
const importHistoryInput = document.getElementById('importHistoryInput');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const historyList = document.getElementById('historyList');
const confirmDialog = document.getElementById('confirmDialog');
const confirmMessage = document.getElementById('confirmMessage');
const cancelBtn = document.getElementById('cancelBtn');
const confirmBtn = document.getElementById('confirmBtn');
const toastNotification = document.getElementById('toastNotification');
const toastMessage = document.getElementById('toastMessage');

// Result content elements
const contentElements = {
    hook: document.getElementById('hookContent'),
    intro: document.getElementById('introContent'),
    main: document.getElementById('mainContent'),
    cta: document.getElementById('ctaContent'),
    hashtags: document.getElementById('hashtagsContent')
};

// Event Listeners
document.addEventListener('DOMContentLoaded', initialize);
generateBtn.addEventListener('click', generateContent);
copyAllBtn.addEventListener('click', copyAllContent);
exportHistoryBtn.addEventListener('click', exportHistory);
importHistoryInput.addEventListener('change', importHistory);
clearHistoryBtn.addEventListener('click', promptClearHistory);
languageSelect.addEventListener('change', updateLanguageBadge);
cancelBtn.addEventListener('click', hideConfirmDialog);
toggleApiKeyBtn.addEventListener('click', toggleApiKeyVisibility);

// Initialize the application
function initialize() {
    // Add click event listeners to all copy buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            copyToClipboard(document.getElementById(targetId).textContent);
        });
    });
    
    // Load saved API key if available
    const savedApiKey = localStorage.getItem(API_KEY_STORAGE);
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
    }
    
    // Load and display history
    loadAndDisplayHistory();
    
    // Set the language badge initial value
    updateLanguageBadge();
}

// Toggle API key visibility
function toggleApiKeyVisibility() {
    const type = apiKeyInput.type === 'password' ? 'text' : 'password';
    apiKeyInput.type = type;
    toggleApiKeyBtn.innerHTML = `<span class="material-icons">${type === 'password' ? 'visibility' : 'visibility_off'}</span>`;
}

// Update the language badge when language is changed
function updateLanguageBadge() {
    const selectedLanguage = getSelectedLanguage();
    languageBadge.textContent = selectedLanguage;
    languageBadge.className = 'language-badge ' + selectedLanguage;
}

// Get the selected language
function getSelectedLanguage() {
    return languageSelect.value;
}

// Show loading spinner
function showLoading() {
    loadingSpinner.classList.remove('hidden');
    resultContainer.classList.add('hidden');
}

// Hide loading spinner
function hideLoading() {
    loadingSpinner.classList.add('hidden');
}

// Generate TikTok content based on the input topic
async function generateContent() {
    const topic = topicInput.value.trim();
    const apiKey = apiKeyInput.value.trim();
    
    if (!topic) {
        showToast('Please enter a topic first');
        return;
    }
    
    if (!apiKey) {
        showToast('Please enter your OpenRouter API key');
        return;
    }
    
    // Save API key for future use
    localStorage.setItem(API_KEY_STORAGE, apiKey);
    
    showLoading();
    
    try {
        // Generate content using OpenRouter API
        const result = await generateWithOpenRouter(topic, apiKey);
        
        // Display the result
        displayResult(result);
        
        // Save to history
        saveToHistory(topic, result);
        
        // Refresh history display
        loadAndDisplayHistory();
        
    } catch (error) {
        showToast('Error generating content: ' + error.message);
        console.error('Generation error:', error);
    } finally {
        hideLoading();
    }
}

// Generate content using OpenRouter API with Google Gemini 2.0 Flash model
async function generateWithOpenRouter(topic, apiKey) {
    const lang = getSelectedLanguage();
    const prompt = buildPrompt(topic, lang);
    
    try {
        const response = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': window.location.origin, // Required for OpenRouter
                'X-Title': 'TikTok Viral Idea Generator' // Optional but recommended
            },
            body: JSON.stringify({
                model: OPENROUTER_MODEL,
                messages: [
                    { role: 'system', content: 'You are a creative TikTok content writer, specializing in viral-worthy scripts. You always respond with well-structured, engaging content.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.6,
                max_tokens: 800,
                response_format: { type: "text" }
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to generate content');
        }
        
        const data = await response.json();
        
        if (!data.choices || data.choices.length === 0) {
            throw new Error('No content generated');
        }
        
        // Parse the response content
        return parseAIResponse(data.choices[0].message.content, lang);
        
    } catch (error) {
        console.error('OpenRouter API Error:', error);
        throw new Error('Failed to connect to AI service. Please check your API key and try again.');
    }
}

// Build the prompt for the AI
function buildPrompt(topic, lang) {
    const languageText = lang === 'EN' ? 'English' : 'Bahasa Malaysia';
    
    return `
Please create a TikTok script about "${topic}" in ${languageText}. 

The script should be clearly divided into these exact sections, with these exact headers:

HOOK: A catchy 1-2 sentence opening line to grab attention (0-3 seconds)
INTRO: Brief 2-3 sentence introduction to the topic (3-10 seconds)
MAIN: The main explanation or tips, 3-5 sentences (10-50 seconds)
CTA: A call-to-action asking for engagement, 1-2 sentences (50-60 seconds)
HASHTAGS: 5 relevant hashtags including #${topic.replace(/\s+/g, '')}

${lang === 'MS' ? 'Pastikan semua teks ditulis dalam Bahasa Malaysia yang santai dan mudah difahami.' : 'Use casual, conversational English with appropriate emojis.'}

Make sure each section is clearly labeled with the headers as specified above, and each header is on its own line.
`;
}

// Parse the AI response into structured content
function parseAIResponse(responseText, lang) {
    // Default result structure
    const result = {
        hook: '',
        intro: '',
        main: '',
        cta: '',
        hashtags: ''
    };
    
    try {
        // Try to extract sections using regex
        const hookMatch = responseText.match(/HOOK:?\s*(.*?)(?=INTRO:|$)/is);
        const introMatch = responseText.match(/INTRO:?\s*(.*?)(?=MAIN:|$)/is);
        const mainMatch = responseText.match(/MAIN:?\s*(.*?)(?=CTA:|$)/is);
        const ctaMatch = responseText.match(/CTA:?\s*(.*?)(?=HASHTAGS:|$)/is);
        const hashtagsMatch = responseText.match(/HASHTAGS:?\s*(.*?)(?=$)/is);
        
        // Assign matches to result if found
        if (hookMatch && hookMatch[1]) result.hook = hookMatch[1].trim();
        if (introMatch && introMatch[1]) result.intro = introMatch[1].trim();
        if (mainMatch && mainMatch[1]) result.main = mainMatch[1].trim();
        if (ctaMatch && ctaMatch[1]) result.cta = ctaMatch[1].trim();
        if (hashtagsMatch && hashtagsMatch[1]) result.hashtags = hashtagsMatch[1].trim();
        
        // If any section is empty, try to parse the entire response and make a best guess
        if (!result.hook || !result.intro || !result.main || !result.cta || !result.hashtags) {
            const lines = responseText.split('\n').filter(line => line.trim());
            
            if (!result.hook && lines.length > 0) result.hook = lines[0];
            if (!result.intro && lines.length > 1) result.intro = lines[1];
            if (!result.main && lines.length > 2) {
                const mainLines = lines.slice(2, -2);
                result.main = mainLines.join('\n');
            }
            if (!result.cta && lines.length > 3) result.cta = lines[lines.length - 2];
            if (!result.hashtags && lines.length > 4) result.hashtags = lines[lines.length - 1];
        }
        
        return result;
    } catch (error) {
        console.error('Error parsing AI response:', error);
        
        // Fallback content if parsing fails
        if (lang === 'EN') {
            return {
                hook: `Want to know about ${topic}? Keep watching! 👀`,
                intro: `I've got some amazing insights about ${topic} to share with you!`,
                main: `${responseText.substring(0, 200)}...`,
                cta: `If you found this helpful, like and follow for more ${topic} content!`,
                hashtags: `#${topic.replace(/\s+/g, '')} #TikTok #Viral #FYP #ForYou`
            };
        } else {
            return {
                hook: `Ingin tahu tentang ${topic}? Terus tonton! 👀`,
                intro: `Saya ada perkongsian menarik tentang ${topic}!`,
                main: `${responseText.substring(0, 200)}...`,
                cta: `Jika bermanfaat, suka dan ikuti untuk lebih banyak kandungan ${topic}!`,
                hashtags: `#${topic.replace(/\s+/g, '')} #TikTok #Viral #FYP #UntukAnda`
            };
        }
    }
}

// Display the generated content
function displayResult(result) {
    contentElements.hook.textContent = result.hook;
    contentElements.intro.textContent = result.intro;
    contentElements.main.textContent = result.main;
    contentElements.cta.textContent = result.cta;
    contentElements.hashtags.textContent = result.hashtags;
    
    resultContainer.classList.remove('hidden');
}

// Copy content to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => showToast('Copied to clipboard!'))
        .catch(err => {
            console.error('Could not copy text: ', err);
            showToast('Failed to copy text');
        });
}

// Copy all content sections
function copyAllContent() {
    const allContent = Object.values(contentElements)
        .map(element => element.textContent)
        .join('\n\n');
    
    copyToClipboard(allContent);
}

// Save generated content to history
function saveToHistory(topic, content) {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    const newItem = {
        timestamp: new Date().toISOString(),
        topic: topic,
        language: getSelectedLanguage(),
        content: content
    };
    
    // Check for duplicates
    const isDuplicate = history.some(item => 
        item.topic === topic && 
        item.language === newItem.language
    );
    
    if (!isDuplicate) {
        history.unshift(newItem);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, MAX_HISTORY_SIZE)));
    }
}

// Load history from localStorage and display it
function loadAndDisplayHistory() {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        historyList.innerHTML = '<p class="empty-history">No history yet. Generate some ideas first!</p>';
        return;
    }
    
    history.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        // Format the timestamp
        const date = new Date(item.timestamp);
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        
        historyItem.innerHTML = `
            <div class="history-item-header">
                <span class="history-item-title">${item.topic}</span>
                <span class="language-badge ${item.language}">${item.language}</span>
            </div>
            <div class="history-item-meta">
                <span><span class="material-icons" style="font-size: 14px;">schedule</span> ${formattedDate}</span>
            </div>
            <div class="history-item-content">
                <strong>Hook:</strong> ${item.content.hook}
            </div>
            <div class="history-item-actions">
                <button class="secondary-btn" onclick="loadHistoryItem(${index})">
                    <span class="material-icons">refresh</span> Load
                </button>
                <button class="secondary-btn" onclick="copyHistoryItem(${index})">
                    <span class="material-icons">content_copy</span> Copy
                </button>
            </div>
        `;
        
        historyList.appendChild(historyItem);
    });
}

// Load a history item into the result container
function loadHistoryItem(index) {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const item = history[index];
    
    if (item) {
        // Set the language
        languageSelect.value = item.language;
        updateLanguageBadge();
        
        // Set the topic
        topicInput.value = item.topic;
        
        // Display the content
        displayResult(item.content);
        
        // Scroll to the result
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

// Copy a history item to clipboard
function copyHistoryItem(index) {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const item = history[index];
    
    if (item) {
        const text = `
Topic: ${item.topic}
Language: ${LANGUAGE_FULL_NAMES[item.language]}
Generated on: ${new Date(item.timestamp).toLocaleString()}

Hook: ${item.content.hook}
Intro: ${item.content.intro}
Main: ${item.content.main}
CTA: ${item.content.cta}
Hashtags: ${item.content.hashtags}
        `.trim();
        
        copyToClipboard(text);
    }
}

// Export history to a JSON file
function exportHistory() {
    const history = localStorage.getItem(STORAGE_KEY) || '[]';
    
    // Create a blob with the history data
    const blob = new Blob([history], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `tiktok_history_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
    
    showToast('History exported successfully!');
}

// Import history from a JSON file
async function importHistory(event) {
    const file = event.target.files[0];
    
    if (!file) {
        return;
    }
    
    try {
        const text = await file.text();
        const importedHistory = JSON.parse(text);
        
        // Validate the imported data
        if (!Array.isArray(importedHistory)) {
            throw new Error('Invalid history format');
        }
        
        // Get current history
        const currentHistory = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        
        // Merge histories, avoiding duplicates
        const mergedHistory = [...importedHistory];
        
        currentHistory.forEach(currentItem => {
            const isDuplicate = mergedHistory.some(importedItem => 
                importedItem.topic === currentItem.topic && 
                importedItem.language === currentItem.language && 
                importedItem.timestamp === currentItem.timestamp
            );
            
            if (!isDuplicate) {
                mergedHistory.push(currentItem);
            }
        });
        
        // Sort by timestamp (newest first)
        mergedHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Save merged history (limited to max size)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedHistory.slice(0, MAX_HISTORY_SIZE)));
        
        // Refresh the display
        loadAndDisplayHistory();
        
        showToast('History imported successfully!');
    } catch (error) {
        console.error('Import error:', error);
        showToast('Error importing history. Please check the file format.');
    }
    
    // Reset the file input
    event.target.value = '';
}

// Prompt for confirmation before clearing history
function promptClearHistory() {
    confirmMessage.textContent = 'Are you sure you want to clear all history? This cannot be undone.';
    
    // Set confirm button action
    confirmBtn.onclick = () => {
        clearHistory();
        hideConfirmDialog();
    };
    
    // Show the dialog
    confirmDialog.classList.remove('hidden');
}

// Clear all history
function clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
    loadAndDisplayHistory();
    showToast('History cleared successfully!');
}

// Hide the confirmation dialog
function hideConfirmDialog() {
    confirmDialog.classList.add('hidden');
}

// Show a toast notification
function showToast(message) {
    toastMessage.textContent = message;
    toastNotification.classList.remove('hidden');
    
    // Automatically hide the toast after 3 seconds
    setTimeout(() => {
        toastNotification.classList.add('hidden');
    }, 3000);
}

// Expose functions to window for HTML onclick access
window.loadHistoryItem = loadHistoryItem;
window.copyHistoryItem = copyHistoryItem;
window.exportHistory = exportHistory;
window.importHistory = importHistory;
window.clearHistory = promptClearHistory; 