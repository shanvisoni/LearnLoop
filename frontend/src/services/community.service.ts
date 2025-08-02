import api  from './api';
import type {
    Community,
    CreateCommunityDto,
    UpdateCommunityDto,
    CommunityResponse,
    CommunityMembersResponse,
    User,
    CommunityStats
} from '../types/community.types';


class CommunityService{
    private readonly basePath='/communities';
      async createCommunity(data: CreateCommunityDto): Promise<Community> {
        try {
            console.log('Creating community with data:', data);
            const response = await api.post(this.basePath, data);
            console.log('Community creation response:', response);
            return response.data;
        } catch (error: any) {
            console.error('Community creation error:', error);
            console.error('Error response:', error.response);
            
            throw error;
        }
    }

    async getAllCommunities(
        search?: string,
        page: number=1,
        limit: number=10
    ): Promise<CommunityResponse> {
        const params=new URLSearchParams();
        if(search) params.append('search',search);
        params.append('page',page.toString());
        params.append('limit',limit.toString());

        const response=await api.get(`${this.basePath}?${params}`);
        return response.data;
    }

    async getCommunityById(id:string): Promise<Community> {
        const response = await api.get(`${this.basePath}/${id}`);
        return response.data;
    }
    async updateCommunity(
        id:string,
        data:UpdateCommunityDto,
    ): Promise<Community> {
        const response= await api.patch(`${this.basePath}/${id}`,data);
        return response.data;
    }
    async deleteCommunity(id:string): Promise<void> {
     await api.delete(`${this.basePath}/${id}`);
    }

    async getMyCreatedCommunities(): Promise<Community[]>{
        const response = await api.get(`${this.basePath}/my-communities`);
        return response.data;
    }

    async getJoinedCommunities(): Promise<Community[]>{
        const response= await api.get(`${this.basePath}/joined-communities`);
        return response.data;
    }

  
async joinCommunity(id: string): Promise<Community> {
  try {
    console.log('Joining community:', id);
    const response = await api.post(`${this.basePath}/${id}/join`);
    console.log('Join response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Join community error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
}
    async leaveCommunity(id:string): Promise<Community>{
        const response= await api.post(`${this.basePath}/${id}/leave`);
        return response.data;
    }


    async getCommunityMembers(
        id:string,
        page:number=1,
        limit:number=10
    ): Promise<CommunityMembersResponse>{
        const response= await api.post(`${this.basePath}/${id}/members`,{
            page,
            limit
        });
        return response.data;
    }

    
  async getMemberProfile(
    communityId: string,
    userId: string
  ): Promise<User> {
    const response = await api.post(`${this.basePath}/${communityId}/members/${userId}`);
    return response.data;
  }

  async getCommunityStats(id: string): Promise<CommunityStats> {
    const response = await api.get(`${this.basePath}/${id}/stats`);
    return response.data;
  }
}

export const communityService=new CommunityService();

