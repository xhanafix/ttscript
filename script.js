const API_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
let OPENROUTER_API_KEY = '';

// DOM Elements
const generateBtn = document.getElementById('generateBtn');
const outputDiv = document.getElementById('output');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const apiKeyInput = document.getElementById('apiKey');
const saveApiKeyBtn = document.getElementById('saveApiKey');
const apiKeySection = document.getElementById('apiKeySection');
const themeToggle = document.getElementById('themeToggle');

// Theme Management
function setTheme(isDark) {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('darkMode', isDark);
    themeToggle.checked = isDark;
}

function toggleTheme() {
    const isDark = themeToggle.checked;
    setTheme(isDark);
}

// Initialize theme
document.addEventListener('DOMContentLoaded', () => {
    const savedApiKey = localStorage.getItem('openRouterApiKey');
    if (savedApiKey) {
        OPENROUTER_API_KEY = savedApiKey;
        apiKeyInput.value = savedApiKey;
        apiKeySection.style.display = 'none';
    }

    const prefersDark = localStorage.getItem('darkMode') === 'true' || 
                       window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark);

    // Add footer on page load
    if (!document.querySelector('.footer')) {
        document.querySelector('.container').appendChild(createFooter());
    }

    // Add event listener for generate button
    document.getElementById('generateBtn').addEventListener('click', generateScript);
    
    // Add event listener for save API key button
    document.getElementById('saveApiKey').addEventListener('click', saveApiKey);
});

themeToggle.addEventListener('change', toggleTheme);

// API Key Management
function saveApiKey() {
    const newApiKey = apiKeyInput.value.trim();
    if (newApiKey) {
        localStorage.setItem('openRouterApiKey', newApiKey);
        OPENROUTER_API_KEY = newApiKey;
        apiKeySection.style.display = 'none';
        showOutput('API key saved successfully! You can now generate scripts.');
    } else {
        showError('Please enter a valid API key');
    }
}

// Progress Management
function updateProgress(percent, message) {
    progressBar.style.width = `${percent}%`;
    progressText.textContent = message;
    progressContainer.style.display = 'block';
}

// Script Generation
generateBtn.addEventListener('click', generateScript);

async function generateScript() {
    console.log('Generate button clicked');

    if (!OPENROUTER_API_KEY) {
        showError('Please enter and save your API key first');
        apiKeySection.style.display = 'block';
        return;
    }

    const description = document.getElementById('description').value;
    const audience = document.getElementById('audience').value;
    const tone = document.getElementById('tone').value;
    const language = document.getElementById('language').value;

    console.log('Form values:', { description, audience, tone, language });

    if (!description || !audience) {
        showError('Please fill in all required fields');
        return;
    }

    try {
        generateBtn.disabled = true;
        progressContainer.style.display = 'block';
        updateProgress(20, 'Preparing your script...');

        const prompt = `Generate a viral TikTok video script in ${language === 'malay' ? 'Bahasa Malaysia' : 'English'} based on the following details:

Goal of the video: ${description}
Target audience: ${audience}
Tone: ${tone}
Length: 15-60 seconds

Please structure the script with these key elements:

1. HOOK (First 3 seconds):
- Create an attention-grabbing opening
- Use pattern interrupts or curiosity gaps
- Make viewers stop scrolling

2. MAIN CONTENT:
- Deliver value-driven or entertaining content
- Keep it concise and high-energy
- Include visual transition suggestions
- Optimize for mobile viewing
- Use trending TikTok elements

3. CALL-TO-ACTION:
- Include specific engagement prompts
- Suggest relevant hashtags
- Add follow/share requests

Additional Requirements:
- Use proven TikTok engagement strategies
- Include suggestions for trending sounds or music
- Add visual transition cues in [brackets]
- Keep language ${language === 'malay' ? 'casual and natural in Bahasa Malaysia' : 'conversational and engaging'}
- Format timing cues in (parentheses)

Please structure the output clearly with "Hook:", "Main Content:", and "Call to Action:" sections.`;

        console.log('Sending request to API...');

        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.href,
                'X-Title': 'TikTok Script Generator'
            },
            body: JSON.stringify({
                model: 'google/learnlm-1.5-pro-experimental:free',
                messages: [{
                    role: 'user',
                    content: [{
                        type: 'text',
                        text: prompt
                    }]
                }],
                temperature: 0.7
            })
        });

        console.log('Response received:', response.status); // Debug log

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('API response data:', data); // Debug log

        updateProgress(90, 'Formatting script...');
        const generatedScript = data.choices[0].message.content;
        
        updateProgress(100, 'Complete!');
        setTimeout(() => {
            progressContainer.style.display = 'none';
            showOutput(generatedScript);
        }, 1000);
    } catch (error) {
        console.error('Error details:', error); // Detailed error logging
        showError(`Failed to generate script: ${error.message}`);
    } finally {
        generateBtn.disabled = false;
    }
}

// Add this function to handle footer creation
function createFooter() {
    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = `
        <p>Made with <span class="heart">❤️</span> by 
            <a href="https://github.com/xhanafix" target="_blank" rel="noopener noreferrer">xhanafix</a>
        </p>
    `;
    return footer;
}

// Update the showOutput function to include the footer
function showOutput(text) {
    const sections = text.split(/(?=Hook:|Main Content:|Call to Action:)/gi);
    
    let formattedOutput = '<div class="output-content">';
    
    sections.forEach(section => {
        const sectionMatch = section.match(/^(Hook:|Main Content:|Call to Action:)?(.*)$/s);
        if (sectionMatch) {
            const title = sectionMatch[1] || 'Script';
            const content = sectionMatch[2].trim();
            
            formattedOutput += `
                <div class="script-section">
                    <h3>${title.replace(':', '')}</h3>
                    <pre>${content}</pre>
                </div>
            `;
        }
    });
    
    formattedOutput += `
        <button class="copy-button" onclick="copyFullScript()">
            Copy Full Script
        </button>
    </div>`;
    
    outputDiv.innerHTML = formattedOutput;
    outputDiv.classList.add('active');

    // Add footer if it doesn't exist
    if (!document.querySelector('.footer')) {
        document.querySelector('.container').appendChild(createFooter());
    }
}

function copyFullScript() {
    const sections = document.querySelectorAll('.script-section pre');
    const fullText = Array.from(sections)
        .map(pre => pre.textContent.trim())
        .join('\n\n');
    
    const button = document.querySelector('.copy-button');
    
    navigator.clipboard.writeText(fullText).then(() => {
        button.classList.add('copied');
        button.textContent = 'Copied!';
        button.disabled = true;
        
        setTimeout(() => {
            button.classList.remove('copied');
            button.textContent = 'Copy Full Script';
            button.disabled = false;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text:', err);
        button.textContent = 'Failed';
        button.classList.add('error');
        
        setTimeout(() => {
            button.classList.remove('error');
            button.textContent = 'Copy Full Script';
        }, 2000);
    });
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    
    outputDiv.innerHTML = '';
    outputDiv.appendChild(errorDiv);
    outputDiv.classList.add('active');
} 