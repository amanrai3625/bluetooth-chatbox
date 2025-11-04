
import { GoogleGenAI, Chat } from "@google/genai";
import type { Device } from '../types';

class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;

  constructor() {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  startChat(devices: Device[]) {
    const deviceNames = devices.map(d => d.name).join(', ');
    const systemInstruction = `You are a helpful AI assistant representing a group of connected Bluetooth devices. The currently connected devices are: ${deviceNames}. Respond to the user's queries from the perspective of these devices, being concise, helpful, and with a slightly technical, gadget-like personality. Do not use markdown.`;
    
    this.chat = this.ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
      },
    });
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.chat) {
      throw new Error("Chat not initialized. Call startChat first.");
    }
    try {
      const response = await this.chat.sendMessage({ message });
      return response.text;
    } catch (error) {
      console.error("Gemini API error:", error);
      return "There was an error processing your request.";
    }
  }
}

export const geminiService = new GeminiService();
