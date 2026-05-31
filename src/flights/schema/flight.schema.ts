import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum FLIGHTS_STATUS {
  SCHEDULED = 'scheduled',
  DELAYED = 'delayed',
  BOARDING = 'boarding',
  CANCELLED = 'cancelled',
  DEPARTED = 'departed',
  ARRIVED = 'arrived',
  UNKNOWN = 'unknown',
}

export type flightDocument = Flight & Document;

@Schema({ timestamps: true })
export class Flight {
  @Prop({ required: true, unique: true })
  flight_no!: number;

  @Prop({ required: true })
  Airline_name!: string;

  @Prop({ required: true })
  source!: string;

  @Prop({ required: true })
  destination!: string;

  @Prop({ required: true })
  departureTime!: string;

  @Prop({ required: true })
  arrivalTime!: string;

  @Prop({ required: true, default: 0 })
  totalSeats!: number;

  @Prop({ required: true, default: 0 })
  availableSeats!: number;

  @Prop({ enum: FLIGHTS_STATUS, default: FLIGHTS_STATUS.UNKNOWN, type: String })
  status!: FLIGHTS_STATUS.UNKNOWN;

  @Prop({ required: true })
  price!: number;
}

export const flightSchema = SchemaFactory.createForClass(Flight);
