
import { useState, useEffect } from 'react';
import { TechCard, KanbanStage, TechTag } from '../types';
import { toast } from 'sonner';

const STORAGE_KEY = 'kanban-tech-cards';

// Initial sample data
const initialCards: TechCard[] = [
  {
    id: '1',
    name: 'OpenAI Whisper',
    description: 'Robust speech recognition system that works across many languages',
    tags: ['STT', 'Multilingual', 'GPU-required', 'Open-source'],
    stage: 'Working Prototype',
    notes: 'Excellent accuracy but requires significant GPU resources',
    createdAt: Date.now() - 1000000,
    updatedAt: Date.now() - 500000
  },
  {
    id: '2',
    name: 'ESPnet',
    description: 'End-to-End Speech Processing Toolkit with various models',
    tags: ['STT', 'TTS', 'Open-source'],
    stage: 'Setup in Progress',
    notes: 'Documentation is complex, still working on proper setup',
    createdAt: Date.now() - 2000000,
    updatedAt: Date.now() - 300000
  },
  {
    id: '3',
    name: 'ElevenLabs',
    description: 'High-quality, realistic voice synthesis with emotion control',
    tags: ['TTS', 'Emotion', 'Commercial', 'Cloud-based'],
    stage: 'Exploring',
    createdAt: Date.now() - 3000000,
    updatedAt: Date.now() - 100000
  },
  {
    id: '4',
    name: 'Coqui TTS',
    description: 'Deep learning toolkit for Text-to-Speech with multiple voices',
    tags: ['TTS', 'Open-source', 'Offline'],
    stage: 'Needs Review',
    notes: 'Voice quality is good but needs fine-tuning for our use case',
    createdAt: Date.now() - 4000000,
    updatedAt: Date.now() - 200000
  }
];

export const useKanbanStore = () => {
  const [cards, setCards] = useState<TechCard[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cards from localStorage on initial render
  useEffect(() => {
    const storedCards = localStorage.getItem(STORAGE_KEY);
    if (storedCards) {
      setCards(JSON.parse(storedCards));
    } else {
      // Use initial sample data if no stored cards exist
      setCards(initialCards);
    }
    setLoading(false);
  }, []);

  // Save cards to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    }
  }, [cards, loading]);

  // Add a new card
  const addCard = (card: Omit<TechCard, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCard: TechCard = {
      ...card,
      id: Date.now().toString(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    setCards(prev => [...prev, newCard]);
    toast.success('Technology card added');
    return newCard;
  };

  // Update an existing card
  const updateCard = (id: string, updates: Partial<Omit<TechCard, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setCards(prev => 
      prev.map(card => 
        card.id === id 
          ? { ...card, ...updates, updatedAt: Date.now() } 
          : card
      )
    );
    toast.success('Card updated');
  };

  // Delete a card
  const deleteCard = (id: string) => {
    setCards(prev => prev.filter(card => card.id !== id));
    toast.success('Card removed');
  };

  // Move a card to a different stage
  const moveCard = (id: string, stage: KanbanStage) => {
    setCards(prev => 
      prev.map(card => 
        card.id === id 
          ? { ...card, stage, updatedAt: Date.now() } 
          : card
      )
    );
  };

  // Get cards by stage
  const getCardsByStage = (stage: KanbanStage) => {
    return cards.filter(card => card.stage === stage);
  };

  // Filter cards by search term and/or tags
  const filterCards = (searchTerm: string, selectedTags: TechTag[]) => {
    return cards.filter(card => {
      const matchesSearch = searchTerm === '' || 
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (card.notes && card.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => card.tags.includes(tag));
      
      return matchesSearch && matchesTags;
    });
  };

  return {
    cards,
    loading,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    getCardsByStage,
    filterCards
  };
};

export const KANBAN_STAGES: KanbanStage[] = [
  'Exploring',
  'Setup in Progress',
  'Working Prototype',
  'Needs Review',
  'Archived'
];

export const AVAILABLE_TAGS: TechTag[] = [
  'STT',
  'TTS',
  'Multilingual',
  'Emotion',
  'GPU-required',
  'Open-source',
  'Commercial',
  'Real-time',
  'Offline',
  'Cloud-based'
];