
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useKanban } from '../hooks/useKanban';
import { KanbanColumn } from '../components/KanbanColumn';
import { SearchAndFilter } from '../components/SearchAndFilter';
import { KANBAN_CATEGORIES } from '../lib/utils';
import { KanbanCategory } from '../types/kanban';

export default function KanbanBoard() {
  const {
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
  } = useKanban();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Speech Technology Experiments</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track and organize your team's speech technology experiments
          </p>
        </header>

        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedTags={selectedTags}
          toggleTag={toggleTagFilter}
          clearFilters={clearFilters}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {KANBAN_CATEGORIES.map(category => (
            <KanbanColumn
              key={category.id}
              category={category.id as KanbanCategory}
              cards={getCardsByCategory(category.id as KanbanCategory)}
              onAddCard={addCard}
              onUpdateCard={updateCard}
              onDeleteCard={deleteCard}
              onMoveCard={moveCard}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
