import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum USER_ROLES {
  ADMIN = 'admin',
  PASSENEGER = 'passenger',
  STAFF = 'staff',
}

export type userDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ enum: USER_ROLES, default: USER_ROLES.PASSENEGER })
  role!: USER_ROLES;

  @Prop({ default: false })
  isEmailVerified!: boolean;

  // @Prop([
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Flight',
  //   },
  // ])
  // flights!: Flight[];
  createdat!: Date;
  updatedat!: Date;
}

export const userSchema = SchemaFactory.createForClass(User);
