
import { useState } from 'react';
import { KanbanCard as KanbanCardType, KanbanStage, TechTag } from '../types/kanban';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { getTagColor, TECH_TAGS } from '../lib/utils';
import { Edit, Trash2, MoreHorizontal } from 'lucide-react';

interface KanbanCardProps {
  card: KanbanCardType;
  onUpdate: (id: string, updates: Partial<Omit<KanbanCardType, 'id' | 'createdAt'>>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, stage: KanbanStage) => void;
  stages: { id: string; name: string }[];
}

export function KanbanCard({ card, onUpdate, onDelete, onMove, stages }: KanbanCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: card.name,
    description: card.description,
    notes: card.notes || '',
    tags: [...card.tags],
  });

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tag: TechTag) => {
    setEditForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSave = () => {
    onUpdate(card.id, {
      name: editForm.name,
      description: editForm.description,
      notes: editForm.notes || undefined,
      tags: editForm.tags,
    });
    setIsEditing(false);
  };

  const handleMove = (stage: KanbanStage) => {
    onMove(card.id, stage);
    setIsMoving(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-3 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">{card.name}</h3>
        <div className="flex space-x-1">
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Technology</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">Name</label>
                  <Input
                    id="name"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="description" className="text-sm font-medium">Description</label>
                  <Textarea
                    id="description"
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={editForm.notes}
                    onChange={handleEditChange}
                    placeholder="Optional notes or issues encountered"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {TECH_TAGS.map(tag => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag}`}
                          checked={editForm.tags.includes(tag as TechTag)}
                          onCheckedChange={() => handleTagToggle(tag as TechTag)}
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
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isMoving} onOpenChange={setIsMoving}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Move</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Move to Another Stage</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {stages.map(stage => (
                  <Button
                    key={stage.id}
                    variant={stage.id === card.stage ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => handleMove(stage.id as KanbanStage)}
                    disabled={stage.id === card.stage}
                  >
                    {stage.name}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
              </DialogHeader>
              <p className="py-4">Are you sure you want to delete "{card.name}"? This action cannot be undone.</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive" onClick={() => onDelete(card.id)}>
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{card.description}</p>
      
      {card.notes && (
        <div className="mb-3 text-sm italic text-gray-500 dark:text-gray-400">
          <p>{card.notes}</p>
        </div>
      )}
      
      <div className="flex flex-wrap gap-1.5">
        {card.tags.map(tag => (
          <Badge key={tag} className={`${getTagColor(tag)} font-normal`}>
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}