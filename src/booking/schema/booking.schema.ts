import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Flight } from 'src/flights/schema/flight.schema';
import { User } from 'src/user/schema/user.schema';

export enum BOK_STATUS {
  CONFIRMED = 'confirmed',
  REJECT = 'reject',
  PENDING = 'pending',
}

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user!: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
  })
  flight!: Flight;

  @Prop({ required: true })
  seatNumber!: string;

  @Prop({ required: true, default: BOK_STATUS.PENDING })
  status!: string;

  createdat!: Date;
  updatedat!: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
