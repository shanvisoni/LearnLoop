import React, { useState, useEffect } from 'react';
import { CommunitySearchBar } from '../../components/community/CommunitySearchBar';
import CommunityList from '../../components/community/CommunityList';
import { useAllCommunities } from '../../hooks/useCommunities';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CommunitiesPage: React.FC = () => {
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showPrivate, setShowPrivate] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Pagination settings
  const COMMUNITIES_PER_PAGE = 12;

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTags, showPrivate]);

  // Fetch communities with current filters
  const { 
    data: communitiesData, 
    isLoading, 
    error 
  } = useAllCommunities(debouncedQuery, currentPage, COMMUNITIES_PER_PAGE);

  // Filter communities based on tags and privacy settings
  const filteredCommunities = React.useMemo(() => {
    if (!communitiesData?.communities) return [];

    let filtered = communitiesData.communities;

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(community => 
        community.tags?.some(tag => 
          selectedTags.some(selectedTag => 
            tag.toLowerCase().includes(selectedTag.toLowerCase())
          )
        )
      );
    }

    // Filter by privacy setting
    if (!showPrivate) {
      filtered = filtered.filter(community => !community.isPrivate);
    }

    return filtered;
  }, [communitiesData?.communities, selectedTags, showPrivate]);

  // Calculate pagination info
  const totalCommunities = filteredCommunities.length;
  const totalPages = Math.ceil(totalCommunities / COMMUNITIES_PER_PAGE);
  const startIndex = (currentPage - 1) * COMMUNITIES_PER_PAGE;
  const endIndex = startIndex + COMMUNITIES_PER_PAGE;
  const currentCommunities = filteredCommunities.slice(startIndex, endIndex);

  // Get current user ID (you might need to adjust this based on your auth implementation)
  const currentUserId = localStorage.getItem('userId') || undefined;

  // Handle join/leave callbacks
  const handleJoin = (communityId: string) => {
    console.log('Joined community:', communityId);
    // Optionally trigger a refetch or update local state
  };

  const handleLeave = (communityId: string) => {
    console.log('Left community:', communityId);
    // Optionally trigger a refetch or update local state
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Communities</h1>
          <p className="text-gray-600">
            Find and join communities that match your interests and learning goals.
          </p>
        </div>

        {/* Search and Filter Section */}
        <Card className="p-6 mb-8">
          <CommunitySearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            showPrivateFilter={true}
            showPrivate={showPrivate}
            onPrivateFilterChange={setShowPrivate}
          />
        </Card>

        {/* Results Summary */}
        {!isLoading && (
          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {totalCommunities === 0 ? (
                'No communities found'
              ) : (
                <>
                  Showing {startIndex + 1}-{Math.min(endIndex, totalCommunities)} of {totalCommunities} communities
                  {(searchQuery || selectedTags.length > 0 || !showPrivate) && (
                    <span className="ml-2 text-blue-600">
                      (filtered results)
                    </span>
                  )}
                </>
              )}
            </div>
            
            {totalPages > 1 && (
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
            )}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-6 mb-8 border-red-200 bg-red-50">
            <div className="text-center">
              <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Communities</h3>
              <p className="text-red-600 mb-4">
                {error.message || 'Failed to load communities. Please try again.'}
              </p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                Retry
              </Button>
            </div>
          </Card>
        )}

        {/* Communities List */}
        <div className="mb-8">
          <CommunityList
            communities={currentCommunities}
            isLoading={isLoading}
            currentUserId={currentUserId}
            onJoin={handleJoin}
            onLeave={handleLeave}
            showActions={true}
            emptyMessage={
              searchQuery || selectedTags.length > 0 || !showPrivate
                ? "No communities match your current filters. Try adjusting your search criteria."
                : "No communities have been created yet. Be the first to create one!"
            }
            loadingMessage="Discovering communities for you..."
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && !isLoading && (
          <Card className="p-4">
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex space-x-1">
                {getPageNumbers().map((pageNumber) => (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(pageNumber)}
                    className="min-w-[40px]"
                  >
                    {pageNumber}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Create Community CTA */}
        {!isLoading && totalCommunities === 0 && !searchQuery && selectedTags.length === 0 && (
          <Card className="p-8 text-center mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Start Your Own Community
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Don't see a community that fits your interests? Create your own and invite others to join!
            </p>
            <Button 
              onClick={() => window.location.href = '/communities/create'}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create Community
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CommunitiesPage;