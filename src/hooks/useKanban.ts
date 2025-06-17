
import { useState, useEffect } from 'react';
import { KanbanCard, KanbanCategory, TechTag } from '../types/kanban';
import { generateId, getSampleData } from '../lib/utils';
import { toast } from 'sonner';

const STORAGE_KEY = 'kanban-speech-tech';

export function useKanban() {
  const [cards, setCards] = useState<KanbanCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<TechTag[]>([]);

  // Load data from localStorage on initial render
  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          setCards(JSON.parse(savedData));
        } else {
          // Initialize with sample data if nothing exists
          const sampleData = getSampleData();
          setCards(sampleData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData));
        }
      } catch (error) {
        console.error('Error loading kanban data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save to localStorage whenever cards change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    }
  }, [cards, isLoading]);

  const addCard = (card: Omit<KanbanCard, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCard: KanbanCard = {
      ...card,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setCards(prev => [...prev, newCard]);
    toast.success('Technology added successfully');
    return newCard;
  };

  const updateCard = (id: string, updates: Partial<Omit<KanbanCard, 'id' | 'createdAt'>>) => {
    setCards(prev => 
      prev.map(card => 
        card.id === id 
          ? { 
              ...card, 
              ...updates, 
              updatedAt: new Date().toISOString() 
            } 
          : card
      )
    );
    toast.success('Card updated');
  };

  const deleteCard = (id: string) => {
    setCards(prev => prev.filter(card => card.id !== id));
    toast.success('Technology removed');
  };

  const moveCard = (id: string, newCategory: KanbanCategory) => {
    setCards(prev => 
      prev.map(card => 
        card.id === id 
          ? { 
              ...card, 
              category: newCategory, 
              updatedAt: new Date().toISOString() 
            } 
          : card
      )
    );
    toast.success(`Moved to ${newCategory}`);
  };

  const filteredCards = cards.filter(card => {
    const matchesSearch = searchTerm === '' || 
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (card.notes && card.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => card.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  const getCardsByCategory = (category: KanbanCategory) => {
    return filteredCards.filter(card => card.category === category);
  };

  const toggleTagFilter = (tag: TechTag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
  };

  return {
    cards: filteredCards,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedTags,
    toggleTagFilter,
    clearFilters,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    getCardsByCategory,
  };
}
