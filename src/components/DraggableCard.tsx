
import { useState } from 'react';
import { useDrag } from 'react-dnd';
import { KanbanCard as KanbanCardType, KanbanCategory, TechTag } from '../types/kanban';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { getTagColor, TECH_TAGS } from '../lib/utils';
import { Edit, Trash2, GripVertical } from 'lucide-react';

interface DraggableCardProps {
  card: KanbanCardType;
  onUpdate: (id: string, updates: Partial<Omit<KanbanCardType, 'id' | 'createdAt'>>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, category: KanbanCategory) => void;
  categories: { id: string; name: string }[];
}

export function DraggableCard({ card, onUpdate, onDelete, onMove, categories }: DraggableCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: card.name,
    description: card.description,
    notes: card.notes || '',
    tags: [...card.tags],
    category: card.category,
  });

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'CARD',
    item: { id: card.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      category: editForm.category as KanbanCategory,
    });
    setIsEditing(false);
  };

  return (
    <div 
      ref={preview}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 
        ${isDragging ? 'opacity-50' : 'opacity-100'} 
        transition-all duration-200 hover:shadow-md`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div 
            ref={drag}
            className="mr-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <GripVertical className="h-5 w-5" />
          </div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100">{card.name}</h3>
        </div>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-red-500 hover:text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(card.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>

      <div onClick={() => setIsDetailsOpen(true)} className="cursor-pointer">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{card.description}</p>
        
        <div className="flex flex-wrap gap-1.5">
          {card.tags.map(tag => (
            <Badge key={tag} className={`${getTagColor(tag)} font-normal`}>
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
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
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <select
                id="category"
                name="category"
                value={editForm.category}
                onChange={handleEditChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Tags</label>
              <div className="grid grid-cols-2 gap-2">
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

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{card.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <h4 className="text-sm font-medium mb-1">Description</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{card.description}</p>
            </div>
            
            {card.notes && (
              <div>
                <h4 className="text-sm font-medium mb-1">Notes</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">{card.notes}</p>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium mb-1">Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {card.tags.map(tag => (
                  <Badge key={tag} className={`${getTagColor(tag)}`}>
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Current Category</h4>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{card.category}</p>
            </div>

            <div className="pt-2">
              <h4 className="text-sm font-medium mb-2">Move to Category</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  category.id !== card.category && (
                    <Button 
                      key={category.id} 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        onMove(card.id, category.id as KanbanCategory);
                        setIsDetailsOpen(false);
                      }}
                    >
                      {category.name}
                    </Button>
                  )
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsDetailsOpen(false);
              setIsEditing(true);
            }}>
              Edit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
