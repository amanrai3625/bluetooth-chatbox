
import React, { useState, useEffect } from 'react';
import type { Device } from '../types';
import { HeadsetIcon, SmartphoneIcon, WatchIcon, LightbulbIcon, SpeakerIcon, RocketIcon } from './icons/Icons';

interface ConfirmationScreenProps {
  connectedDevices: Device[];
  onConfirm: () => void;
}

const DeviceTypeIcon: React.FC<{ type: Device['type'], className?: string }> = ({ type, className="w-6 h-6 text-cyan-400" }) => {
  switch (type) {
    case 'headset': return <HeadsetIcon className={className} />;
    case 'phone': return <SmartphoneIcon className={className} />;
    case 'watch': return <WatchIcon className={className} />;
    case 'lightbulb': return <LightbulbIcon className={className} />;
    case 'speaker': return <SpeakerIcon className={className} />;
    default: return null;
  }
};


export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ connectedDevices, onConfirm }) => {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(oldProgress => {
                if (oldProgress >= 100) {
                    clearInterval(timer);
                    setIsComplete(true);
                    return 100;
                }
                const diff = Math.random() * 20;
                return Math.min(oldProgress + diff, 100);
            });
        }, 300);
        return () => {
            clearInterval(timer);
        };
    }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <h2 className="text-3xl font-bold text-white mb-3">Finalizing Setup</h2>
      <p className="text-slate-400 mb-8">Preparing the chat room for your devices...</p>

      <div className="w-full max-w-md p-6 mb-8 bg-slate-800/50 rounded-lg">
        <h3 className="text-lg font-semibold text-left text-white mb-4">Connected Devices:</h3>
        <ul className="space-y-3 text-left">
          {connectedDevices.map(device => (
            <li key={device.id} className="flex items-center gap-4 p-2 bg-slate-700/50 rounded-md">
                <DeviceTypeIcon type={device.type} />
                <span className="font-medium text-slate-200">{device.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full max-w-md">
        <div className="relative pt-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-300 bg-indigo-800/50">
                {isComplete ? 'Complete' : 'Configuring...'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-indigo-300">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-slate-700">
            <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500 ease-out"></div>
          </div>
        </div>

        <button
          onClick={onConfirm}
          disabled={!isComplete}
          className="w-full flex items-center justify-center gap-3 mt-4 px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-green-600 rounded-lg hover:bg-green-500 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:text-slate-400 transform hover:scale-105"
        >
          {!isComplete && (
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 9.27455 20.9097 6.80375 19.1414 5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          )}
          {isComplete ? (
            <>
              <RocketIcon className="w-6 h-6" />
              Launch Chat Room
            </>
          ) : (
            'Installing...'
          )}
        </button>
      </div>
    </div>
  );
};
