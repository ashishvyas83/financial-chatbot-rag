export interface Message{
  id: number;
  text: string;
  sender: 'user' | 'bot';    // union type — only these two values!
  timestamp: Date;
  isLoading?: boolean;        // optional — shows typing indicator
}