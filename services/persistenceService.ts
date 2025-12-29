
import { supabase, IS_SUPABASE_CONFIGURED } from '../supabaseClient';
import { Group, Item, LogEntry, LogType, VisualType } from '../types';

const LS_KEYS = {
  FOLDERS: 'orbit_folders',
  PROJECTS: 'orbit_projects',
  LOGS: 'orbit_logs'
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
        visual_type: item.visualType,
        visual_data: item.visualData,
        progress: 0
      }).select().single();
      return data ? mapProjectFromDB(data) : null;
    }
    const projects = await this.getProjects(userId);
    const newProject = { 
      id: crypto.randomUUID(), 
      groupId: folderId, 
      ...item, 
      progress: 0, 
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
  }
};
