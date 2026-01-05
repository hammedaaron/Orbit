
export type VisualType = 'text' | 'icon' | 'image';

export type LogType = 'seen' | 'gained' | 'note';

export type IconName = 'Box' | 'Zap' | 'Globe' | 'Cpu' | 'Wallet' | 'FileText' | 'Target' | 'Layers';

export type Theme = 'day' | 'night' | 'power';

export interface LogEntry {
  id: string;
  itemId: string;
  type: LogType;
  content: string;
  createdAt: number;
}

export interface Item {
  id: string;
  groupId: string;
  title: string;
  link?: string;
  visualType: VisualType;
  visualData: string; // Icon name or Image URL
  progress: number; // 0-100
  isPinned: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Group {
  id: string;
  name: string;
  orderIndex: number;
  createdAt: number;
}

export interface AppState {
  groups: Group[];
  items: Item[];
  logs: LogEntry[];
  theme: Theme;
}

export const STATUS_RANGES = {
  DISCOVERED: { max: 20, label: 'Discovered', color: 'text-zinc-500', bar: 'bg-zinc-700' },
  ACTIVE: { max: 50, label: 'Active', color: 'text-blue-400', bar: 'bg-blue-600' },
  IN_PROGRESS: { max: 80, label: 'In Progress', color: 'text-purple-400', bar: 'bg-purple-600' },
  COMPLETED: { max: 100, label: 'Completed', color: 'text-emerald-400', bar: 'bg-emerald-600' },
};

export const getStatus = (progress: number) => {
  if (progress <= 20) return STATUS_RANGES.DISCOVERED;
  if (progress <= 50) return STATUS_RANGES.ACTIVE;
  if (progress <= 80) return STATUS_RANGES.IN_PROGRESS;
  return STATUS_RANGES.COMPLETED;
};
