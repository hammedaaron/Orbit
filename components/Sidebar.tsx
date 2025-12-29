import React, { useState } from 'react';
import { Plus, Trash2, Folder, X, ShieldCheck, User } from 'lucide-react';
import { Group } from '../types';
import { useAuth } from '../context/AuthContext';

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
  const { goToLanding, username } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroupName.trim()) {
      onCreateGroup(newGroupName);
      setNewGroupName('');
      setIsCreating(false);
    }
  };

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border flex flex-col transform transition-transform duration-300 ease-in-out
    md:relative md:translate-x-0
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div className={sidebarClasses}>
        <div className="p-4 border-b border-border flex justify-between items-center h-16">
          <button 
            onClick={goToLanding}
            className="flex items-center gap-2 group/logo"
          >
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2 text-primary group-hover/logo:text-accent transition-colors">
              <div className="w-3 h-3 rounded-full bg-accent animate-pulse"></div>
              ORBIT
            </h1>
          </button>
          <button onClick={onClose} className="md:hidden text-secondary">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="px-2 py-2 mb-1">
             <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">My Folders</span>
          </div>
          {groups.map((group) => (
            <div
              key={group.id}
              onClick={() => {
                onSelectGroup(group.id);
                onClose();
              }}
              className={`group flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                activeGroupId === group.id
                  ? 'bg-primary text-surface shadow-md'
                  : 'text-secondary hover:bg-background hover:text-primary'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Folder size={16} />
                <span className="text-sm font-medium truncate">{group.name}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Permanently delete folder "${group.name}" and all its contents?`)) {
                    onDeleteGroup(group.id);
                  }
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          {isCreating ? (
            <form onSubmit={handleCreate} className="p-2 animate-in slide-in-from-top-1 duration-200">
              <input
                autoFocus
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Folder Name"
                className="w-full bg-background border border-border rounded px-2 py-1.5 text-sm text-primary focus:outline-none focus:border-accent"
                onBlur={() => {
                   if (!newGroupName.trim()) setIsCreating(false);
                }}
              />
            </form>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center gap-2 p-2 text-zinc-500 hover:text-accent hover:bg-zinc-800/10 rounded-md transition-colors text-sm font-medium mt-2"
            >
              <Plus size={16} />
              <span>New Folder</span>
            </button>
          )}
        </div>

        <div className="p-4 border-t border-border flex flex-col gap-3 bg-background/20">
           {/* Personalized User Label */}
           <div className="flex items-center gap-2 px-1">
              <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <User size={12} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black text-primary truncate uppercase tracking-tight">
                  {username ? `${username}'s Orbit` : 'Commander\'s Orbit'}
                </p>
              </div>
           </div>

           <div className="space-y-1.5">
             <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
                <ShieldCheck size={12} />
                <span>Vault Locked (Local)</span>
             </div>
             <div className="flex justify-between items-center text-[9px] text-zinc-600 font-mono">
                <span>ORBIT OS v1.2.5</span>
                <span>HAMSTAR</span>
             </div>
           </div>
        </div>
      </div>
    </>
  );
};