// src/services/post.service.ts
import api  from './api';
import type{
  Post,
  CreatePostDto,
  PostResponse,
  CreateCommentDto
} from '../types/community.types';

class PostService {
  private readonly basePath = '/posts';

  async createPost(data: CreatePostDto): Promise<Post> {
    const response = await api.post(this.basePath, data);
    return response.data;
  }

  async getPostsByCommunity(
    communityId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PostResponse> {
    const response = await api.get(
      `${this.basePath}/community/${communityId}?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async getUserPosts(
    page: number = 1,
    limit: number = 10
  ): Promise<PostResponse> {
    const response = await api.get(
      `${this.basePath}/my-posts?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async getPostById(id: string): Promise<Post> {
    const response = await api.get(`${this.basePath}/${id}`);
    return response.data;
  }

  async updatePost(id: string, data: Partial<CreatePostDto>): Promise<Post> {
    const response = await api.patch(`${this.basePath}/${id}`, data);
    return response.data;
  }

  async deletePost(id: string): Promise<void> {
    await api.delete(`${this.basePath}/${id}`);
  }

  async toggleLike(id: string): Promise<Post> {
    const response = await api.post(`${this.basePath}/${id}/like`);
    return response.data;
  }

  async addComment(id: string, data: CreateCommentDto): Promise<Post> {
    const response = await api.post(`${this.basePath}/${id}/comment`, data);
    return response.data;
  }

  async removeComment(id: string, commentId: string): Promise<Post> {
    const response = await api.delete(`${this.basePath}/${id}/comment/${commentId}`);
    return response.data;
  }
}

export const postService = new PostService();