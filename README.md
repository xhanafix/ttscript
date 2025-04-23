# TikTok Viral Idea Generator

A tool that helps content creators generate viral TikTok ideas quickly and easily using AI.

## Features

- **AI-Powered Content Generation**: Uses Google Gemini 2.0 Flash model via OpenRouter
- **Multilingual Support**: Switch between English and Bahasa Malaysia languages
- **Copy Functionality**: Copy individual sections or all content with a single click
- **History Management**: View, load, and manage previously generated ideas
- **Export/Import**: Save and share your history of generated ideas as JSON files
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- HTML5
- CSS3
- JavaScript (ES6+)
- LocalStorage for persistent storage
- OpenRouter API for AI content generation

## API Requirements

To use this application, you need:
- An OpenRouter API key (sign up at [openrouter.ai](https://openrouter.ai))
- The application uses the Google Gemini 2.0 Flash model

## How to Use

1. Enter your OpenRouter API key
2. Select your preferred language (English or Bahasa Malaysia)
3. Enter a topic for your TikTok video (e.g., "Morning Coffee Routine", "Travel Hacks")
4. Click "Generate Viral Idea"
5. Use the copy buttons to copy individual sections or the entire script
6. Access your history of previously generated ideas below
7. Export or import history as needed

## History Features

The app stores up to 50 previously generated ideas with:

- Timestamp
- Topic
- Generated content
- Language used

You can:
- Load previous ideas back into the generator
- Copy previous ideas to clipboard
- Export your history as a JSON file
- Import history from a JSON file
- Clear your history (with confirmation)

## File Structure

This project is designed with a flat file structure for easy GitHub Pages hosting:

```
ttviral/
├── index.html     # Main HTML file
├── styles.css     # CSS styles
├── script.js      # JavaScript functionality
└── README.md      # Project documentation
```

## GitHub Pages Hosting

To host this project on GitHub Pages:

1. Create a new GitHub repository
2. Upload all files (index.html, styles.css, script.js, README.md)
3. Go to repository Settings > Pages
4. Select the main branch as the source
5. Your site will be published at https://yourusername.github.io/repositoryname/

## Development

This project uses vanilla JavaScript without any external dependencies. All data is stored locally in the user's browser using localStorage. The content is generated using the OpenRouter API service.

### Key Code Components

- OpenRouter API integration with Google Gemini 2.0 Flash model
- Language-aware AI prompting
- Structured content parsing from AI responses
- Copy-to-clipboard functionality
- Local storage for history and API key
- Import/Export functionality
- Mobile-responsive design

## Privacy & Security

- Your OpenRouter API key is stored locally in your browser
- No data is sent to any server except the OpenRouter API
- You can clear all stored data at any time

## Future Enhancements

- Add more languages
- Allow editing of generated content
- Share directly to social media platforms
- Categorize ideas by topic or type
- Add user accounts for cross-device history
- Support for more AI models

## License

This project is available for personal and commercial use. 