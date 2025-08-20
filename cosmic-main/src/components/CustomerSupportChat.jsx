import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../services/api';

const CustomerSupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
    
    // Add welcome message when opening chat for the first time
    if (!isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: 'नमस्ते! मैं Solar Mitr से बात कर रहा हूँ। आपकी कैसे मदद कर सकता हूँ?',
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (inputMessage.trim() === '') return;
    
    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newUserMessage]);
    setInputMessage('');
    
    // Show bot typing indicator
    setIsTyping(true);
    
    try {
      // Send message to backend API
      console.log('Sending message to API:', inputMessage, 'Conversation ID:', conversationId);
      const response = await chatService.sendMessage(inputMessage, conversationId);
      console.log('API Response:', response);
      
      // Add bot response
      const newBotMessage = {
        id: messages.length + 2,
        text: response.data?.data?.message || response.data?.message || 'I received your message and will get back to you soon.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prevMessages => [...prevMessages, newBotMessage]);
      
      // Save conversation ID if it's a new conversation
      if (!conversationId && (response.data?.data?.conversationId || response.data?.conversationId)) {
        setConversationId(response.data?.data?.conversationId || response.data?.conversationId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', error.response ? error.response.data : 'No response data');
      
      // Add error message
      const errorMessage = {
        id: messages.length + 2,
        text: 'Sorry, there was an error connecting to the chat service. Please try again later.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Clear conversation history
  const handleClearChat = async () => {
    if (conversationId) {
      try {
        await chatService.clearConversation(conversationId);
        setMessages([]);
        setConversationId(null);
        
        // Add welcome message again
        setMessages([
          {
            id: 1,
            text: 'नमस्ते! मैं Solar Mitr से बात कर रहा हूँ। आपकी कैसे मदद कर सकता हूँ?',
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } catch (error) {
        console.error('Error clearing conversation:', error);
        // Continue with resetting the chat locally even if API call fails
        setMessages([]);
        setConversationId(null);
        
        // Add welcome message again
        setMessages([
          {
            id: 1,
            text: 'नमस्ते! मैं Solar Mitr से बात कर रहा हूँ। आपकी कैसे मदद कर सकता हूँ?',
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } else {
      setMessages([]);
      
      // Add welcome message again
      setMessages([
        {
          id: 1,
          text: 'नमस्ते! मैं Solar Mitr से बात कर रहा हूँ। आपकी कैसे मदद कर सकता हूँ?',
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat Icon Button */}
      <button 
        onClick={toggleChat}
        className="bg-[#cae28e] hover:bg-yellow-green-400 text-gray-900 rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all duration-300 focus:outline-none"
        aria-label="Customer Support Chat"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 md:w-96 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col transition-all duration-300 border border-gray-200">
          {/* Chat Header */}
          <div className="bg-[#cae28e] text-gray-900 p-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-white rounded-full p-1 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Solar Mitr</h3>
                <p className="text-xs opacity-80">सोलर सलाहकार</p>
              </div>
            </div>
            <div className="flex items-center">
              <button 
                onClick={handleClearChat}
                className="mr-2 text-gray-900 hover:text-gray-700 focus:outline-none"
                title="Clear chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button 
                onClick={toggleChat}
                className="text-white hover:text-gray-200 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto max-h-80 bg-gray-50">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${message.sender === 'user' 
                    ? 'bg-[#cae28e] text-gray-900 rounded-br-none' 
                    : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none'}`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70 text-right">{message.timestamp}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-white border border-gray-200 rounded-lg rounded-bl-none px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="bg-gray-300 rounded-full h-2 w-2 animate-bounce"></div>
                    <div className="bg-gray-300 rounded-full h-2 w-2 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="bg-gray-300 rounded-full h-2 w-2 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 bg-white">
            <div className="flex items-center">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="अपना संदेश यहां टाइप करें..."
                className="flex-1 border border-gray-300 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#cae28e] focus:border-transparent"
              />
              <button 
                type="submit"
                className="bg-[#cae28e] hover:bg-yellow-green-400 text-gray-900 rounded-r-lg px-4 py-3 transition-colors"
                disabled={inputMessage.trim() === ''}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CustomerSupportChat;