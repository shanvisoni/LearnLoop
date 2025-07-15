// // src/communities/communities.module.ts
// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { CommunitiesService } from './communities.service';
// import { CommunitiesController } from './communities.controller';
// import { Community, CommunitySchema } from './schemas/community.schema';

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       { name: Community.name, schema: CommunitySchema },
//     ]),
//   ],
//   controllers: [CommunitiesController],
//   providers: [CommunitiesService],
//   exports: [CommunitiesService],
// })
// export class CommunitiesModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommunitiesService } from './communities.service';
import { CommunitiesController } from './communities.controller';
import { Community, CommunitySchema } from './schemas/community.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Community.name, schema: CommunitySchema },
      { name: User.name, schema: UserSchema }, // Add User model
    ]),
  ],
  controllers: [CommunitiesController],
  providers: [CommunitiesService],
  exports: [CommunitiesService],
})
export class CommunitiesModule {}
