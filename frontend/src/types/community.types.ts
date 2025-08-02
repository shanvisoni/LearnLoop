export interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface Community {
  _id: string;
  name: string;
  description: string;
  tags: string[];
  creatorId: User;
  members: User[];
  posts: string[];
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommunityDto {
  name: string;
  description: string;
  tags: string[];
  isPrivate?: boolean;
}

export interface UpdateCommunityDto {
  name?: string;
  description?: string;
  tags?: string[];
  isPrivate?: boolean;
}

export interface CommunityResponse {
  communities: Community[];
  total: number;
}

export interface CommunityMembersResponse {
  members: User[];
  total: number;
}

export interface CommunityStats {
  memberCount: number;
  postCount: number;
  isPrivate: boolean;
  createdAt: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  authorId: User;
  communityId: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  authorId: User;
  content: string;
  createdAt: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
  communityId: string;
}

export interface CreateCommentDto {
  content: string;
}

export interface PostResponse {
  posts: Post[];
  total: number;
}