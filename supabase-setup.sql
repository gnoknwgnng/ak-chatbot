-- Create the user_chat_history table
CREATE TABLE IF NOT EXISTS user_chat_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  sender TEXT CHECK (sender IN ('user', 'assistant')) NOT NULL,
  conversation_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_user_chat_history_user_id ON user_chat_history(user_id);

-- Create an index on conversation_id for faster queries
CREATE INDEX IF NOT EXISTS idx_user_chat_history_conversation_id ON user_chat_history(conversation_id);

-- Create an index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_user_chat_history_created_at ON user_chat_history(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE user_chat_history ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own chat history
CREATE POLICY "Users can read their own chat history" 
ON user_chat_history FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own chat history
CREATE POLICY "Users can insert their own chat history" 
ON user_chat_history FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own chat history
CREATE POLICY "Users can update their own chat history" 
ON user_chat_history FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own chat history
CREATE POLICY "Users can delete their own chat history" 
ON user_chat_history FOR DELETE 
USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON TABLE user_chat_history TO authenticated;