
import React, { useState, useEffect } from 'react';
import type { Device } from '../types';
import { BluetoothIcon, ScanIcon, HeadsetIcon, SmartphoneIcon, WatchIcon, LightbulbIcon, SpeakerIcon } from './icons/Icons';

interface DeviceScannerProps {
  connectedDevices: Device[];
  onConnect: (device: Device) => void;
  onDisconnect: (deviceId: string) => void;
  onFinalize: () => void;
}

const mockDevices: Device[] = [
  { id: 'pixel-8-pro', name: 'Pixel 8 Pro', type: 'phone' },
  { id: 'sony-wh-1000xm5', name: 'Sony WH-1000XM5', type: 'headset' },
  { id: 'galaxy-watch-6', name: 'Galaxy Watch 6', type: 'watch' },
  { id: 'philips-hue-bulb', name: 'Philips Hue Bulb', type: 'lightbulb' },
  { id: 'jbl-charge-5', name: 'JBL Charge 5', type: 'speaker' },
];

const DeviceTypeIcon: React.FC<{ type: Device['type'] }> = ({ type }) => {
  switch (type) {
    case 'headset': return <HeadsetIcon className="w-6 h-6 text-cyan-400" />;
    case 'phone': return <SmartphoneIcon className="w-6 h-6 text-cyan-400" />;
    case 'watch': return <WatchIcon className="w-6 h-6 text-cyan-400" />;
    case 'lightbulb': return <LightbulbIcon className="w-6 h-6 text-cyan-400" />;
    case 'speaker': return <SpeakerIcon className="w-6 h-6 text-cyan-400" />;
    default: return null;
  }
};


export const DeviceScanner: React.FC<DeviceScannerProps> = ({ connectedDevices, onConnect, onDisconnect, onFinalize }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<Device[]>([]);

  const startScan = () => {
    setIsScanning(true);
    setDiscoveredDevices([]);
    setTimeout(() => {
      setDiscoveredDevices(mockDevices);
      setIsScanning(false);
    }, 2500);
  };
  
  useEffect(() => {
    startScan();
  }, []);

  const isConnected = (device: Device) => connectedDevices.some(d => d.id === device.id);

  return (
    <div className="flex flex-col h-full p-4 md:p-6 bg-slate-800/50">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Step 1: Connect Devices</h2>
        <p className="text-slate-400">Scan for nearby devices to add to the chat room.</p>
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={startScan}
          disabled={isScanning}
          className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 bg-cyan-600 rounded-full hover:bg-cyan-500 disabled:bg-slate-500 disabled:cursor-not-allowed transform hover:scale-105"
        >
          {isScanning ? (
            <>
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 9.27455 20.9097 6.80375 19.1414 5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Scanning...
            </>
          ) : (
            <>
              <ScanIcon className="w-5 h-5" />
              Scan for Devices
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <h3 className="text-lg font-semibold text-slate-300 mb-3">Available Devices</h3>
        {isScanning && (
          <div className="text-center text-slate-400 p-8">
            Searching for devices in your area...
          </div>
        )}
        {!isScanning && discoveredDevices.length === 0 && (
            <div className="text-center text-slate-500 p-8 bg-slate-900/50 rounded-lg">
                No devices found. Try scanning again.
            </div>
        )}
        <ul className="space-y-3">
          {discoveredDevices.map(device => (
            <li
              key={device.id}
              className="flex items-center justify-between p-4 transition-all duration-200 bg-slate-700/50 rounded-lg hover:bg-slate-700"
            >
              <div className="flex items-center gap-4">
                <DeviceTypeIcon type={device.type} />
                <span className="font-medium text-slate-100">{device.name}</span>
              </div>
              <button
                onClick={() => isConnected(device) ? onDisconnect(device.id) : onConnect(device)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                  isConnected(device)
                    ? 'bg-red-600 hover:bg-red-500 text-white'
                    : 'bg-green-600 hover:bg-green-500 text-white'
                }`}
              >
                {isConnected(device) ? 'Disconnect' : 'Connect'}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 mt-auto border-t border-slate-700">
        <button
          onClick={onFinalize}
          disabled={connectedDevices.length === 0}
          className="w-full flex items-center justify-center gap-2 py-4 font-bold text-lg text-white transition-all duration-300 bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:text-slate-400 transform hover:scale-101"
        >
          <BluetoothIcon className="w-6 h-6" />
          Finalize Setup ({connectedDevices.length} Connected)
        </button>
      </div>
    </div>
  );
};
