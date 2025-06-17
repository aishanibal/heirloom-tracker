
import { useState } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { TechCard, TechTag, KanbanStage } from '../types';
import { AVAILABLE_TAGS, KANBAN_STAGES } from '../lib/store';

interface EditCardFormProps {
  card?: TechCard;
  onSubmit: (card: Omit<TechCard, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function EditCardForm({ card, onSubmit, onCancel }: EditCardFormProps) {
  const [name, setName] = useState(card?.name || '');
  const [description, setDescription] = useState(card?.description || '');
  const [notes, setNotes] = useState(card?.notes || '');
  const [selectedTags, setSelectedTags] = useState<TechTag[]>(card?.tags || []);
  const [stage, setStage] = useState<KanbanStage>(card?.stage || 'Exploring');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim()) {
      return;
    }
    
    onSubmit({
      name,
      description,
      notes: notes.trim() ? notes : undefined,
      tags: selectedTags,
      stage
    });
  };

  const handleTagToggle = (tag: TechTag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Technology Name
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., OpenAI Whisper"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is this technology good for?"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes (Optional)
        </label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any issues or observations during setup/testing"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Tags</label>
        <div className="grid grid-cols-2 gap-2">
          {AVAILABLE_TAGS.map((tag) => (
            <div key={tag} className="flex items-center space-x-2">
              <Checkbox
                id={`tag-${tag}`}
                checked={selectedTags.includes(tag)}
                onCheckedChange={() => handleTagToggle(tag)}
              />
              <label
                htmlFor={`tag-${tag}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {tag}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="stage" className="text-sm font-medium">
          Stage
        </label>
        <select
          id="stage"
          value={stage}
          onChange={(e) => setStage(e.target.value as KanbanStage)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {KANBAN_STAGES.map((stageOption) => (
            <option key={stageOption} value={stageOption}>
              {stageOption}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {card ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}