const { Groq } = require('groq-sdk');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { message, systemInstruction, temperature } = JSON.parse(event.body);

    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemInstruction || 'You are a helpful study assistant.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      model: 'llama3-70b-8192',
      temperature: parseFloat(temperature) || 0.7,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply: chatCompletion.choices[0].message.content }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'An error occurred while processing your request' }),
    };
  }
};
