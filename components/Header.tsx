
import React from 'react';
import { BluetoothIcon } from './icons/Icons';

export const Header: React.FC = () => {
  return (
    <header className="flex-shrink-0 bg-slate-900/70 backdrop-blur-sm shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          <BluetoothIcon className="w-7 h-7 text-cyan-400" />
          <h1 className="text-xl font-bold tracking-tight text-white">
            Bluetooth Chat Room
          </h1>
        </div>
      </div>
    </header>
  );
};
