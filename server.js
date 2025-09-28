const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

// Mime types for serving files
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

// Function to inject environment variables into HTML
const injectEnvIntoHtml = (htmlContent) => {
  // Create a script tag with environment variables
  const envScript = `
    <script>
      window.env = {
        SUPABASE_URL: '${process.env.SUPABASE_URL || ''}',
        SUPABASE_KEY: '${process.env.SUPABASE_KEY || ''}',
        GROQ_API_KEYS: '${process.env.GROQ_API_KEYS || ''}',
        MODEL_NAME: '${process.env.MODEL_NAME || 'openai/gpt-oss-120b'}',
        DEFAULT_TEMPERATURE: '${process.env.DEFAULT_TEMPERATURE || '0.7'}',
        MAX_CHAT_HISTORY: '${process.env.MAX_CHAT_HISTORY || '10'}',
        MAX_COMPLETION_TOKENS: '${process.env.MAX_COMPLETION_TOKENS || '8192'}'
      };
      
      // Also make config available globally
      window.appConfig = {
        SUPABASE_URL: '${process.env.SUPABASE_URL || ''}',
        SUPABASE_KEY: '${process.env.SUPABASE_KEY || ''}',
        GROQ_API_KEYS: '${process.env.GROQ_API_KEYS || ''}'.split(',').filter(key => key.trim().length > 0),
        MODEL_NAME: '${process.env.MODEL_NAME || 'openai/gpt-oss-120b'}',
        DEFAULT_TEMPERATURE: parseFloat('${process.env.DEFAULT_TEMPERATURE || '0.7'}'),
        MAX_CHAT_HISTORY: parseInt('${process.env.MAX_CHAT_HISTORY || '10'}', 10),
        MAX_COMPLETION_TOKENS: parseInt('${process.env.MAX_COMPLETION_TOKENS || '8192'}', 10),
        temperatures: {
          direct: 0.1,
          short: 0.4,
          normal: 0.5,
          detailed: 0.8
        },
        systemInstructions: {
          base: "You are an AI Study Assistant designed to help students learn. Provide accurate, helpful, and educational responses.",
          easyMode: "Explain all concepts in simple, easy-to-understand language for a beginner. Avoid jargon.",
          direct: "Provide a very short, direct, and concise answer. Do not elaborate.",
          quiz: "Generate a quiz with at least 3 questions based on the provided conversation history. Format it clearly with numbered questions and an answer key at the end.",
          short: "Your response should be brief, a few sentences at most.",
          detailed: "Your response should be very detailed and long, with comprehensive explanations."
        }
      };
    </script>
  `;
  
  // Inject the script tag into the head of the HTML
  return htmlContent.replace('</head>', `${envScript}</head>`);
};

// Vercel serverless function handler
module.exports = async (req, res) => {
  try {
    // Get the requested path
    let filePath = req.url;
    
    // Serve index.html by default for root path
    if (filePath === '/') {
      filePath = '/index.html';
    }
    
    // Construct the full file path
    const fullFilePath = path.join(__dirname, filePath);
    
    // Get file extension
    const extname = String(path.extname(fullFilePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    // Read the file
    const content = await fs.readFile(fullFilePath);
    
    // If it's an HTML file, inject environment variables
    if (extname === '.html') {
      const modifiedContent = injectEnvIntoHtml(content.toString());
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(modifiedContent);
    } else {
      res.setHeader('Content-Type', contentType);
      res.status(200).send(content);
    }
  } catch (error) {
    // Handle file not found
    if (error.code === 'ENOENT') {
      try {
        // Try to serve 404.html
        const notFoundContent = await fs.readFile(path.join(__dirname, '404.html'));
        res.setHeader('Content-Type', 'text/html');
        res.status(404).send(notFoundContent);
      } catch {
        // If 404.html doesn't exist, send a simple 404
        res.status(404).send('404 Not Found');
      }
    } else {
      // Handle other errors
      console.error('Server error:', error);
      res.status(500).send(`Server Error: ${error.message}`);
    }
  }
};