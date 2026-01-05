
import React from 'react';
import { Item, getStatus } from '../types';
import * as Icons from 'lucide-react';

interface ItemCardProps {
  item: Item;
  isManageMode?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onClick: () => void;
  onLinkClick: (e: React.MouseEvent) => void;
  onTogglePin: (e: React.MouseEvent) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ 
  item, 
  onClick, 
  onLinkClick, 
  isManageMode = false, 
  isSelected = false,
  onSelect,
  onTogglePin
}) => {
  const status = getStatus(item.progress);
  
  // Dynamic Icon Rendering
  const IconComponent = (Icons as any)[item.visualData] || Icons.Box;

  return (
    <div 
      onClick={isManageMode ? onSelect : onClick}
      className={`
        glass-card alive-shimmer rounded-xl p-5 cursor-pointer transition-all duration-300 relative flex flex-col h-52 justify-between
        ${isManageMode ? 'hover:scale-[1.01]' : 'hover:scale-[1.02] hover:shadow-2xl'}
        ${isSelected ? 'border-red-500/50 bg-red-500/5' : ''}
        ${item.isPinned ? 'border-blue-500/40 ring-1 ring-blue-500/20' : ''}
        group
      `}
    >
      {/* Manage Mode Overlay / Selection */}
      {isManageMode && (
        <div className="absolute top-4 left-4 z-20">
          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-red-500 border-red-500' : 'border-zinc-700 bg-black/40'}`}>
            {isSelected && <Icons.Check size={14} className="text-white" />}
          </div>
        </div>
      )}

      {/* Top Section: Visual + Status */}
      <div className="flex justify-between items-start">
        
        {/* Visual Container */}
        <div className={`
          flex items-center justify-center rounded-xl shadow-lg
          ${item.visualType === 'text' ? 'w-16 h-12 bg-gradient-to-br from-zinc-800 to-black border border-zinc-700' : 'w-12 h-12 bg-zinc-800/80'}
        `}>
          {item.visualType === 'icon' && (
            <IconComponent size={24} className="text-zinc-200" />
          )}
          
          {item.visualType === 'text' && (
             <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 tracking-tighter">
               {item.visualData.substring(0, 3).toUpperCase()}
             </span>
          )}
          
          {item.visualType === 'image' && (
            <img src={item.visualData} alt="icon" className="w-full h-full object-cover rounded-xl" />
          )}
        </div>

        {/* Top-Right Actions */}
        <div className="flex items-center gap-1.5">
          {item.isPinned && !isManageMode && (
            <div className="p-1.5 bg-blue-500/20 rounded text-blue-400">
               <Icons.Pin size={12} fill="currentColor" />
            </div>
          )}
          
          {!isManageMode && (
            <div className={`text-xs font-bold tracking-wider px-2 py-1 rounded-md bg-black/40 backdrop-blur-md border border-white/5 ${status.color}`}>
              {item.progress}%
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-4">
        <h3 className={`text-lg font-bold text-primary leading-tight mb-1 truncate transition-colors ${!isManageMode ? 'group-hover:text-accent' : ''}`}>
          {item.title}
        </h3>
        <p className={`text-[10px] ${status.color} font-mono uppercase tracking-widest opacity-80`}>
          {status.label}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-zinc-800/50 rounded-full mt-4 overflow-hidden relative">
        <div 
          className={`h-full ${status.bar} transition-all duration-700 ease-out shadow-[0_0_10px_rgba(59,130,246,0.3)]`} 
          style={{ width: `${item.progress}%` }}
        ></div>
      </div>

      {/* Action Buttons - More accessible opacity logic */}
      <div className={`absolute top-4 right-4 flex gap-2 transition-all z-10 ${item.isPinned ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100'}`}>
        {!isManageMode && (
          <button 
            onClick={onTogglePin}
            className={`p-2 backdrop-blur-sm rounded-lg border transition-all ${item.isPinned ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-black/60 border-white/5 text-zinc-300 hover:text-white hover:bg-zinc-800'}`}
            title={item.isPinned ? "Unpin Project" : "Pin Project (Max 3)"}
          >
            <Icons.Pin size={14} fill={item.isPinned ? "currentColor" : "none"} />
          </button>
        )}
        
        {item.link && !isManageMode && (
          <button 
            onClick={onLinkClick}
            className="p-2 bg-black/60 backdrop-blur-sm rounded-lg text-zinc-300 hover:text-white hover:bg-accent border border-white/5 transition-all"
          >
            <Icons.ExternalLink size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
