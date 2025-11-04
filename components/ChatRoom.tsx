
import React, { useState, useRef, useEffect } from 'react';
import type { Device, Message } from '../types';
import { SendIcon, ArrowLeftIcon, HeadsetIcon, SmartphoneIcon, WatchIcon, LightbulbIcon, SpeakerIcon } from './icons/Icons';

interface ChatRoomProps {
  messages: Message[];
  connectedDevices: Device[];
  onSendMessage: (text: string) => void;
  isBotLoading: boolean;
  onExit: () => void;
}

const DeviceTypeIcon: React.FC<{ type: Device['type'] }> = ({ type }) => {
    switch (type) {
      case 'headset': return <HeadsetIcon className="w-5 h-5 text-slate-400" />;
      case 'phone': return <SmartphoneIcon className="w-5 h-5 text-slate-400" />;
      case 'watch': return <WatchIcon className="w-5 h-5 text-slate-400" />;
      case 'lightbulb': return <LightbulbIcon className="w-5 h-5 text-slate-400" />;
      case 'speaker': return <SpeakerIcon className="w-5 h-5 text-slate-400" />;
      default: return null;
    }
  };

const ChatBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === 'user';
  return (
    <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-none'
            : 'bg-slate-700 text-slate-200 rounded-bl-none'
        }`}
      >
        <p className="text-sm">{message.text}</p>
      </div>
    </div>
  );
};


export const ChatRoom: React.FC<ChatRoomProps> = ({ messages, connectedDevices, onSendMessage, isBotLoading, onExit }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isBotLoading) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-800/50">
      <div className="flex items-center p-3 border-b border-slate-700">
        <button onClick={onExit} className="p-2 mr-2 text-slate-300 transition-colors rounded-full hover:bg-slate-700">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-white">Device Chat</h2>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            {connectedDevices.map(d => <DeviceTypeIcon key={d.id} type={d.type} />)}
            <span>{connectedDevices.length} devices online</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {messages.map(msg => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {isBotLoading && (
            <div className="flex items-end justify-start gap-2">
              <div className="flex items-center justify-center gap-1.5 px-4 py-3 bg-slate-700 rounded-2xl rounded-bl-none">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="p-4 mt-auto border-t border-slate-700">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Message your devices..."
            className="flex-1 w-full px-4 py-3 text-white transition-colors duration-200 bg-slate-700 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={isBotLoading || !inputText.trim()}
            className="p-3 text-white transition-all duration-200 bg-indigo-600 rounded-full hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:scale-110"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};
