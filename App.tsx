
import React, { useState, useCallback } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { DeviceScanner } from './components/DeviceScanner';
import { ConfirmationScreen } from './components/ConfirmationScreen';
import { ChatRoom } from './components/ChatRoom';
import type { Device, Message } from './types';
import { Screen } from './types';
import { geminiService } from './services/geminiService';
import { Header } from './components/Header';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>(Screen.Welcome);
  const [connectedDevices, setConnectedDevices] = useState<Device[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGeminiLoading, setIsGeminiLoading] = useState<boolean>(false);

  const handleConnect = (device: Device) => {
    setConnectedDevices(prevDevices => {
      if (prevDevices.find(d => d.id === device.id)) {
        return prevDevices;
      }
      return [...prevDevices, device];
    });
  };

  const handleDisconnect = (deviceId: string) => {
    setConnectedDevices(prevDevices => prevDevices.filter(d => d.id !== deviceId));
  };

  const handleBeginSetup = () => setScreen(Screen.DeviceScanner);

  const handleFinalize = () => {
    if (connectedDevices.length > 0) {
      setScreen(Screen.Confirmation);
    }
  };

  const handleConfirmAndLaunch = () => {
    geminiService.startChat(connectedDevices);
    setMessages([
      {
        id: 'initial-bot-message',
        text: `Hello! I am the collective consciousness of your connected devices: ${connectedDevices.map(d => d.name).join(', ')}. How can I assist you today?`,
        sender: 'bot',
        timestamp: new Date().toISOString(),
      },
    ]);
    setScreen(Screen.ChatRoom);
  };
  
  const handleExitChat = () => {
    setScreen(Screen.Welcome);
    setConnectedDevices([]);
    setMessages([]);
  };

  const handleSendMessage = useCallback(async (text: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsGeminiLoading(true);

    try {
      const botResponseText = await geminiService.sendMessage(text);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGeminiLoading(false);
    }
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case Screen.Welcome:
        return <WelcomeScreen onBeginSetup={handleBeginSetup} />;
      case Screen.DeviceScanner:
        return (
          <DeviceScanner
            connectedDevices={connectedDevices}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            onFinalize={handleFinalize}
          />
        );
      case Screen.Confirmation:
        return (
          <ConfirmationScreen
            connectedDevices={connectedDevices}
            onConfirm={handleConfirmAndLaunch}
          />
        );
      case Screen.ChatRoom:
        return (
          <ChatRoom
            messages={messages}
            connectedDevices={connectedDevices}
            onSendMessage={handleSendMessage}
            isBotLoading={isGeminiLoading}
            onExit={handleExitChat}
          />
        );
      default:
        return <WelcomeScreen onBeginSetup={handleBeginSetup} />;
    }
  };

  return (
    <div className="flex flex-col h-full font-sans text-white bg-slate-900">
      <Header />
      <main className="flex-1 overflow-hidden">
        {renderScreen()}
      </main>
    </div>
  );
};

export default App;
