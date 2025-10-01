// Configuration file for AI Study Assistant
// This file handles both server-side and client-side configuration

// Function to get environment variables with fallback values
const getEnvVar = (name, defaultValue) => {
  // For browser environments, we'll use the window.env object if available
  if (typeof window !== 'undefined' && window.env && window.env[name]) {
    return window.env[name];
  }
  
  // For Node.js environments, we'll use process.env
  if (typeof process !== 'undefined' && process.env && process.env[name]) {
    return process.env[name];
  }
  
  // Return default value if env var is not found
  return defaultValue;
};

// Function to parse comma-separated API keys
const parseApiKeys = (keysString) => {
  if (!keysString) return [];
  return keysString.split(',').map(key => key.trim()).filter(key => key.length > 0);
};

const config = {
  // Supabase Configuration
  SUPABASE_URL: getEnvVar('SUPABASE_URL', ''),
  SUPABASE_KEY: getEnvVar('SUPABASE_KEY', ''),
  
  // Groq API Configuration
  GROQ_API_KEYS: parseApiKeys(getEnvVar('GROQ_API_KEYS', '')),
  
  // OpenRouter API Configuration
  OPENROUTER_API_KEY: getEnvVar('OPENROUTER_API_KEY', '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'),
  OPENROUTER_VISION_MODEL: getEnvVar('OPENROUTER_VISION_MODEL', 'x-ai/grok-vision-beta'),
  
  // Model Configuration
  MODEL_NAME: getEnvVar('MODEL_NAME', 'openai/gpt-oss-120b'),
  DEFAULT_TEMPERATURE: parseFloat(getEnvVar('DEFAULT_TEMPERATURE', '0.7')),
  MAX_CHAT_HISTORY: parseInt(getEnvVar('MAX_CHAT_HISTORY', '10'), 10),
  MAX_COMPLETION_TOKENS: parseInt(getEnvVar('MAX_COMPLETION_TOKENS', '8192'), 10),
  
  // Default temperature settings
  temperatures: {
    direct: 0.1,
    short: 0.4,
    normal: 0.5,
    detailed: 0.8
  },
  
  // System instructions
  systemInstructions: {
    base: "You are an AI Study Assistant designed to help students learn. Provide accurate, helpful, and educational responses.",
    easyMode: "Explain all concepts in simple, easy-to-understand language for a beginner. Avoid jargon.",
    direct: "Provide a very short, direct, and concise answer. Do not elaborate.",
    quiz: "Generate a quiz with at least 3 questions based on the provided conversation history. Format it clearly with numbered questions and an answer key at the end.",
    short: "Your response should be brief, a few sentences at most.",
    detailed: "Your response should be very detailed and long, with comprehensive explanations."
  }
};

// For Node.js environments, we can use dotenv to load .env files
if (typeof process !== 'undefined' && process.env && !process.env.SUPABASE_URL) {
  try {
    require('dotenv').config();
  } catch (e) {
    console.warn('dotenv not available, using default values');
  }
}

// Export for both CommonJS and ES6 modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
} else if (typeof window !== 'undefined') {
  // Make config available globally in browser
  window.appConfig = config;
}

export default config;