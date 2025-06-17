
import { useDrop } from 'react-dnd';
import { KanbanCard as KanbanCardType, KanbanCategory } from '../types/kanban';
import { DraggableCard } from './DraggableCard';
import { AddCardForm } from './AddCardForm';
import { getCategoryColor, KANBAN_CATEGORIES } from '../lib/utils';

interface KanbanColumnProps {
  category: KanbanCategory;
  cards: KanbanCardType[];
  onAddCard: (card: Omit<KanbanCardType, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateCard: (id: string, updates: Partial<Omit<KanbanCardType, 'id' | 'createdAt'>>) => void;
  onDeleteCard: (id: string) => void;
  onMoveCard: (id: string, category: KanbanCategory) => void;
}

export function KanbanColumn({
  category,
  cards,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onMoveCard,
}: KanbanColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'CARD',
    drop: (item: { id: string }) => {
      onMoveCard(item.id, category);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div 
      ref={drop}
      className={`flex flex-col rounded-lg ${getCategoryColor(category)} p-4 min-h-[500px] w-full ${
        isOver ? 'ring-2 ring-blue-500 ring-inset' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">{category}</h2>
        <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full px-2 py-0.5 text-xs font-medium">
          {cards.length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3">
        {cards.map(card => (
          <DraggableCard
            key={card.id}
            card={card}
            onUpdate={onUpdateCard}
            onDelete={onDeleteCard}
            onMove={onMoveCard}
            categories={KANBAN_CATEGORIES}
          />
        ))}
      </div>
      
      <div className="mt-2">
        <AddCardForm onAdd={onAddCard} category={category} />
      </div>
    </div>
  );
}
