
import React, { useState, useRef } from 'react';
import { Plus, Trash2, Folder, X, ShieldCheck, User, Download, Upload, Database, Settings, LogOut } from 'lucide-react';
import { Group } from '../types';
import { useAuth } from '../context/AuthContext';
import { persistenceService } from '../services/persistenceService';

interface SidebarProps {
  groups: Group[];
  activeGroupId: string | null;
  onSelectGroup: (id: string) => void;
  onCreateGroup: (name: string) => void;
  onDeleteGroup: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  groups,
  activeGroupId,
  onSelectGroup,
  onCreateGroup,
  onDeleteGroup,
  isOpen,
  onClose
}) => {
  const { goToLanding, username, isGuest, logout } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [showMaintenance, setShowMaintenance] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroupName.trim()) {
      onCreateGroup(newGroupName);
      setNewGroupName('');
      setIsCreating(false);
    }
  };

  const handleExport = async () => {
    const json = await persistenceService.exportVault();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orbit_vault_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (re) => {
        try {
          const content = re.target?.result as string;
          await persistenceService.importVault(content);
          window.location.reload(); 
        } catch (err) {
          alert("Import failed. Invalid JSON structure.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <aside className={`
      fixed md:static inset-y-0 left-0 z-30 w-72 bg-surface border-r border-border flex flex-col transition-transform duration-300 transform 
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border shrink-0">
        <div className="flex items-center gap-2 cursor-pointer" onClick={goToLanding}>
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
          <span className="text-xl font-black tracking-tighter">ORBIT</span>
        </div>
        <button onClick={onClose} className="md:hidden p-2 text-secondary hover:text-primary"><X size={20} /></button>
      </div>

      {/* Folders List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        <div className="flex items-center justify-between px-2 mb-4">
          <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">CONTEXT FOLDERS</span>
          <button 
            onClick={() => setIsCreating(true)} 
            className="p-1 hover:bg-border rounded text-secondary hover:text-primary transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        {isCreating && (
          <form onSubmit={handleCreate} className="px-2 mb-4">
            <input 
              autoFocus
              className="w-full bg-background border border-accent rounded p-2 text-sm text-primary outline-none"
              placeholder="Folder Name..."
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
              onBlur={() => !newGroupName && setIsCreating(false)}
            />
          </form>
        )}

        {groups.map(group => (
          <div 
            key={group.id}
            className={`
              group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all
              ${activeGroupId === group.id ? 'bg-blue-600 text-white shadow-lg' : 'text-secondary hover:bg-border/50 hover:text-primary'}
            `}
            onClick={() => {
              onSelectGroup(group.id);
              onClose();
            }}
          >
            <div className="flex items-center gap-3">
              <Folder size={18} className={activeGroupId === group.id ? 'text-white' : 'text-zinc-500 group-hover:text-blue-500'} />
              <span className="text-sm font-bold truncate max-w-[150px]">{group.name}</span>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if(confirm(`Delete folder "${group.name}"?`)) onDeleteGroup(group.id);
              }}
              className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-black/20 transition-all ${activeGroupId === group.id ? 'text-white' : 'text-red-500'}`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* User & Maintenance Section */}
      <div className="p-4 border-t border-border space-y-2">
        <button 
          onClick={() => setShowMaintenance(!showMaintenance)}
          className="w-full p-3 rounded-xl hover:bg-border/50 transition-colors flex items-center justify-between text-secondary group"
        >
          <div className="flex items-center gap-3">
            <Settings size={18} className="group-hover:rotate-45 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-wider">Maintenance</span>
          </div>
          <Database size={14} className={isGuest ? 'text-blue-500' : 'text-green-500'} />
        </button>

        {showMaintenance && (
          <div className="px-2 pb-4 space-y-1 animate-in slide-in-from-bottom-2 duration-200">
            <button 
              onClick={handleExport}
              className="w-full flex items-center gap-2 p-2.5 rounded-lg text-[10px] font-black uppercase text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Download size={14} /> Export Vault (JSON)
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-2 p-2.5 rounded-lg text-[10px] font-black uppercase text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Upload size={14} /> Import Backup
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".json" 
              onChange={handleImport} 
            />
          </div>
        )}

        <div className="flex items-center gap-3 p-3 bg-background rounded-2xl border border-border">
          <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500">
            <User size={16} />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-black truncate uppercase tracking-tighter">{username}</p>
            <p className="text-[10px] text-zinc-500 font-mono flex items-center gap-1 uppercase">
              <ShieldCheck size={10} className={isGuest ? 'text-zinc-600' : 'text-emerald-500'} /> 
              {isGuest ? 'Local Vault' : 'Cloud Active'}
            </p>
          </div>
          <button 
            onClick={logout}
            className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
