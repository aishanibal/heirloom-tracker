
export type TechTag = 
  | "STT" 
  | "TTS" 
  | "Multilingual" 
  | "Emotion" 
  | "GPU-required" 
  | "Open-source" 
  | "Commercial" 
  | "Real-time" 
  | "Batch" 
  | "On-premise" 
  | "Cloud";

// Updated to use categories instead of stages
export type KanbanCategory = 
  | "Text to Speech" 
  | "Speech to Text" 
  | "LLMs" 
  | "Voice Assistants" 
  | "Other";

export interface KanbanCard {
  id: string;
  name: string;
  description: string;
  tags: TechTag[];
  category: KanbanCategory;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KanbanState {
  cards: KanbanCard[];
}
