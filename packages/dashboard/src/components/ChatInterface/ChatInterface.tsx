import { useState, useRef, useEffect } from 'react';
import { ChatRequestDto, ChatResponseDto, ChatSource } from '@flowtel/shared';
import './ChatInterface.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: ChatSource[];
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function generateId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) {
      return;
    }

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: trimmedInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const requestBody: ChatRequestDto = {
        message: trimmedInput,
        conversationId,
      };

      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponseDto = await response.json();

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.answer,
        timestamp: new Date(),
        sources: data.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setConversationId(data.conversationId);
    } catch (error) {
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-interface__header">
        <h2 className="chat-interface__title">Analytics Chat</h2>
        <p className="chat-interface__subtitle">Ask questions about your analytics data</p>
      </div>

      <div className="chat-interface__messages">
        {messages.length === 0 && (
          <div className="chat-interface__empty">
            <p className="chat-interface__empty-text">
              Start a conversation by asking about your analytics data.
            </p>
            <p className="chat-interface__empty-hint">
              Try asking: &quot;What are my top performing products?&quot;
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-interface__message chat-interface__message--${message.role}`}
          >
            <div className="chat-interface__message-content">{message.content}</div>
            {message.sources && message.sources.length > 0 && (
              <div className="chat-interface__message-sources">
                <span className="chat-interface__sources-label">Sources:</span>
                {message.sources.map((source, index) => (
                  <span key={index} className="chat-interface__source-tag">
                    {source.type}: {source.reference}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="chat-interface__message chat-interface__message--assistant">
            <div className="chat-interface__loading">
              <span className="chat-interface__loading-dot" />
              <span className="chat-interface__loading-dot" />
              <span className="chat-interface__loading-dot" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="chat-interface__input-form" onSubmit={handleSubmit}>
        <textarea
          className="chat-interface__input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your analytics..."
          disabled={isLoading}
          rows={1}
        />
        <button
          type="submit"
          className="chat-interface__send-button"
          disabled={!inputValue.trim() || isLoading}
          aria-label="Send message"
        >
          Send
        </button>
      </form>
    </div>
  );
}
