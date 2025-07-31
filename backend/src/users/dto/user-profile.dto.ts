export class UserProfileDto {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
  };
  joinedCommunities: string[];
  createdCommunities: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
