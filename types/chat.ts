export interface ChatCompletionMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
