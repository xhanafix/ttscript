document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKey');
    const saveApiKeyBtn = document.getElementById('saveApiKey');
    const apiKeySection = document.getElementById('apiKeySection');
    const generatorSection = document.getElementById('generatorSection');
    const generateBtn = document.getElementById('generate');
    const productInput = document.getElementById('product');
    const audienceInput = document.getElementById('audience');
    const output = document.getElementById('output');
    const loader = document.getElementById('loader');
    const themeToggle = document.getElementById('themeToggle');
    const languageSelect = document.getElementById('language');
    const styleSelect = document.getElementById('style');
    const toneSelect = document.getElementById('tone');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const progressFill = document.getElementById('progressFill');
    const progressPercentage = document.getElementById('progressPercentage');
    const embedCode = document.getElementById('embedCode');
    const copyEmbedBtn = document.getElementById('copyEmbedBtn');

    // Check for saved API key
    const savedApiKey = localStorage.getItem('openRouterApiKey');
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
        apiKeySection.style.display = 'none';
        generatorSection.style.display = 'block';
    } else {
        apiKeySection.style.display = 'block';
        generatorSection.style.display = 'none';
    }

    // Theme toggle
    const toggleTheme = () => {
        document.body.classList.toggle('dark-theme');
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('dark-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    };

    // Check saved theme
    if (localStorage.getItem('theme') === 'dark') {
        toggleTheme();
    }

    themeToggle.addEventListener('click', toggleTheme);

    // Save API Key
    saveApiKeyBtn.addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            localStorage.setItem('openRouterApiKey', apiKey);
            apiKeySection.style.display = 'none';
            generatorSection.style.display = 'block';
        }
    });

    // Copy to clipboard functionality
    copyBtn.addEventListener('click', async () => {
        const text = output.textContent;
        try {
            await navigator.clipboard.writeText(text);
            showSuccessMessage('Script copied to clipboard!');
        } catch (err) {
            alert('Failed to copy text');
        }
    });

    // Download functionality
    downloadBtn.addEventListener('click', () => {
        const text = output.textContent;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tiktok-script.txt';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showSuccessMessage('Script downloaded!');
    });

    // Success message helper
    function showSuccessMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'success-message';
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        setTimeout(() => {
            messageDiv.remove();
        }, 2000);
    }

    // Add these new functions at the top level of the DOMContentLoaded callback
    const loadingMessages = [
        "Crafting your engaging hook...",
        "Developing the main content...",
        "Polishing the call-to-action...",
        "Adding creative elements...",
        "Finalizing your script..."
    ];

    let loadingMessageIndex = 0;
    let loadingInterval;

    function updateLoadingMessage() {
        const loadingMessage = document.getElementById('loadingMessage');
        loadingMessage.textContent = loadingMessages[loadingMessageIndex];
        loadingMessageIndex = (loadingMessageIndex + 1) % loadingMessages.length;
    }

    function updateProgress(percent) {
        progressFill.style.width = `${percent}%`;
        progressPercentage.textContent = `${percent}%`;
    }

    function startLoadingAnimation() {
        loadingMessageIndex = 0;
        updateLoadingMessage();
        loadingInterval = setInterval(updateLoadingMessage, 3000);
        loader.style.display = 'block';
        output.innerHTML = '';
        
        // Reset progress
        updateProgress(0);
        
        // Simulate progress
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 1;
            if (progress <= 90) { // Only go up to 90% for simulation
                updateProgress(progress);
            }
        }, 500); // Update every 500ms

        // Store the interval ID for cleanup
        loader.dataset.progressInterval = progressInterval;
    }

    function stopLoadingAnimation() {
        clearInterval(loadingInterval);
        
        // Clear the progress interval
        const progressInterval = parseInt(loader.dataset.progressInterval);
        if (progressInterval) {
            clearInterval(progressInterval);
        }
        
        // Show 100% completion
        updateProgress(100);
        
        // Wait a moment to show 100% before hiding
        setTimeout(() => {
            loader.style.display = 'none';
            // Reset progress for next time
            updateProgress(0);
        }, 500);
    }

    // Modify the generate script function
    generateBtn.addEventListener('click', async () => {
        const apiKey = localStorage.getItem('openRouterApiKey');
        const product = productInput.value.trim();
        const audience = audienceInput.value.trim();
        const style = styleSelect.value;
        const tone = toneSelect.value;
        const language = languageSelect.value;

        if (!apiKey || !product || !audience) {
            alert('Please fill in all required fields');
            return;
        }

        startLoadingAnimation();

        const promptLanguage = language === 'ms' ? 'in Bahasa Malaysia' : 'in English';
        const hookText = language === 'ms' ? 'PEMBUKAAN' : 'HOOK';
        const mainContentText = language === 'ms' ? 'ISI KANDUNGAN' : 'MAIN CONTENT';
        const ctaText = language === 'ms' ? 'SERUAN TINDAKAN' : 'CALL TO ACTION';
        const additionalText = language === 'ms' ? 'KEPERLUAN TAMBAHAN' : 'ADDITIONAL REQUIREMENTS';

        const prompt = language === 'ms' 
            ? `Hasilkan skrip TikTok yang menarik selama 30-45 saat dalam Bahasa Malaysia untuk mempromosikan ${product}. 

Sasaran Penonton: ${audience}
Gaya: ${style}
Nada: ${tone}

Sila susun skrip mengikut format berikut:

1. PEMBUKAAN (3-5 saat):
- Cipta pembukaan yang menarik perhatian penonton
- Gunakan soalan yang menarik, fakta mengejutkan, atau masalah yang relatable

2. ISI KANDUNGAN (20-30 saat):
- Tunjukkan ${product} sebagai penyelesaian
- Sertakan ciri-ciri dan manfaat khusus
- Tambah bukti sosial atau testimoni
- Gunakan teknik penceritaan ${style}
- Kekalkan nada ${tone}

3. SERUAN TINDAKAN (5-10 saat):
- Cipta rasa terdesak atau FOMO
- Sertakan arahan pembelian yang jelas
- Tambah tawaran istimewa atau tawaran terhad

KEPERLUAN TAMBAHAN:
- Sertakan cadangan sudut kamera dan transisi
- Tambah cadangan muzik atau kesan bunyi
- Sertakan cadangan teks pada skrin
- Nyatakan props atau elemen visual yang diperlukan

Sila format output dengan bahagian dan timestamp yang jelas.`
            : `Create a detailed and engaging 30-45 second TikTok script in English that persuades viewers to buy ${product}. 

Target Audience: ${audience}
Style: ${style}
Tone: ${tone}

Please structure the script in the following format:

1. HOOK (3-5 seconds):
- Create an attention-grabbing opening that immediately captures viewer interest
- Use a powerful question, shocking fact, or relatable problem

2. MAIN CONTENT (20-30 seconds):
- Present the ${product} as the solution
- Include specific features and benefits
- Add social proof or testimonial elements
- Use ${style} storytelling techniques
- Maintain a ${tone} tone throughout

3. CALL TO ACTION (5-10 seconds):
- Create urgency or FOMO
- Include clear instructions on how to purchase
- Add any special offers or limited-time deals

ADDITIONAL REQUIREMENTS:
- Include camera angles and transition suggestions
- Add music or sound effect recommendations
- Include on-screen text suggestions
- Specify any props or visual elements needed

Format the output with clear sections and timestamps for each part.`;

        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': window.location.href,
                    'X-Title': 'TikTok Script Generator'
                },
                body: JSON.stringify({
                    model: 'google/learnlm-1.5-pro-experimental:free',
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message);
            }

            // Update to 95% when we get the response
            updateProgress(95);

            const generatedText = data.choices[0].message.content;
            
            // Format the output based on language
            const formattedText = language === 'ms' 
                ? generatedText
                    .replace(/PEMBUKAAN/g, '<strong>PEMBUKAAN</strong>')
                    .replace(/ISI KANDUNGAN/g, '<strong>ISI KANDUNGAN</strong>')
                    .replace(/SERUAN TINDAKAN/g, '<strong>SERUAN TINDAKAN</strong>')
                    .replace(/KEPERLUAN TAMBAHAN/g, '<strong>KEPERLUAN TAMBAHAN</strong>')
                : generatedText
                    .replace(/HOOK/g, '<strong>HOOK</strong>')
                    .replace(/MAIN CONTENT/g, '<strong>MAIN CONTENT</strong>')
                    .replace(/CALL TO ACTION/g, '<strong>CALL TO ACTION</strong>')
                    .replace(/ADDITIONAL REQUIREMENTS/g, '<strong>ADDITIONAL REQUIREMENTS</strong>');

            output.innerHTML = formattedText.replace(/\n/g, '<br>');
        } catch (error) {
            updateProgress(100); // Show 100% even on error
            output.innerHTML = `Error: ${error.message}`;
        } finally {
            stopLoadingAnimation();
        }
    });

    // Set embed code
    const embedHTML = `<iframe src="https://xhanafix.github.io/ttscript/" 
        width="100%" 
        height="800px" 
        frameborder="0" 
        allow="clipboard-write"
        title="TikTok Script Generator">
    </iframe>`;
    embedCode.value = embedHTML;

    // Copy embed code functionality
    copyEmbedBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(embedCode.value);
            showSuccessMessage('Embed code copied to clipboard!');
        } catch (err) {
            alert('Failed to copy embed code');
        }
    });
}); 