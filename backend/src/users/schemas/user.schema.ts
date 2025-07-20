import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;

  @Prop()
  firstName?: string;
  @Prop()
  lastName?: string;

  @Prop()
  bio?: string;

  @Prop()
  avatar?: string;

  @Prop({
    type: {
      email: { type: String },
      phone: { type: String },
      linkedin: { type: String },
      github: { type: String },
    },
  })
  contactInfo?: {
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
  };

  @Prop()
  resetPasswordToken?: string;

  @Prop()
  resetPasswordExpires?: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Community' }] })
  joinedCommunities: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Community' }] })
  createdCommunities: Types.ObjectId[];
}
export const UserSchema = SchemaFactory.createForClass(User);
