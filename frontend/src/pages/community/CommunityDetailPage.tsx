import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Users, FileText, BarChart3 } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import CommunityHeader from '@/components/community/CommunityHeader';
import CommunityMembersList from '@/components/community/CommunityMemberList';
import CommunityStats from '@/components/community/CommunityStats';
import PostList from '@/components/community/PostList';
import { 
  useCommunityById, 
  useCommunityPosts, 
  useJoinedCommunities,
  useCreatePost
} from '../../hooks/useCommunities';
import type { User, CreatePostDto } from '../../types/community.types';

const CommunityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'members'>('overview');
  // const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postData, setPostData] = useState({ title: '', content: '' });
  const [currentUserId] = useState<string>('current-user-id'); // This should come from auth context

  // Hooks
  const { data: community, isLoading: communityLoading, error: communityError } = useCommunityById(id!);
  const { data: joinedCommunitiesData } = useJoinedCommunities();
  const { data: postsData, isLoading: postsLoading } = useCommunityPosts(id!, 1, 6); // Preview posts
  const createPostMutation = useCreatePost();

  // Check if user is joined
  const isJoined = joinedCommunitiesData?.some(c => c._id === id) || false;

  useEffect(() => {
    if (!id) {
      navigate('/communities');
    }
  }, [id, navigate]);

  // Loading state
  if (communityLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (communityError || !community) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md mx-auto">
          <div className="text-red-500 mb-4">
            <FileText className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Community Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The community you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button 
            onClick={() => navigate('/communities')}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Communities
          </Button>
        </Card>
      </div>
    );
  }

  const handleCreatePost = async () => {
    if (!postData.title.trim() || !postData.content.trim()) return;

    const createPostDto: CreatePostDto = {
      title: postData.title,
      content: postData.content,
      communityId: id!
    };

    try {
      await createPostMutation.mutateAsync(createPostDto);

      // await Promise.all([
      //   queryClient.invalidateQueries({queryKey:['community',id]}),
      //   queryClient.invalidateQueries({queryKey:['communityStats',id]}),
      //   queryClient.invalidateQueries({queryKey:['community-posts',id]}),
      // ]);

      setPostData({ title: '', content: '' });
      setShowCreatePost(false);
      setActiveTab('posts');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleMemberClick = (member: User) => {
    // setSelectedMember(member);
    // You could open a modal or navigate to member profile
    console.log('Selected member:', member);
  };

  const isCreator = currentUserId === community.creatorId._id;
  const canCreatePost = isJoined || isCreator;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/communities')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Communities
          </Button>
        </div>

        {/* Community Header */}
        <div className="mb-8">
          <CommunityHeader 
            community={community}
            isJoined={isJoined}
            currentUserId={currentUserId}
            activeTab={activeTab}
          />
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('posts')}
                className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'posts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                {/* Posts ({community.posts.length}) */}
                Posts ({postsData?.total ?? 0})
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'members'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                Members ({community.members.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Community Info */}
                <div className="lg:col-span-2 space-y-6">
                  {/* About Section */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      About This Community
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {community.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {community.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Creator Info */}
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Created by</h4>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                          {community.creatorId.firstName.charAt(0)}{community.creatorId.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {community.creatorId.firstName} {community.creatorId.lastName}
                          </p>
                          <p className="text-sm text-gray-500">@{community.creatorId.username}</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Recent Posts Preview */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Recent Posts</h3>
                      {canCreatePost && (
                        <Button 
                          size="sm" 
                          onClick={() => setShowCreatePost(true)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          New Post
                        </Button>
                      )}
                    </div>
                    
                    {postsData?.posts && postsData.posts.length > 0 ? (
                      <div className="space-y-4">
                        {postsData.posts.slice(0, 3).map((post) => (
                          <div key={post._id} className="border-b pb-4 last:border-b-0">
                            <h4 className="font-medium text-gray-900 mb-1">{post.title}</h4>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{post.content}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>by {post.authorId.firstName} {post.authorId.lastName}</span>
                              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setActiveTab('posts')}
                          className="w-full mt-4"
                        >
                          View All Posts
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No posts yet</p>
                        {canCreatePost && (
                          <Button onClick={() => setShowCreatePost(true)}>
                            Create First Post
                          </Button>
                        )}
                      </div>
                    )}
                  </Card>
                </div>

                {/* Right Column - Stats and Members Preview */}
                <div className="space-y-6">
                  <CommunityStats communityId={id!} />
                  
                  {/* Members Preview */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Members</h3>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setActiveTab('members')}
                      >
                        View All
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {community.members.slice(0, 5).map((member) => (
                        <div key={member._id} className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium">
                            {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {member.firstName} {member.lastName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">@{member.username}</p>
                          </div>
                        </div>
                      ))}
                      {community.members.length > 5 && (
                        <p className="text-xs text-gray-500 text-center pt-2">
                          +{community.members.length - 5} more members
                        </p>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Community Posts</h3>
                  {canCreatePost && (
                    <Button 
                      onClick={() => setShowCreatePost(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Post
                    </Button>
                  )}
                </div>
                
                <PostList
                  posts={postsData?.posts || []}
                  loading={postsLoading}
                  currentUserId={currentUserId}
                  communityId={id!}
                  totalPosts={postsData?.total}
                  emptyTitle="No posts in this community yet"
                  emptyDescription="Be the first to share something with the community!"
                  showEmptyAction={canCreatePost}
                  onEmptyAction={() => setShowCreatePost(true)}
                  emptyActionText="Create First Post"
                />
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Members</h3>
                  <p className="text-gray-600">
                    Connect with {community.members.length} members of this community
                  </p>
                </div>
                
                <CommunityMembersList
                  communityId={id!}
                  onMemberClick={handleMemberClick}
                />
              </div>
            )}
          </div>
        </div>

        {/* Create Post Modal */}
        {showCreatePost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Create New Post</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowCreatePost(false)}
                  >
                    ×
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={postData.title}
                      onChange={(e) => setPostData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter post title..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content
                    </label>
                    <textarea
                      value={postData.content}
                      onChange={(e) => setPostData(prev => ({ ...prev, content: e.target.value }))}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="What would you like to share with the community?"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button 
                      variant="outline"
                      onClick={() => setShowCreatePost(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreatePost}
                      disabled={!postData.title.trim() || !postData.content.trim() || createPostMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityDetailPage;


