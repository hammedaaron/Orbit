
import { supabase, IS_SUPABASE_CONFIGURED } from '../supabaseClient.ts';
import { Group, Item, LogEntry, LogType, VisualType } from '../types.ts';

const LS_KEYS = {
  HAS_SEEDED: 'orbit_demo_seeded',
  FORCE_LOCAL: 'orbit_force_local',
  VAULT_SALT: 'orbit_vault_salt'
};

const DB_NAME = 'OrbitVault';
const DB_VERSION = 1;
const STORES = {
  FOLDERS: 'folders',
  PROJECTS: 'projects',
  LOGS: 'logs'
};

const uuid = () => {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: any) =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
};

let activeVaultKey: CryptoKey | null = null;

export const SecurityManager = {
  setKey(key: CryptoKey | null) {
    activeVaultKey = key;
  },

  async deriveKey(password: string): Promise<CryptoKey> {
    let saltHex = localStorage.getItem(LS_KEYS.VAULT_SALT);
    if (!saltHex) {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
      localStorage.setItem(LS_KEYS.VAULT_SALT, saltHex);
    }
    const matches = saltHex.match(/.{1,2}/g);
    const salt = new Uint8Array((matches || []).map(byte => parseInt(byte, 16)));
    
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]
    );
    
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  },

  async encrypt(data: string): Promise<string> {
    if (!activeVaultKey) return data;
    const enc = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      activeVaultKey,
      enc.encode(data)
    );
    
    const result = new Uint8Array(iv.length + encrypted.byteLength);
    result.set(iv);
    result.set(new Uint8Array(encrypted), iv.length);
    return btoa(String.fromCharCode(...result));
  },

  async decrypt(base64: string): Promise<string> {
    if (!activeVaultKey) return base64;
    try {
      const data = new Uint8Array(atob(base64).split('').map(c => c.charCodeAt(0)));
      const iv = data.slice(0, 12);
      const encrypted = data.slice(12);
      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        activeVaultKey,
        encrypted
      );
      return new TextDecoder().decode(decrypted);
    } catch (e) {
      console.error("Decryption failed", e);
      return base64;
    }
  }
};

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      Object.values(STORES).forEach(store => {
        if (!db.objectStoreNames.contains(store)) db.createObjectStore(store, { keyPath: 'id' });
      });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const dbOp = async (store: string, mode: IDBTransactionMode, fn: (os: IDBObjectStore) => IDBRequest | void): Promise<any> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, mode);
    const os = tx.objectStore(store);
    const request = fn(os);
    if (request) {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    } else {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    }
  });
};

const shouldUseCloud = () => {
  return IS_SUPABASE_CONFIGURED && localStorage.getItem(LS_KEYS.FORCE_LOCAL) !== 'true';
};

const mapProjectFromDB = (p: any): Item => ({
  id: p.id,
  groupId: p.folder_id,
  title: p.title,
  link: p.link,
  visualType: p.visual_type as VisualType,
  visualData: p.visual_data,
  progress: p.progress,
  isPinned: !!p.is_pinned,
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

const encryptObject = async (obj: any) => {
  if (!activeVaultKey) return obj;
  const json = JSON.stringify(obj);
  const encrypted = await SecurityManager.encrypt(json);
  return { id: obj.id, _encrypted: encrypted };
};

const decryptObject = async (record: any) => {
  if (!record || !record._encrypted || !activeVaultKey) return record;
  try {
    const decryptedJson = await SecurityManager.decrypt(record._encrypted);
    return JSON.parse(decryptedJson);
  } catch (e) {
    console.error("Failed to parse decrypted object", e);
    return record;
  }
};

export const persistenceService = {
  async getFolders(userId: string): Promise<Group[]> {
    if (shouldUseCloud()) {
      const { data } = await supabase.from('folders').select('*').order('order_index');
      return (data || []).map(f => ({
        id: f.id,
        name: f.name,
        orderIndex: f.order_index,
        createdAt: new Date(f.created_at).getTime()
      }));
    }
    const data = await dbOp(STORES.FOLDERS, 'readonly', os => os.getAll());
    return Promise.all(data.map(decryptObject));
  },

  async getProjects(userId: string): Promise<Item[]> {
    if (shouldUseCloud()) {
      const { data } = await supabase.from('projects').select('*').order('updated_at', { ascending: false });
      return (data || []).map(mapProjectFromDB);
    }
    const data = await dbOp(STORES.PROJECTS, 'readonly', os => os.getAll());
    return Promise.all(data.map(decryptObject));
  },

  async getLogs(userId: string): Promise<LogEntry[]> {
    if (shouldUseCloud()) {
      const { data } = await supabase.from('logs').select('*').order('created_at', { ascending: false });
      return (data || []).map(mapLogFromDB);
    }
    const data = await dbOp(STORES.LOGS, 'readonly', os => os.getAll());
    return Promise.all(data.map(decryptObject));
  },

  async createFolder(userId: string, name: string, count: number): Promise<Group | null> {
    if (shouldUseCloud()) {
      const { data } = await supabase.from('folders').insert({ user_id: userId, name, order_index: count }).select().single();
      return data ? { id: data.id, name: data.name, orderIndex: data.order_index, createdAt: Date.now() } : null;
    }
    const newFolder = { id: uuid(), name, orderIndex: count, createdAt: Date.now() };
    const record = await encryptObject(newFolder);
    await dbOp(STORES.FOLDERS, 'readwrite', os => os.put(record));
    return newFolder;
  },

  async deleteFolder(userId: string, folderId: string): Promise<boolean> {
    if (shouldUseCloud()) {
      const { error } = await supabase.from('folders').delete().eq('id', folderId);
      return !error;
    }
    await dbOp(STORES.FOLDERS, 'readwrite', os => os.delete(folderId));
    return true;
  },

  async createProject(userId: string, folderId: string, item: Partial<Item>): Promise<Item | string> {
    if (shouldUseCloud()) {
      try {
        const { data, error } = await supabase.from('projects').insert({
          user_id: userId,
          folder_id: folderId,
          title: item.title,
          link: item.link,
          visual_type: item.visualType || 'icon',
          visual_data: item.visualData || 'Box',
          progress: item.progress || 0,
          is_pinned: item.isPinned || false
        }).select().single();
        
        if (error) {
          console.error("Supabase Project Create Error:", error);
          return error.message;
        }
        return data ? mapProjectFromDB(data) : "Unknown insertion error";
      } catch (e: any) {
        return e.message || "Network error during project creation";
      }
    }
    const newProject = { 
      id: uuid(), 
      groupId: folderId, 
      ...item, 
      progress: item.progress || 0, 
      isPinned: item.isPinned || false,
      createdAt: Date.now(), 
      updatedAt: Date.now() 
    } as Item;
    const record = await encryptObject(newProject);
    await dbOp(STORES.PROJECTS, 'readwrite', os => os.put(record));
    return newProject;
  },

  async updateProject(userId: string, projectId: string, updates: Partial<Item>): Promise<boolean> {
    if (shouldUseCloud()) {
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.link !== undefined) dbUpdates.link = updates.link;
      if (updates.progress !== undefined) dbUpdates.progress = updates.progress;
      if (updates.visualType !== undefined) dbUpdates.visual_type = updates.visualType;
      if (updates.visualData !== undefined) dbUpdates.visual_data = updates.visualData;
      if (updates.isPinned !== undefined) dbUpdates.is_pinned = updates.isPinned;
      dbUpdates.updated_at = new Date().toISOString();

      const { error } = await supabase.from('projects').update(dbUpdates).eq('id', projectId);
      return !error;
    }
    const record = await dbOp(STORES.PROJECTS, 'readonly', os => os.get(projectId));
    if (record) {
      const existing = await decryptObject(record);
      const updated = { ...existing, ...updates, updatedAt: Date.now() };
      const newRecord = await encryptObject(updated);
      await dbOp(STORES.PROJECTS, 'readwrite', os => os.put(newRecord));
    }
    return true;
  },

  async deleteProjects(userId: string, projectIds: string[]): Promise<boolean> {
    if (shouldUseCloud()) {
      const { error } = await supabase.from('projects').delete().in('id', projectIds);
      return !error;
    }
    for (const id of projectIds) {
      await dbOp(STORES.PROJECTS, 'readwrite', os => os.delete(id));
    }
    return true;
  },

  async createLog(userId: string, projectId: string, content: string, type: LogType): Promise<LogEntry | null> {
    if (shouldUseCloud()) {
      const { data } = await supabase.from('logs').insert({ user_id: userId, project_id: projectId, type, content }).select().single();
      return data ? mapLogFromDB(data) : null;
    }
    const newLog = { id: uuid(), itemId: projectId, type, content, createdAt: Date.now() };
    const record = await encryptObject(newLog);
    await dbOp(STORES.LOGS, 'readwrite', os => os.put(record));
    return newLog;
  },

  async updateLog(userId: string, logId: string, content: string): Promise<boolean> {
    if (shouldUseCloud()) {
      const { error } = await supabase.from('logs').update({ content }).eq('id', logId);
      return !error;
    }
    const record = await dbOp(STORES.LOGS, 'readonly', os => os.get(logId));
    if (record) {
      const existing = await decryptObject(record);
      const updated = { ...existing, content };
      const newRecord = await encryptObject(updated);
      await dbOp(STORES.LOGS, 'readwrite', os => os.put(newRecord));
    }
    return true;
  },

  async deleteLog(userId: string, logId: string): Promise<boolean> {
    if (shouldUseCloud()) {
      const { error } = await supabase.from('logs').delete().eq('id', logId);
      return !error;
    }
    await dbOp(STORES.LOGS, 'readwrite', os => os.delete(logId));
    return true;
  },

  async seedDemoData(userId: string): Promise<boolean> {
    const folders = await this.getFolders(userId);
    if (folders.length > 0) return false;

    const folder = await this.createFolder(userId, "🚀 Start Here", 0);
    if (!folder) return false;

    const p1 = await this.createProject(userId, folder.id, {
      title: "Welcome to Orbit",
      progress: 10,
      visualType: 'icon',
      visualData: 'Zap'
    });
    if (typeof p1 !== 'string') {
      await this.createLog(userId, p1.id, "<h1>Greetings, Commander.</h1><p>Orbit is your dedicated Command Center for Web3. This project card is a <b>Unit</b> of work. You can use cards to track airdrops, protocols, or research nodes.</p>", "note");
      await this.createLog(userId, p1.id, "<h2>Pro-Tip: Folders</h2><p>Look at the sidebar. You are currently in the 🚀 Start Here folder. Group your projects by context (e.g., 'Testnets', 'Clients', 'Mainnet') to maintain focus.</p>", "note");
    }

    const p2 = await this.createProject(userId, folder.id, {
      title: "The Voice AI",
      progress: 35,
      visualType: 'icon',
      visualData: 'Cpu'
    });
    if (typeof p2 !== 'string') {
      await this.createLog(userId, p2.id, "<h1>Meet Orbit AI</h1><p>In the bottom right corner, you'll see a microphone. Click it to initiate a <b>Live Session</b>. You can speak naturally to Orbit to open projects or recall notes from your past logs.</p>", "note");
      await this.createLog(userId, p2.id, "<h2>Hands-Free Memory</h2><p>Try saying: <i>'Orbit, tell me about the Welcome project'</i> or <i>'Open project Voice AI'</i>.</p>", "note");
    }

    const p3 = await this.createProject(userId, folder.id, {
      title: "Tracking a Project",
      progress: 75,
      visualType: 'text',
      visualData: 'ABC'
    });
    if (typeof p3 !== 'string') {
      await this.createLog(userId, p3.id, "<h1>Activity Stream</h1><p>Click on this card to see the full history. You can log three types of entries:</p><ul><li><b>Note:</b> For rich text thoughts and research.</li><li><b>Seen:</b> Quick log for social media mentions or alpha.</li><li><b>Gained:</b> When you secure a whitelist, a role, or tokens.</li></ul>", "note");
      await this.createLog(userId, p3.id, "<h2>The Progress Slider</h2><p>Move the slider at the top of the detail view to update the project status. The card color will change automatically based on your completion level.</p>", "note");
    }

    localStorage.setItem(LS_KEYS.HAS_SEEDED, 'true');
    return true;
  },

  async exportVault(): Promise<string> {
    const rawFolders = await dbOp(STORES.FOLDERS, 'readonly', os => os.getAll());
    const rawProjects = await dbOp(STORES.PROJECTS, 'readonly', os => os.getAll());
    const rawLogs = await dbOp(STORES.LOGS, 'readonly', os => os.getAll());
    
    const folders = await Promise.all(rawFolders.map(decryptObject));
    const projects = await Promise.all(rawProjects.map(decryptObject));
    const logs = await Promise.all(rawLogs.map(decryptObject));
    
    return JSON.stringify({ folders, projects, logs, timestamp: Date.now() }, null, 2);
  },

  async importVault(json: string): Promise<void> {
    const data = JSON.parse(json);
    if (data.folders) {
      for (const f of data.folders) {
        const record = await encryptObject(f);
        await dbOp(STORES.FOLDERS, 'readwrite', os => os.put(record));
      }
    }
    if (data.projects) {
      for (const p of data.projects) {
        const record = await encryptObject(p);
        await dbOp(STORES.PROJECTS, 'readwrite', os => os.put(record));
      }
    }
    if (data.logs) {
      for (const l of data.logs) {
        const record = await encryptObject(l);
        await dbOp(STORES.LOGS, 'readwrite', os => os.put(record));
      }
    }
  }
};
