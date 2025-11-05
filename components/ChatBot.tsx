
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sendMessageToChat } from '../services/geminiService';
import type { ChatMessage } from '../types';
import LoadingSpinner from './LoadingSpinner';

const SendIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009.172 15V4.828a1 1 0 00-1.169-1.409l-5 1.428a1 1 0 10.585 1.902l4.415-1.261v10.37l-4.415 1.261a1 1 0 10-.585 1.902l7-14a1 1 0 00.282-.553z" />
    </svg>
);

const ChatBot: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    const handleSendMessage = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const botResponseText = await sendMessageToChat(input);
            const botMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'bot', text: botResponseText };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Failed to get chat response:", error);
            const errorMessage: ChatMessage = { 
                id: (Date.now() + 1).toString(), 
                sender: 'bot', 
                text: 'Sorry, I encountered an error. Please try again.' 
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading]);

    return (
        <div className="flex flex-col h-[70vh] max-h-[70vh] bg-gray-800 rounded-xl shadow-lg animate-fade-in">
            <div className="flex-grow p-4 overflow-y-auto">
                <div className="space-y-4">
                    {messages.map(message => (
                        <div key={message.id} className={`flex items-end gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                           {message.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex-shrink-0"></div>}
                            <div
                                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
                                    message.sender === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-gray-700 text-gray-200 rounded-bl-none'
                                }`}
                            >
                               <pre className="whitespace-pre-wrap font-sans">{message.text}</pre>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-end gap-2 justify-start">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex-shrink-0"></div>
                            <div className="px-4 py-3 rounded-2xl bg-gray-700 text-gray-200 rounded-bl-none">
                                <LoadingSpinner size="5" />
                            </div>
                         </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="p-4 border-t border-gray-700">
                <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything..."
                        className="flex-grow p-3 bg-gray-900 border border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                        <SendIcon />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatBot;
