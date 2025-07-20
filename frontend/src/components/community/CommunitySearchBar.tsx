import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';

interface CommunitySearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  showPrivateFilter?: boolean;
  showPrivate?: boolean;
  onPrivateFilterChange?: (showPrivate: boolean) => void;
}

const popularTags = [
  'MERN', 'Python', 'JavaScript', 'React', 'Node.js', 'MongoDB',
  'Express', 'Frontend', 'Backend', 'Full Stack', 'Data Science',
  'Machine Learning', 'AI', 'DevOps', 'Cloud Computing', 'AWS',
  'Docker', 'Kubernetes', 'TypeScript', 'Next.js', 'Vue.js',
  'Angular', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust'
];

export const CommunitySearchBar: React.FC<CommunitySearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedTags,
  onTagsChange,
  showPrivateFilter = false,
  showPrivate = true,
  onPrivateFilterChange
}) => {
  const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    onTagsChange(newTags);
  };

  const clearAllFilters = () => {
    onSearchChange('');
    onTagsChange([]);
    if (onPrivateFilterChange) {
      onPrivateFilterChange(true);
    }
  };

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || !showPrivate;

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search communities by name or description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdown */}
        <DropdownMenu open={isTagMenuOpen} onOpenChange={setIsTagMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="px-3">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {(selectedTags.length > 0 || !showPrivate) && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {selectedTags.length + (!showPrivate ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto">
            <DropdownMenuLabel>Filter by Tags</DropdownMenuLabel>
            <div className="grid grid-cols-2 gap-1 p-2">
              {popularTags.map((tag) => (
                <DropdownMenuItem
                  key={tag}
                  className="cursor-pointer justify-between"
                  onClick={() => handleTagToggle(tag)}
                >
                  <span className="text-sm">{tag}</span>
                  {selectedTags.includes(tag) && (
                    <div className="h-2 w-2 bg-blue-600 rounded-full" />
                  )}
                </DropdownMenuItem>
              ))}
            </div>
            
            {showPrivateFilter && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Community Type</DropdownMenuLabel>
                <DropdownMenuItem
                  className="cursor-pointer justify-between"
                  onClick={() => onPrivateFilterChange?.(!showPrivate)}
                >
                  <span className="text-sm">Include Private Communities</span>
                  {showPrivate && (
                    <div className="h-2 w-2 bg-blue-600 rounded-full" />
                  )}
                </DropdownMenuItem>
              </>
            )}

            {hasActiveFilters && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={clearAllFilters}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 font-medium">Active tags:</span>
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="default"
              className="cursor-pointer hover:bg-blue-700"
              onClick={() => handleTagToggle(tag)}
            >
              {tag}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
        </div>
      )}

      {/* Search Results Summary */}
      {hasActiveFilters && (
        <div className="text-sm text-gray-600">
          {searchQuery && (
            <span>Searching for "{searchQuery}"</span>
          )}
          {selectedTags.length > 0 && (
            <span>
              {searchQuery ? ' with tags: ' : 'Filtered by tags: '}
              {selectedTags.join(', ')}
            </span>
          )}
          {!showPrivate && (
            <span>{(searchQuery || selectedTags.length > 0) ? ' • ' : ''}Public communities only</span>
          )}
        </div>
      )}
    </div>
  );
};