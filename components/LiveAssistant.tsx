import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Radio } from 'lucide-react';
import { LiveSession } from '../services/geminiService';
import { Group, Item, LogEntry } from '../types';

interface LiveAssistantProps {
  groups: Group[];
  items: Item[];
  logs: LogEntry[];
  onOpenItem: (id: string) => void;
}

export const LiveAssistant: React.FC<LiveAssistantProps> = ({ groups, items, logs, onOpenItem }) => {
  const [status, setStatus] = useState<string>('idle');
  const sessionRef = useRef<LiveSession | null>(null);

  useEffect(() => {
    sessionRef.current = new LiveSession(setStatus);
    return () => {
      sessionRef.current?.stop();
    };
  }, []);

  const toggleSession = async () => {
    if (status === 'idle' || status === 'error' || status === 'disconnected') {
      await sessionRef.current?.start({ groups, items, logs, onOpenItem });
    } else {
      await sessionRef.current?.stop();
    }
  };

  const isLive = status === 'active';
  const isConnecting = status === 'connecting';

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={toggleSession}
        className={`flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 ${
          isLive 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : isConnecting 
              ? 'bg-yellow-500' 
              : 'bg-accent hover:bg-blue-600'
        }`}
      >
        {isLive ? (
          <Radio className="w-6 h-6 text-white" />
        ) : isConnecting ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
      </button>
      
      {/* Status Tooltip */}
      <div className={`absolute bottom-16 right-0 bg-surface border border-border px-3 py-1 rounded text-xs font-mono text-zinc-400 whitespace-nowrap transition-opacity ${status === 'idle' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        Orbit AI: {status.toUpperCase()}
      </div>
    </div>
  );
};