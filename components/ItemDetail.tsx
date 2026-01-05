
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ExternalLink, Sparkles, Volume2, FileText, 
  Linkedin, Instagram, Youtube, Trash2, ChevronDown, ChevronUp,
  Bold, Heading1, Heading2, Scissors, List, Share2, Maximize2, Minimize2,
  Pencil, Save, Type, LayoutGrid, AlertTriangle, Pin
} from 'lucide-react';
// Added LogEntry to imports from '../types'
import { Item, getStatus, LogType, IconName, VisualType, LogEntry } from '../types';
import { generateInsights, speakText } from '../services/geminiService';

const DEFAULT_ICONS: IconName[] = ['Box', 'Zap', 'Globe', 'Cpu', 'Wallet', 'FileText', 'Target', 'Layers'];

// Icons
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
);
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
);

const PLATFORMS = [
  { id: 'note', icon: FileText, label: 'Note', color: 'text-zinc-400', bg: 'bg-zinc-800' },
  { id: 'x', icon: XIcon, label: 'X Thread', color: 'text-white', bg: 'bg-black' },
  { id: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: 'text-blue-400', bg: 'bg-blue-900/40' },
  { id: 'instagram', icon: Instagram, label: 'Instagram', color: 'text-pink-400', bg: 'bg-pink-900/40' },
  { id: 'tiktok', icon: TikTokIcon, label: 'TikTok', color: 'text-cyan-400', bg: 'bg-cyan-900/40' },
  { id: 'youtube', icon: Youtube, label: 'YouTube', color: 'text-red-500', bg: 'bg-red-900/40' },
];

interface ItemDetailProps {
  item: Item;
  logs: LogEntry[];
  onClose: () => void;
  onUpdateItem: (updates: Partial<Item>) => void;
  onTogglePin: () => void;
  onAddLog: (content: string, type: LogType) => void;
  onUpdateLog: (logId: string, content: string) => void;
  onDeleteLog: (logId: string) => void;
  onDeleteProject: () => void;
}

// --- Rich Text Rendering Logic ---

const RichTextRenderer: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div 
      className="text-sm text-zinc-300 leading-relaxed 
        [&_h1]:text-2xl [&_h1]:font-black [&_h1]:text-primary [&_h1]:mt-3 [&_h1]:mb-2 
        [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-accent [&_h2]:mt-3 [&_h2]:mb-1 
        [&_ul]:list-disc [&_ul]:list-outside [&_ul]:pl-5 [&_ul]:my-3
        [&_ol]:list-decimal [&_ol]:list-outside [&_ol]:pl-5 [&_ol]:my-3
        [&_li]:mb-1.5 [&_li]:pl-1
        [&_b]:text-white [&_b]:font-black [&_strong]:text-white [&_strong]:font-black"
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  );
};

// --- Expandable Log Card ---

