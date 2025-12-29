
import { supabase, IS_SUPABASE_CONFIGURED } from '../supabaseClient';
import { Group, Item, LogEntry, LogType, VisualType } from '../types';

const LS_KEYS = {
  FOLDERS: 'orbit_folders',
  PROJECTS: 'orbit_projects',
  LOGS: 'orbit_logs',
  HAS_SEEDED: 'orbit_demo_seeded'
};

// --- Mappers ---
const mapProjectFromDB = (p: any): Item => ({
  id: p.id,
  groupId: p.folder_id,
  title: p.title,
  link: p.link,
  visualType: p.visual_type as VisualType,
  visualData: p.visual_data,
  progress: p.progress,
  createdAt: new Date(p.created_at).getTime(),
  updatedAt: new Date(p.updated_at).getTime()
});

const mapLogFromDB = (l: any): LogEntry => ({
  id: l.id,
  itemId: l.project_id,
  type: l.type as LogType,
  content: l.content,
  createdAt: new Date(l.created_at).getTime()
});

// --- Service ---
export const persistenceService = {
  async getFolders(userId: string): Promise<Group[]> {
    if (IS_SUPABASE_CONFIGURED) {
      const { data } = await supabase.from('folders').select('*').order('order_index');
      return (data || []).map(f => ({
        id: f.id,
        name: f.name,
        orderIndex: f.order_index,
        createdAt: new Date(f.created_at).getTime()
      }));
    }
    const local = localStorage.getItem(LS_KEYS.FOLDERS);
    return local ? JSON.parse(local) : [];
  },

  async getProjects(userId: string): Promise<Item[]> {
    if (IS_SUPABASE_CONFIGURED) {
      const { data } = await supabase.from('projects').select('*').order('updated_at', { ascending: false });
      return (data || []).map(mapProjectFromDB);
    }
    const local = localStorage.getItem(LS_KEYS.PROJECTS);
    return local ? JSON.parse(local) : [];
  },

  async getLogs(userId: string): Promise<LogEntry[]> {
    if (IS_SUPABASE_CONFIGURED) {
      const { data } = await supabase.from('logs').select('*').order('created_at', { ascending: false });
      return (data || []).map(mapLogFromDB);
    }
    const local = localStorage.getItem(LS_KEYS.LOGS);
    return local ? JSON.parse(local) : [];
  },

  async createFolder(userId: string, name: string, count: number): Promise<Group | null> {
    if (IS_SUPABASE_CONFIGURED) {
      const { data } = await supabase.from('folders').insert({ user_id: userId, name, order_index: count }).select().single();
      return data ? { id: data.id, name: data.name, orderIndex: data.order_index, createdAt: Date.now() } : null;
    }
    const folders = await this.getFolders(userId);
    const newFolder = { id: crypto.randomUUID(), name, orderIndex: count, createdAt: Date.now() };
    localStorage.setItem(LS_KEYS.FOLDERS, JSON.stringify([...folders, newFolder]));
    return newFolder;
  },

  async deleteFolder(userId: string, folderId: string): Promise<boolean> {
    if (IS_SUPABASE_CONFIGURED) {
      const { error } = await supabase.from('folders').delete().eq('id', folderId);
      return !error;
    }
    const folders = await this.getFolders(userId);
    localStorage.setItem(LS_KEYS.FOLDERS, JSON.stringify(folders.filter(f => f.id !== folderId)));
    return true;
  },

  async createProject(userId: string, folderId: string, item: Partial<Item>): Promise<Item | null> {
    if (IS_SUPABASE_CONFIGURED) {
      const { data } = await supabase.from('projects').insert({
        user_id: userId,
        folder_id: folderId,
        title: item.title,
        link: item.link,
        visual_type: item.visualType || 'icon',
        visual_data: item.visualData || 'Box',
        progress: item.progress || 0
      }).select().single();
      return data ? mapProjectFromDB(data) : null;
    }
    const projects = await this.getProjects(userId);
    const newProject = { 
      id: crypto.randomUUID(), 
      groupId: folderId, 
      ...item, 
      progress: item.progress || 0, 
      createdAt: Date.now(), 
      updatedAt: Date.now() 
    } as Item;
    localStorage.setItem(LS_KEYS.PROJECTS, JSON.stringify([newProject, ...projects]));
    return newProject;
  },

  async updateProject(userId: string, projectId: string, updates: Partial<Item>): Promise<boolean> {
    if (IS_SUPABASE_CONFIGURED) {
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.link !== undefined) dbUpdates.link = updates.link;
      if (updates.progress !== undefined) dbUpdates.progress = updates.progress;
      if (updates.visualType !== undefined) dbUpdates.visual_type = updates.visualType;
      if (updates.visualData !== undefined) dbUpdates.visual_data = updates.visualData;
      dbUpdates.updated_at = new Date().toISOString();

      const { error } = await supabase.from('projects').update(dbUpdates).eq('id', projectId);
      return !error;
    }
    const projects = await this.getProjects(userId);
    localStorage.setItem(LS_KEYS.PROJECTS, JSON.stringify(projects.map(p => p.id === projectId ? { ...p, ...updates, updatedAt: Date.now() } : p)));
    return true;
  },

  async deleteProjects(userId: string, projectIds: string[]): Promise<boolean> {
    if (IS_SUPABASE_CONFIGURED) {
      const { error } = await supabase.from('projects').delete().in('id', projectIds);
      return !error;
    }
    const projects = await this.getProjects(userId);
    localStorage.setItem(LS_KEYS.PROJECTS, JSON.stringify(projects.filter(p => !projectIds.includes(p.id))));
    return true;
  },

  async createLog(userId: string, projectId: string, content: string, type: LogType): Promise<LogEntry | null> {
    if (IS_SUPABASE_CONFIGURED) {
      const { data } = await supabase.from('logs').insert({ user_id: userId, project_id: projectId, type, content }).select().single();
      return data ? mapLogFromDB(data) : null;
    }
    const logs = await this.getLogs(userId);
    const newLog = { id: crypto.randomUUID(), itemId: projectId, type, content, createdAt: Date.now() };
    localStorage.setItem(LS_KEYS.LOGS, JSON.stringify([newLog, ...logs]));
    return newLog;
  },

  async updateLog(userId: string, logId: string, content: string): Promise<boolean> {
    if (IS_SUPABASE_CONFIGURED) {
      const { error } = await supabase.from('logs').update({ content }).eq('id', logId);
      return !error;
    }
    const logs = await this.getLogs(userId);
    localStorage.setItem(LS_KEYS.LOGS, JSON.stringify(logs.map(l => l.id === logId ? { ...l, content } : l)));
    return true;
  },

  async deleteLog(userId: string, logId: string): Promise<boolean> {
    if (IS_SUPABASE_CONFIGURED) {
      const { error } = await supabase.from('logs').delete().eq('id', logId);
      return !error;
    }
    const logs = await this.getLogs(userId);
    localStorage.setItem(LS_KEYS.LOGS, JSON.stringify(logs.filter(l => l.id !== logId)));
    return true;
  },

  async seedDemoData(userId: string): Promise<boolean> {
    // Only seed if empty and not already seeded this session
    const folder = await this.createFolder(userId, "🚀 Start Here", 0);
    if (!folder) return false;

    const p1 = await this.createProject(userId, folder.id, {
      title: "Welcome to Orbit",
      progress: 10,
      visualType: 'icon',
      visualData: 'Zap'
    });
    if (p1) {
      await this.createLog(userId, p1.id, "<h1>Greetings, Commander.</h1><p>Orbit is your dedicated Command Center for Web3. This project card is a <b>Unit</b> of work. You can use cards to track airdrops, protocols, or research nodes.</p>", "note");
      await this.createLog(userId, p1.id, "<h2>Pro-Tip: Folders</h2><p>Look at the sidebar. You are currently in the 🚀 Start Here folder. Group your projects by context (e.g., 'Testnets', 'Clients', 'Mainnet') to maintain focus.</p>", "note");
    }

    const p2 = await this.createProject(userId, folder.id, {
      title: "The Voice AI",
      progress: 35,
      visualType: 'icon',
      visualData: 'Cpu'
    });
    if (p2) {
      await this.createLog(userId, p2.id, "<h1>Meet Orbit AI</h1><p>In the bottom right corner, you'll see a microphone. Click it to initiate a <b>Live Session</b>. You can speak naturally to Orbit to open projects or recall notes from your past logs.</p>", "note");
      await this.createLog(userId, p2.id, "<h2>Hands-Free Memory</h2><p>Try saying: <i>'Orbit, tell me about the Welcome project'</i> or <i>'Open project Voice AI'</i>.</p>", "note");
    }

    const p3 = await this.createProject(userId, folder.id, {
      title: "Tracking a Project",
      progress: 75,
      visualType: 'text',
      visualData: 'ABC'
    });
    if (p3) {
      await this.createLog(userId, p3.id, "<h1>Activity Stream</h1><p>Click on this card to see the full history. You can log three types of entries:</p><ul><li><b>Note:</b> For rich text thoughts and research.</li><li><b>Seen:</b> Quick log for social media mentions or alpha.</li><li><b>Gained:</b> When you secure a whitelist, a role, or tokens.</li></ul>", "note");
      await this.createLog(userId, p3.id, "<h2>The Progress Slider</h2><p>Move the slider at the top of the detail view to update the project status. The card color will change automatically based on your completion level.</p>", "note");
    }

    localStorage.setItem(LS_KEYS.HAS_SEEDED, 'true');
    return true;
  }
};
