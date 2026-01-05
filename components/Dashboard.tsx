
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Sun, Moon, Zap, Menu, Folder, Trash2, X, AlertTriangle, Settings2, Loader2, Database, CloudOff, Pin } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { ItemCard } from './ItemCard';
import { ItemDetail } from './ItemDetail';
import { LiveAssistant } from './LiveAssistant';
import { Group, Item, LogEntry, LogType, VisualType, IconName, Theme } from '../types';
import { persistenceService } from '../services/persistenceService';
import { IS_SUPABASE_CONFIGURED } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [folders, setFolders] = useState<Group[]>([]);
  const [projects, setProjects] = useState<Item[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [theme, setTheme] = useState<Theme>('night');
  const [loading, setLoading] = useState(true);

  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreatingItem, setIsCreatingItem] = useState(false);
  
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemLink, setNewItemLink] = useState('');
  const [visualMode, setVisualMode] = useState<'icon' | 'text'>('icon');
  const [newItemIcon, setNewItemIcon] = useState<IconName>('Box');
  const [newItemTextLogo, setNewItemTextLogo] = useState('');

  const [isManageMode, setIsManageMode] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState<Set<string>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const DEFAULT_ICONS: IconName[] = ['Box', 'Zap', 'Globe', 'Cpu', 'Wallet', 'FileText', 'Target', 'Layers'];

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      let fData = await persistenceService.getFolders(user.id);
      
      // Seed demo data if totally empty
      if (fData.length === 0) {
        await persistenceService.seedDemoData(user.id);
        fData = await persistenceService.getFolders(user.id);
      }

      const [pData, lData] = await Promise.all([
        persistenceService.getProjects(user.id),
        persistenceService.getLogs(user.id)
      ]);

      setFolders(fData);
      setProjects(pData);
      setLogs(lData);

      if (fData.length > 0 && !activeGroupId) {
        setActiveGroupId(fData[0].id);
      }
    } catch (err) {
      console.error("Dashboard Fetch Failed", err);
    } finally {
      setLoading(false);
    }
  }, [user, activeGroupId]);

  useEffect(() => {
    fetchData();
  }, [user]);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('dark', 'power-mode');
    if (theme === 'night') html.classList.add('dark');
    else if (theme === 'power') html.classList.add('dark', 'power-mode');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'day' ? 'night' : prev === 'night' ? 'power' : 'day');
  };

  const createGroup = async (name: string) => {
    if (!user) return;
    const newFolder = await persistenceService.createFolder(user.id, name, folders.length);
    if (newFolder) {
      setFolders([...folders, newFolder]);
      setActiveGroupId(newFolder.id);
    }
  };

  const deleteGroup = async (id: string) => {
    if (!user) return;
    const success = await persistenceService.deleteFolder(user.id, id);
    if (success) {
      setFolders(folders.filter(f => f.id !== id));
      setProjects(projects.filter(p => p.groupId !== id));
      if (activeGroupId === id) {
        const remaining = folders.filter(f => f.id !== id);
        setActiveGroupId(remaining.length > 0 ? remaining[0].id : null);
      }
    }
  };

  const createItem = async () => {
    if (!activeGroupId || !newItemTitle.trim() || !user) return;

    let vType: VisualType = newItemLink ? 'text' : 'icon'; 
    let vData: string = newItemIcon;

    if (!newItemLink) {
       vType = visualMode === 'text' ? 'text' : 'icon';
       vData = visualMode === 'text' ? (newItemTextLogo || newItemTitle.substring(0, 3)) : newItemIcon;
    }

    const newItem = await persistenceService.createProject(user.id, activeGroupId, {
      title: newItemTitle,
      link: newItemLink || undefined,
      visualType: vType,
      visualData: vData
    });

    if (newItem) {
      setProjects([newItem, ...projects]);
      setNewItemTitle('');
      setNewItemLink('');
      setIsCreatingItem(false);
    }
  };

  const updateItem = async (itemId: string, updates: Partial<Item>) => {
    if (!user) return;
    const success = await persistenceService.updateProject(user.id, itemId, updates);
    if (success) {
      setProjects(prev => prev.map(p => p.id === itemId ? { ...p, ...updates, updatedAt: Date.now() } : p));
    }
  };

  const togglePin = async (itemId: string) => {
    if (!user) return;
    const project = projects.find(p => p.id === itemId);
    if (!project) return;

    const folderProjects = projects.filter(p => p.groupId === project.groupId);
    const pinnedCount = folderProjects.filter(p => p.isPinned).length;

    if (!project.isPinned && pinnedCount >= 3) {
      alert("Commander, context stability limited to 3 pinned units per folder.");
      return;
    }

    const nextPinned = !project.isPinned;
    const success = await persistenceService.updateProject(user.id, itemId, { isPinned: nextPinned });
    if (success) {
      setProjects(prev => prev.map(p => p.id === itemId ? { ...p, isPinned: nextPinned, updatedAt: Date.now() } : p));
    }
  };

  const addLog = async (itemId: string, content: string, type: LogType) => {
    if (!user) return;
    const newLog = await persistenceService.createLog(user.id, itemId, content, type);
    if (newLog) {
      setLogs([newLog, ...logs]);
      setProjects(prev => prev.map(p => p.id === itemId ? { ...p, updatedAt: Date.now() } : p));
    }
  };

  const updateLog = async (logId: string, content: string) => {
    if (!user) return;
    const success = await persistenceService.updateLog(user.id, logId, content);
    if (success) {
      setLogs(logs.map(l => l.id === logId ? { ...l, content } : l));
    }
  };

  const deleteLog = async (logId: string) => {
    if (!user) return;
    const success = await persistenceService.deleteLog(user.id, logId);
    if (success) {
      setLogs(logs.filter(l => l.id !== logId));
    }
  };

  const executeBulkDelete = async () => {
    if (!user) return;
    if (deleteConfirmText.toLowerCase() === 'delete') {
      const idsToDelete = Array.from(selectedForDeletion) as string[];
      const success = await persistenceService.deleteProjects(user.id, idsToDelete);
      if (success) {
        setProjects(projects.filter(p => !selectedForDeletion.has(p.id)));
        setLogs(logs.filter(l => !selectedForDeletion.has(l.itemId)));
        setSelectedForDeletion(new Set());
        setIsManageMode(false);
        setShowDeleteModal(false);
        setDeleteConfirmText('');
      }
    }
  };

  const activeGroupItems = useMemo(() => {
    return projects
      .filter(i => i.groupId === activeGroupId)
      .sort((a, b) => {
        // First priority: Pinned status
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        // Second priority: Most recently updated
        return b.updatedAt - a.updatedAt;
      });
  }, [projects, activeGroupId]);

  const selectedItem = projects.find(i => i.id === selectedItemId);
  const selectedItemLogs = logs.filter(l => l.itemId === selectedItemId).sort((a,b) => b.createdAt - a.createdAt);

  if (loading) {
    return (
      <div className="h-screen w-full bg-background flex flex-col items-center justify-center">
        <Loader2 size={40} className="text-accent animate-spin mb-4" />
        <p className="text-secondary font-mono text-xs uppercase tracking-widest animate-pulse">Synchronizing Vault...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-background text-primary overflow-hidden transition-colors duration-300">
      <Sidebar 
        groups={folders} 
        activeGroupId={activeGroupId} 
        onSelectGroup={setActiveGroupId}
        onCreateGroup={createGroup}
        onDeleteGroup={deleteGroup}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col h-full relative">
        <div className="h-16 border-b border-border flex items-center justify-between px-4 md:px-8 bg-surface shrink-0 z-10">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-secondary hover:text-primary"><Menu size={24} /></button>
              <h2 className="text-lg md:text-xl font-bold text-primary truncate">
                {folders.find(g => g.id === activeGroupId)?.name || "Vault Context"}
              </h2>
              {!IS_SUPABASE_CONFIGURED && (
                <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] font-black text-amber-500 uppercase tracking-tighter">
                  <CloudOff size={10} /> Local Mode
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              {activeGroupItems.length > 0 && (
                <button 
                  onClick={() => {
                    setIsManageMode(!isManageMode);
                    setSelectedForDeletion(new Set());
                  }}
                  className={`p-2 rounded-lg transition-all ${isManageMode ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'text-secondary hover:text-primary'}`}
                >
                  <Settings2 size={20} />
                </button>
              )}

              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-border/50 text-secondary hover:text-primary transition-colors">
                {theme === 'day' && <Sun size={20} />}
                {theme === 'night' && <Moon size={20} />}
                {theme === 'power' && <Zap size={20} className="text-accent fill-accent animate-pulse" />}
              </button>

              {activeGroupId && !isManageMode && (
                <button 
                  onClick={() => setIsCreatingItem(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-primary text-surface rounded-md font-bold hover:opacity-90 transition-opacity shadow-lg"
                >
                  <Plus size={18} />
                  <span className="hidden md:inline">Project</span>
                  <span className="md:hidden">Add</span>
                </button>
              )}

              {isManageMode && selectedForDeletion.size > 0 && (
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md font-black hover:bg-red-500 transition-all shadow-lg animate-in fade-in slide-in-from-right-2"
                >
                  <Trash2 size={18} />
                  <span>Purge ({selectedForDeletion.size})</span>
                </button>
              )}
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {folders.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full text-secondary opacity-50">
                  <Folder size={48} className="mb-4" />
                  <p className="font-bold">No Folders Created.</p>
                  <button onClick={() => setIsSidebarOpen(true)} className="mt-4 text-accent hover:underline">Create your first folder context</button>
               </div>
            ) : activeGroupId ? (
              activeGroupItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-secondary opacity-50">
                  <div className="w-16 h-16 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-4">
                     <Folder size={24} />
                  </div>
                  <p className="font-bold">Folder is empty.</p>
                  <p className="text-xs">Projects you add will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-20">
                  {activeGroupItems.map(item => (
                    <ItemCard 
                      key={item.id} 
                      item={item} 
                      isManageMode={isManageMode}
                      isSelected={selectedForDeletion.has(item.id)}
                      onSelect={() => {
                         const next = new Set(selectedForDeletion);
                         if (next.has(item.id)) next.delete(item.id); else next.add(item.id);
                         setSelectedForDeletion(next);
                      }}
                      onTogglePin={() => togglePin(item.id)}
                      onClick={() => !isManageMode && setSelectedItemId(item.id)}
                      onLinkClick={(e) => {
                        e.stopPropagation();
                        if(item.link) window.open(item.link, '_blank');
                      }}
                    />
                  ))}
                </div>
              )
            ) : (
               <div className="flex flex-col items-center justify-center h-full text-secondary">
                  <p>Select a context to begin</p>
               </div>
            )}
        </div>
        
        {isCreatingItem && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface border border-border p-6 rounded-2xl w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95">
              <h3 className="text-lg font-bold mb-4 text-primary">New Project</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-secondary mb-1 uppercase">Title</label>
                  <input autoFocus className="w-full bg-background border border-border rounded-lg p-2.5 text-primary focus:border-accent outline-none" value={newItemTitle} onChange={e => setNewItemTitle(e.target.value)} placeholder="e.g. Berachain Airdrop" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary mb-1 uppercase">URL (Optional)</label>
                  <input className="w-full bg-background border border-border rounded-lg p-2.5 text-primary focus:border-accent outline-none" value={newItemLink} onChange={e => setNewItemLink(e.target.value)} placeholder="https://..." />
                </div>
                {!newItemLink && (
                  <div>
                    <label className="block text-xs font-bold text-secondary mb-2 uppercase">Identity</label>
                    <div className="flex p-1 bg-background border border-border rounded-lg mb-3">
                       <button onClick={() => setVisualMode('icon')} className={`flex-1 py-1 text-xs font-bold rounded-md transition-all ${visualMode === 'icon' ? 'bg-zinc-700 text-white shadow' : 'text-zinc-500'}`}>Icon</button>
                       <button onClick={() => setVisualMode('text')} className={`flex-1 py-1 text-xs font-bold rounded-md transition-all ${visualMode === 'text' ? 'bg-zinc-700 text-white shadow' : 'text-zinc-500'}`}>Text</button>
                    </div>
                    {visualMode === 'icon' ? (
                      <div className="flex flex-wrap gap-2">{DEFAULT_ICONS.map(icon => (<button key={icon} onClick={() => setNewItemIcon(icon)} className={`p-2 rounded-lg border transition-all ${newItemIcon === icon ? 'bg-accent border-accent text-white' : 'bg-background border-border text-secondary'}`}>{icon.substring(0,2)}</button>))}</div>
                    ) : (
                      <input className="w-full bg-background border border-border rounded-lg p-2.5 text-center text-primary font-black uppercase" maxLength={3} placeholder="ABC" value={newItemTextLogo} onChange={(e) => setNewItemTextLogo(e.target.value.toUpperCase())} />
                    )}
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setIsCreatingItem(false)} className="flex-1 py-3 rounded-xl border border-border text-secondary font-medium">Cancel</button>
                  <button onClick={createItem} disabled={!newItemTitle} className="flex-1 py-3 rounded-xl bg-primary text-surface font-bold disabled:opacity-50">Create</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-surface border border-red-500/20 w-full max-w-sm rounded-2xl p-8 shadow-2xl">
              <div className="flex flex-col items-center text-center gap-4 mb-8">
                <AlertTriangle size={32} className="text-red-500" />
                <h3 className="text-2xl font-black text-primary uppercase">Purge {selectedForDeletion.size} Units?</h3>
                <p className="text-sm text-secondary leading-relaxed">This will permanently delete these projects and all associated logs from the Orbit network.</p>
                <div className="p-3 bg-background/50 rounded-lg border border-border w-full">
                  <p className="text-xs text-zinc-400">Type <span className="text-white font-mono font-bold">delete</span> to authorize.</p>
                </div>
              </div>
              <input autoFocus className="w-full bg-background border border-border rounded-xl p-4 text-center font-black tracking-widest text-primary focus:border-red-500 outline-none uppercase" placeholder="delete" value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} />
              <div className="flex gap-4 mt-6">
                <button onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }} className="flex-1 py-4 border border-border rounded-xl text-secondary font-black text-xs uppercase">Abort</button>
                <button onClick={executeBulkDelete} disabled={deleteConfirmText.toLowerCase() !== 'delete'} className="flex-1 py-4 bg-red-600 disabled:bg-zinc-800 disabled:text-zinc-500 rounded-xl text-white font-black text-xs uppercase">Confirm Purge</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedItem && (
        <ItemDetail 
          item={selectedItem}
          logs={selectedItemLogs}
          onClose={() => setSelectedItemId(null)}
          onUpdateItem={(updates) => updateItem(selectedItem.id, updates)}
          onTogglePin={() => togglePin(selectedItem.id)}
          onAddLog={(content, type) => addLog(selectedItem.id, content, type)}
          onUpdateLog={updateLog}
          onDeleteLog={deleteLog}
          onDeleteProject={async () => {
             setSelectedForDeletion(new Set([selectedItem.id]));
             setShowDeleteModal(true);
             setSelectedItemId(null);
          }}
        />
      )}

      <LiveAssistant groups={folders} items={projects} logs={logs} onOpenItem={setSelectedItemId} />
    </div>
  );
};
