
import React from 'react';
import { BluetoothIcon } from './icons/Icons';

interface WelcomeScreenProps {
  onBeginSetup: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onBeginSetup }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="p-6 mb-6 bg-cyan-500/10 rounded-full">
        <div className="p-4 bg-cyan-500/10 rounded-full animate-pulse">
            <BluetoothIcon className="w-16 h-16 text-cyan-400" />
        </div>
      </div>
      <h1 className="text-4xl font-extrabold text-white mb-4">Device Chat Room Setup</h1>
      <p className="max-w-md mx-auto text-slate-400 mb-8">
        Welcome! This wizard will guide you through connecting your (simulated) Bluetooth devices to create a unified chat experience.
      </p>
      <button
        onClick={onBeginSetup}
        className="px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-indigo-600 rounded-full hover:bg-indigo-500 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
      >
        Begin Setup
      </button>
    </div>
  );
};
