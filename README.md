# AI Study Assistant

An AI-powered study assistant with chat history and authentication using Supabase and Groq API.

## Features

- AI-powered responses using Groq API
- Conversation history storage with Supabase
- User authentication with email/password
- Responsive design with Tailwind CSS
- Multiple response modes (Direct Answer, Quiz Generation, Easy Mode)
- Configurable response length

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Supabase account and project
- Groq API key(s)

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ai-study-assistant
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   GROQ_API_KEYS=your_groq_api_key1,your_groq_api_key2
   MODEL_NAME=openai/gpt-oss-120b
   DEFAULT_TEMPERATURE=0.7
   MAX_CHAT_HISTORY=10
   MAX_COMPLETION_TOKENS=8192
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Supabase Setup

1. Create a new project in Supabase
2. Create a table named `user_chat_history` with the following columns:
   - `id` (UUID, primary key)
   - `user_id` (UUID, foreign key to auth.users)
   - `message` (TEXT)
   - `sender` (TEXT) - 'user' or 'assistant'
   - `conversation_id` (TEXT)
   - `created_at` (TIMESTAMP, default NOW())

3. Enable email authentication in Supabase Authentication settings

## Deployment to Vercel

1. Push your code to a GitHub repository
2. Sign up/in to Vercel
3. Create a new project and import your GitHub repository
4. Configure the environment variables in Vercel project settings:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `GROQ_API_KEYS`
   - `MODEL_NAME`
   - `DEFAULT_TEMPERATURE`
   - `MAX_CHAT_HISTORY`
   - `MAX_COMPLETION_TOKENS`

5. Deploy the project

## Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| SUPABASE_URL | Supabase project URL | - |
| SUPABASE_KEY | Supabase project API key | - |
| GROQ_API_KEYS | Comma-separated Groq API keys | - |
| MODEL_NAME | Groq model name | openai/gpt-oss-120b |
| DEFAULT_TEMPERATURE | Default temperature for API calls | 0.7 |
| MAX_CHAT_HISTORY | Maximum number of messages to send to API | 10 |
| MAX_COMPLETION_TOKENS | Maximum tokens in API response | 8192 |

## Usage

1. Sign up or log in with your email and password
2. Start chatting with the AI assistant
3. Use the options panel to:
   - Adjust response length
   - Get direct answers
   - Generate quizzes
   - Toggle easy mode for simpler explanations
4. View chat history in the sidebar
5. Start new conversations with the "New Chat" button

## Troubleshooting

If you see a blank screen:

1. Check browser console for JavaScript errors
2. Verify all environment variables are set correctly
3. Ensure Supabase URL and key are correct
4. Check that Groq API keys are valid
5. Make sure the Supabase `user_chat_history` table is created correctly

## License

MIT