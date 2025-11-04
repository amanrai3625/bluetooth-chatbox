
export interface Device {
  id: string;
  name: string;
  type: 'headset' | 'phone' | 'watch' | 'lightbulb' | 'speaker';
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export enum Screen {
  Welcome,
  DeviceScanner,
  Confirmation,
  ChatRoom,
}
