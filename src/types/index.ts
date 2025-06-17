
export type TechTag = 
  | 'STT' 
  | 'TTS' 
  | 'Multilingual' 
  | 'Emotion' 
  | 'GPU-required' 
  | 'Open-source' 
  | 'Commercial' 
  | 'Real-time'
  | 'Offline'
  | 'Cloud-based'
  | 'Batch'
  | 'On-premise'
  | 'Cloud';

export type KanbanStage = 
  | 'Exploring' 
  | 'Setup in Progress' 
  | 'Working Prototype' 
  | 'Needs Review' 
  | 'Archived';

export interface TechCard {
  id: string;
  name: string;
  description: string;
  tags: TechTag[];
  stage: KanbanStage;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface DragItem {
  id: string;
  type: string;
}