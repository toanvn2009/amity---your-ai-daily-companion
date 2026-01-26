export type Role = "user" | "assistant";
export type ToneType = "sweet";
export type MoodType =
  | "happy"
  | "sad"
  | "neutral"
  | "anxious"
  | "tired"
  | "excited";

export interface Attachment {
  type: "image";
  url: string; // Base64 or URL
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  attachments?: Attachment[];
  timestamp: number;
  tone?: ToneType;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  lastModified: number;
}

export interface UserProfile {
  goals: any[];
  habits: Habit[];
  moodHistory: MoodRecord[];
  preferredTone: ToneType;
  memories: string[]; // Legacy, for backward compatibility
  episodicMemories?: MemoryItem[]; // Short-term, specific events
  semanticMemories?: MemoryItem[]; // Long-term, core facts
  emotionalContext?: string; // Current emotional state/vibe
}

export interface MemoryItem {
  id: string;
  content: string;
  timestamp: number;
  importance: number; // 1-10
  type: "episodic" | "semantic";
}

export interface Habit {
  id: string;
  name: string;
  streak: number;
  lastCompletedAt?: number;
}

export interface MoodRecord {
  id: string;
  mood: MoodType;
  timestamp: number;
}
