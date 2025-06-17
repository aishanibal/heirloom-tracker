
import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { TechTag } from '../types/kanban';
import { getTagColor, TECH_TAGS } from '../lib/utils';
import { Search, X } from 'lucide-react';

interface SearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTags: TechTag[];
  toggleTag: (tag: TechTag) => void;
  clearFilters: () => void;
}

export function SearchAndFilter({
  searchTerm,
  setSearchTerm,
  selectedTags,
  toggleTag,
  clearFilters,
}: SearchAndFilterProps) {
  const [showAllTags, setShowAllTags] = useState(false);

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search technologies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-8 w-8"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        
        {(selectedTags.length > 0 || searchTerm) && (
          <Button variant="outline" onClick={clearFilters} className="whitespace-nowrap">
            Clear Filters
          </Button>
        )}
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-sm font-medium">Filter by tags:</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowAllTags(!showAllTags)}
            className="text-xs h-7"
          >
            {showAllTags ? 'Show Less' : 'Show All'}
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {(showAllTags ? TECH_TAGS : TECH_TAGS.slice(0, 5)).map(tag => (
            <Badge
              key={tag}
              className={`${getTagColor(tag)} cursor-pointer ${
                selectedTags.includes(tag as TechTag) 
                  ? 'ring-2 ring-offset-2 ring-blue-500' 
                  : ''
              }`}
              onClick={() => toggleTag(tag as TechTag)}
            >
              {tag}
              {selectedTags.includes(tag as TechTag) && (
                <X className="ml-1 h-3 w-3" />
              )}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}