const ExpandableLogCard: React.FC<{ log: LogEntry; onRequestDelete: () => void; onEdit: () => void }> = ({ log, onRequestDelete, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Strip HTML for preview
  const plainText = log.content.replace(/<[^>]+>/g, ' ').trim();
  const previewTitle = plainText.split('.')[0].substring(0, 40) || "Untitled Entry";
  const previewBody = plainText.substring(previewTitle.length).substring(0, 60);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRequestDelete();
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  return (
    <div 
      className={`
        relative rounded-xl transition-all duration-300 overflow-hidden 
        ${isExpanded ? 'glass-card border-accent/30 shadow-lg' : 'bg-background/40 border border-border/50 hover:bg-background/60 cursor-pointer'}
        ${!isExpanded ? 'hover:scale-[1.01]' : ''}
      `}
      onClick={() => !isExpanded && setIsExpanded(true)}
    >
      {/* Subtle Shimmer */}
      {!isExpanded && <div className="absolute inset-0 alive-shimmer opacity-20 pointer-events-none"></div>}

      <div className="p-4">
        {/* Header Row */}
        <div className="flex items-center gap-2 mb-2">
           <div className={`w-2 h-2 rounded-full ${
              log.type === 'seen' ? 'bg-zinc-500' : log.type === 'gained' ? 'bg-green-500' : 'bg-blue-500'
          }`} />
          <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">{log.type}</span>
          <span className="text-[10px] text-zinc-600 ml-auto font-mono">{new Date(log.createdAt).toLocaleDateString()}</span>
          
          <button 
            onClick={(e) => {
               e.stopPropagation();
               setIsExpanded(!isExpanded);
            }}
            className="text-secondary hover:text-primary p-1 rounded-full hover:bg-zinc-800 transition-colors z-20 relative"
          >
             {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>

        {/* Content */}
        {isExpanded ? (
          <div className="animate-in fade-in slide-in-from-top-1 duration-200">
             <div className="py-2">
                <RichTextRenderer content={log.content} />
             </div>
             
             {/* Action Bar */}
             <div 
                className="mt-4 pt-3 border-t border-white/5 flex justify-end gap-2 relative z-20"
                onClick={(e) => e.stopPropagation()} 
             >
                <button 
                  onClick={handleEditClick}
                  className="flex items-center gap-1.5 text-xs text-secondary hover:text-primary px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Pencil size={12} /> Edit
                </button>
                <button 
                  onClick={handleDeleteClick}
                  className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20 cursor-pointer"
                >
                  <Trash2 size={12} /> Delete
                </button>
             </div>
          </div>
        ) : (
          <div>
            <h4 className="text-sm font-bold text-primary truncate pr-8">{previewTitle}</h4>
            {previewBody && (
              <p className="text-xs text-secondary mt-1 truncate opacity-70 pl-0.5">{previewBody}...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const ItemDetail: React.FC<ItemDetailProps> = ({
  item,
  logs,
  onClose,
  onUpdateItem,
  onTogglePin,
  onAddLog,
  onUpdateLog,
  onDeleteLog,
  onDeleteProject
}) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(false);
  
  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [activePlatform, setActivePlatform] = useState(PLATFORMS[0]);
  const editorRef = useRef<HTMLDivElement>(null);

  // Project Header Edit State
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editLink, setEditLink] = useState(item.link || '');
  const [editVisualType, setEditVisualType] = useState<VisualType>(item.visualType);
  const [editVisualData, setEditVisualData] = useState(item.visualData);

  // Delete Modal State
  const [logToDelete, setLogToDelete] = useState<string | null>(null);
  const [deleteInput, setDeleteInput] = useState('');

  const status = getStatus(item.progress);

  // --- Actions ---

  const handleSaveNote = () => {
    if (!editorRef.current || !editorRef.current.innerText.trim()) return;
    
    let content = editorRef.current.innerHTML;
    
    if (editingLogId) {
      // If editing existing, just update
      onUpdateLog(editingLogId, content);
      setEditingLogId(null);
    } else {
      // If new, apply prefix
      if (activePlatform.id !== 'note') {
        content = `<h2>[${activePlatform.label}]</h2>${content}`;
      }
      onAddLog(content, 'note');
    }

    if (editorRef.current) editorRef.current.innerHTML = '';
    setIsEditorOpen(false);
  };

  const handleEditLog = (log: LogEntry) => {
    setEditingLogId(log.id);
    setIsEditorOpen(true);
    // Need to wait for editor render to set content
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = log.content;
      }
    }, 100);
  };

  const handleSaveHeader = () => {
    onUpdateItem({
      title: editTitle,
      link: editLink || undefined,
      visualType: editVisualType,
      visualData: editVisualData
    });
    setIsEditingHeader(false);
  };

  const handleQuickLog = (type: LogType) => {
    const prompt = window.prompt(`Log ${type.toUpperCase()} update:`);
    if (prompt) {
      onAddLog(prompt, type);
    }
  };

  const handleInsight = async () => {
    setLoadingInsight(true);
    try {
      // Strip HTML for AI context
      const cleanLogs = logs.map(l => ({
        ...l, 
        content: l.content.replace(/<[^>]+>/g, ' ')
      }));
      const text = await generateInsights(item, cleanLogs);
      setInsight(text);
    } catch (error) {
      setInsight("Failed to generate insight.");
    } finally {
      setLoadingInsight(false);
    }
  };

  const handleTTS = async () => {
    if (playingAudio) return;
    setPlayingAudio(true);
    const recentLogs = logs.slice(0, 5).map(l => l.content.replace(/<[^>]+>/g, ' ')).join('. ');
    const textToRead = `${item.title}. Status: ${status.label}. Recent updates: ${recentLogs}`;
    const audioBuffer = await speakText(textToRead);
    if (audioBuffer) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.start();
      source.onended = () => {
        setPlayingAudio(false);
        ctx.close();
      };
    } else {
        setPlayingAudio(false);
    }
  };

  // Logic to execute the delete after confirmation
  const executeDelete = () => {
    if (logToDelete && deleteInput.toLowerCase() === 'delete') {
      onDeleteLog(logToDelete);
      setLogToDelete(null);
      setDeleteInput('');
    }
  };

  // WYSIWYG Commands
  const execCmd = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  return (
    <>
      {/* Responsive Drawer Container */}
      <div className="fixed inset-0 md:inset-y-0 md:left-auto md:right-0 w-full md:w-[450px] z-40 flex flex-col pointer-events-none">
        
        {/* Backdrop for mobile */}
        <div className="absolute inset-0 bg-black/50 md:hidden pointer-events-auto" onClick={onClose} />
        
        {/* Drawer Content */}
        <div className="relative flex-1 bg-surface md:border-l border-border shadow-2xl flex flex-col pointer-events-auto h-full mt-10 md:mt-0 rounded-t-2xl md:rounded-none overflow-hidden transition-transform duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-border bg-background/50 backdrop-blur-sm">
            {!isEditingHeader ? (
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1 group">
                    <h2 className="text-2xl font-black text-primary tracking-tight truncate">{item.title}</h2>
                    <button 
                      onClick={() => {
                        setEditTitle(item.title);
                        setEditLink(item.link || '');
                        setEditVisualType(item.visualType);
                        setEditVisualData(item.visualData);
                        setIsEditingHeader(true);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-secondary hover:text-accent p-1 transition-opacity"
                    >
                      <Pencil size={14} />
                    </button>
                    <button 
                      onClick={onTogglePin}
                      className={`ml-2 p-1.5 rounded-lg transition-all ${item.isPinned ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-zinc-600 hover:text-blue-500'}`}
                      title={item.isPinned ? "Unpin Unit" : "Pin Unit (Max 3)"}
                    >
                      <Pin size={16} fill={item.isPinned ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono font-bold uppercase ${status.color}`}>{status.label}</span>
                    {item.link && (
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-1 text-[10px] text-secondary hover:text-accent transition-colors border border-border rounded px-1.5 py-0.5"
                      >
                        LINK <ExternalLink size={8} />
                      </a>
                    )}
                  </div>
                </div>
                <button onClick={onClose} className="p-2 -mr-2 text-secondary hover:text-primary rounded-full hover:bg-background">
                  <X size={20} />
                </button>
              </div>
            ) : (
              // --- Edit Mode ---
              <div className="space-y-3 animate-in fade-in">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-secondary uppercase">Edit Project</span>
                    <button onClick={() => setIsEditingHeader(false)}><X size={16} className="text-secondary hover:text-primary"/></button>
                 </div>
                 
                 <input 
                   className="w-full bg-background border border-border rounded p-2 text-sm text-primary focus:border-accent outline-none"
                   value={editTitle}
                   onChange={e => setEditTitle(e.target.value)}
                   placeholder="Project Title"
                 />
                 
                 <input 
                   className="w-full bg-background border border-border rounded p-2 text-sm text-primary focus:border-accent outline-none font-mono"
                   value={editLink}
                   onChange={e => setEditLink(e.target.value)}
                   placeholder="https://"
                 />

                 {/* Visual Editor */}
                 <div className="p-2 bg-background border border-border rounded-lg">
                    <div className="flex gap-1 mb-2">
                       <button onClick={() => setEditVisualType('icon')} className={`flex-1 flex justify-center py-1 rounded text-xs font-bold ${editVisualType === 'icon' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}>
                          <LayoutGrid size={14} />
                       </button>
                       <button onClick={() => setEditVisualType('text')} className={`flex-1 flex justify-center py-1 rounded text-xs font-bold ${editVisualType === 'text' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}>
                          <Type size={14} />
                       </button>
                    </div>
                    {editVisualType === 'icon' ? (
                       <div className="flex flex-wrap gap-1.5">
                          {DEFAULT_ICONS.map(icon => (
                             <button 
                                key={icon}
                                onClick={() => setEditVisualData(icon)}
                                className={`p-1.5 rounded border ${editVisualData === icon ? 'bg-accent border-accent text-white' : 'border-border text-secondary'}`}
                             >
                               {icon.substring(0,2)}
                             </button>
                          ))}
                       </div>
                    ) : (
                       <input 
                          className="w-full bg-surface border border-border rounded p-2 text-center text-primary font-black uppercase"
                          maxLength={3}
                          value={editVisualData}
                          onChange={e => setEditVisualData(e.target.value.toUpperCase())}
                       />
                    )}
                 </div>

                 <button 
                    onClick={handleSaveHeader}
                    className="w-full py-2 bg-accent text-white rounded font-bold text-xs"
                 >
                    Save Changes
                 </button>
              </div>
            )}
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* Progress */}
            <div className="bg-background/50 rounded-lg p-4 border border-border/50">
              <div className="flex justify-between text-xs font-bold text-secondary mb-3">
                <span className="uppercase tracking-wider">Project Progress</span>
                <span>{item.progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={item.progress}
                onChange={(e) => onUpdateItem({ progress: parseInt(e.target.value) })}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${status.bar} slider-thumb outline-none`}
              />
            </div>

            {/* AI Tools */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleInsight}
                disabled={loadingInsight}
                className="flex items-center justify-center gap-2 py-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg text-xs font-bold text-purple-400 transition-colors disabled:opacity-50"
              >
                <Sparkles size={14} />
                {loadingInsight ? 'Thinking...' : 'AI Insight'}
              </button>
              <button 
                onClick={handleTTS}
                disabled={playingAudio}
                className="flex items-center justify-center gap-2 py-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-xs font-bold text-blue-400 transition-colors disabled:opacity-50"
              >
                <Volume2 size={14} />
                {playingAudio ? 'Playing...' : 'Read Status'}
              </button>
            </div>

            {insight && (
              <div className="bg-background border border-border p-4 rounded-lg text-sm text-secondary leading-relaxed animate-in fade-in">
                <h4 className="text-purple-400 font-bold mb-2 flex items-center gap-2 text-xs uppercase">
                  <Sparkles size={12} /> Analysis
                </h4>
                <div className="whitespace-pre-line">{insight}</div>
              </div>
            )}

            {/* Logs Stream */}
            <div>
              <div className="flex items-center justify-between mb-3 sticky top-0 bg-surface py-2 z-10 backdrop-blur-md">
                <h3 className="text-xs font-black text-secondary uppercase tracking-widest">Activity Stream</h3>
                <span className="text-[10px] text-zinc-500">{logs.length} ENTRIES</span>
              </div>
              
              <div className="space-y-3">
                {logs.length === 0 ? (
                    <div className="text-center text-zinc-600 text-xs py-8 border border-dashed border-zinc-800 rounded-lg">
                      No logs recorded yet.
                    </div>
                ) : (
                    logs.map((log) => (
                      <ExpandableLogCard 
                        key={log.id} 
                        log={log} 
                        onEdit={() => handleEditLog(log)}
                        onRequestDelete={() => {
                          setLogToDelete(log.id);
                          setDeleteInput('');
                        }} 
                      />
                    ))
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-surface border-t border-border space-y-3 pb-8 md:pb-4">
            <button
              onClick={() => {
                setEditingLogId(null);
                setIsEditorOpen(true);
                // Clear editor if it was reused
                if(editorRef.current) editorRef.current.innerHTML = '';
              }}
              className="w-full py-3 bg-primary hover:opacity-90 text-surface rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
            >
              <FileText size={18} />
              Write New Entry
            </button>
            <div className="grid grid-cols-2 gap-2">
               <button
                 onClick={() => handleQuickLog('seen')}
                 className="py-2.5 bg-background border border-border hover:bg-border/50 text-secondary rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors"
               >
                 Log Seen
               </button>
               <button
                 onClick={() => handleQuickLog('gained')}
                 className="py-2.5 bg-background border border-border hover:bg-border/50 text-green-500 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors"
               >
                 Log Gained
               </button>
            </div>
            
            <button 
              onClick={onDeleteProject}
              className="w-full py-2.5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <Trash2 size={12} /> Purge Project
            </button>
          </div>
        </div>
      </div>

      {/* --- Delete Confirmation Modal --- */}
      {logToDelete && (
         <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-surface border border-red-500/20 w-full max-w-sm rounded-xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
               <div className="flex flex-col items-center text-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
                     <AlertTriangle size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-primary">Permanently Delete?</h3>
                  <p className="text-sm text-secondary leading-relaxed">
                    This action cannot be undone. To confirm, please type <span className="font-mono font-bold text-primary select-all">delete</span> below.
                  </p>
               </div>
               
               <input 
                  autoFocus
                  className="w-full bg-background border border-border rounded-lg p-3 text-center font-bold tracking-widest text-primary focus:border-red-500 focus:outline-none transition-colors uppercase placeholder:normal-case placeholder:font-medium placeholder:tracking-normal mb-6"
                  placeholder="Type delete"
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
               />
               
               <div className="flex gap-3">
                  <button 
                     onClick={() => {
                        setLogToDelete(null);
                        setDeleteInput('');
                     }}
                     className="flex-1 py-3 bg-transparent hover:bg-white/5 border border-border rounded-lg text-secondary font-bold text-sm transition-colors"
                  >
                     Cancel
                  </button>
                  <button 
                     onClick={executeDelete}
                     disabled={deleteInput.toLowerCase() !== 'delete'}
                     className="flex-1 py-3 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed rounded-lg text-white font-bold text-sm transition-colors"
                  >
                     Delete
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* --- Full Screen WYSIWYG Editor Overlay --- */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-200">
          <div className="w-full h-full md:max-w-4xl md:h-[85vh] bg-surface border-0 md:border border-border md:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            
            {/* Editor Header */}
            <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-background/50">
              <div className="flex items-center gap-3">
                 <button 
                  onClick={() => setIsEditorOpen(false)}
                  className="md:hidden p-2 -ml-2 text-secondary"
                 >
                   <X size={20} />
                 </button>
                 <span className="text-sm font-bold text-primary hidden md:block">{editingLogId ? 'Edit Entry' : 'New Entry'}</span>
              </div>
              
              <div className="flex items-center gap-3">
                 <button 
                    onClick={handleSaveNote}
                    className="px-4 py-1.5 bg-accent text-white rounded-full text-xs font-bold hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <Save size={14} />
                    {editingLogId ? 'Save Changes' : 'Post'}
                    {!editingLogId && activePlatform.id !== 'note' && <span className="opacity-75 text-[10px]">to {activePlatform.label}</span>}
                  </button>
                <button 
                  onClick={() => setIsEditorOpen(false)}
                  className="hidden md:block p-2 text-secondary hover:text-primary rounded-full hover:bg-border/50"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Rich Text Toolbar */}
            <div className="min-h-12 border-b border-border bg-background/30 flex items-center px-4 gap-2 overflow-x-auto no-scrollbar py-2">
              
              {/* Formatting Tools */}
              <div className="flex items-center gap-1 border-r border-border pr-2">
                  <button onClick={() => execCmd('formatBlock', 'H1')} className="p-2 text-secondary hover:text-primary rounded hover:bg-white/5" title="Heading 1"><Heading1 size={18}/></button>
                  <button onClick={() => execCmd('formatBlock', 'H2')} className="p-2 text-secondary hover:text-primary rounded hover:bg-white/5" title="Heading 2"><Heading2 size={18}/></button>
                  <button onClick={() => execCmd('bold')} className="p-2 text-secondary hover:text-primary rounded hover:bg-white/5" title="Bold"><Bold size={18}/></button>
                  <button onClick={() => execCmd('insertUnorderedList')} className="p-2 text-secondary hover:text-primary rounded hover:bg-white/5" title="List"><List size={18}/></button>
                  <button onClick={() => execCmd('insertHorizontalRule')} className="p-2 text-secondary hover:text-accent rounded hover:bg-white/5" title="Separator">
                    <Scissors size={18} /> 
                  </button>
              </div>

              {/* Platform Selectors - Only show if creating new */}
              {!editingLogId && (
                <div className="flex items-center gap-1">
                  {PLATFORMS.map(p => (
                      <button
                        key={p.id}
                        onClick={() => setActivePlatform(p)}
                        title={`Post as ${p.label}`}
                        className={`p-2 rounded-lg transition-all flex items-center justify-center ${
                          activePlatform.id === p.id 
                            ? `${p.bg} ${p.color} ring-1 ring-white/20 shadow-sm` 
                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                        }`}
                      >
                        <p.icon className="w-4 h-4" />
                      </button>
                  ))}
                </div>
              )}
            </div>

            {/* WYSIWYG Editable Area */}
            <div 
               className="flex-1 bg-transparent p-8 overflow-y-auto cursor-text focus:outline-none"
               onClick={() => editorRef.current?.focus()}
            >
              <div
                ref={editorRef}
                contentEditable
                className="prose prose-invert max-w-none outline-none empty:before:content-['Type_your_notes_here...'] empty:before:text-zinc-600 
                  [&_h1]:text-3xl [&_h1]:font-black [&_h1]:text-primary [&_h1]:mt-4 [&_h1]:mb-2 
                  [&_xl]:text-xl [&_h2]:font-bold [&_h2]:text-accent [&_h2]:mt-4 [&_h2]:mb-2 
                  [&_ul]:list-disc [&_ul]:list-outside [&_ul]:pl-5 [&_ul]:my-3
                  [&_ol]:list-decimal [&_ol]:list-outside [&_ol]:pl-5 [&_ol]:my-3
                  [&_li]:mb-1.5 [&_li]:pl-1
                  [&_b]:text-white [&_b]:font-black [&_strong]:text-white [&_strong]:font-black"
                spellCheck={false}
                style={{ minHeight: '100px' }}
              />
            </div>

            {/* Mobile Keyboard Spacer */}
            <div className="h-0 md:hidden pb-[env(safe-area-inset-bottom)]" />
          </div>
        </div>
      )}
    </>
  );
};
