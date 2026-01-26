import { ChatInterface } from '../components/ChatInterface/ChatInterface';
import './ChatPage.css';

export function ChatPage() {
  return (
    <main className="chat-page" aria-label="Analytics Chat">
      <ChatInterface />
    </main>
  );
}
