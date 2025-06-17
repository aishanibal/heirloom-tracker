
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { TechCard as TechCardType, TechTag, KanbanStage } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { EditCardForm } from './EditCardForm';

interface TechCardProps {
  card: TechCardType;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Omit<TechCardType, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  onMove: (id: string, stage: KanbanStage) => void;
}

export function TechCard({ card, onDelete, onUpdate, onMove }: TechCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const getBadgeVariant = (tag: string): TechTag => {
    return tag.toLowerCase().replace(/\s+/g, '-') as TechTag;
  };

  return (
    <>
      <Card className="w-full bg-white shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer" 
        onClick={() => setIsDetailsDialogOpen(true)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium truncate">{card.name}</CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{card.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {card.tags.map((tag) => (
              <Badge key={tag} variant={getBadgeVariant(tag)} className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="pt-2 flex justify-end">
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                setIsEditDialogOpen(true);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(card.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Technology</DialogTitle>
          </DialogHeader>
          <EditCardForm 
            card={card} 
            onSubmit={(updatedCard) => {
              onUpdate(card.id, updatedCard);
              setIsEditDialogOpen(false);
            }}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{card.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <h4 className="text-sm font-medium mb-1">Description</h4>
              <p className="text-sm text-gray-600">{card.description}</p>
            </div>
            
            {card.notes && (
              <div>
                <h4 className="text-sm font-medium mb-1">Notes</h4>
                <p className="text-sm text-gray-600 whitespace-pre-line">{card.notes}</p>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium mb-1">Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {card.tags.map((tag) => (
                  <Badge key={tag} variant={getBadgeVariant(tag)}>
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Current Stage</h4>
              <p className="text-sm font-medium text-blue-600">{card.stage}</p>
            </div>

            <div className="pt-2">
              <h4 className="text-sm font-medium mb-2">Move to Stage</h4>
              <div className="flex flex-wrap gap-2">
                {['Exploring', 'Setup in Progress', 'Working Prototype', 'Needs Review', 'Archived'].map((stage) => (
                  stage !== card.stage && (
                    <Button 
                      key={stage} 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        onMove(card.id, stage as KanbanStage);
                        setIsDetailsDialogOpen(false);
                      }}
                    >
                      {stage}
                    </Button>
                  )
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsDetailsDialogOpen(false)}
            >
              Close
            </Button>
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                onClick={() => {
                  setIsDetailsDialogOpen(false);
                  setIsEditDialogOpen(true);
                }}
              >
                Edit
              </Button>
              <Button 
                variant="destructive"
                onClick={() => {
                  onDelete(card.id);
                  setIsDetailsDialogOpen(false);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}