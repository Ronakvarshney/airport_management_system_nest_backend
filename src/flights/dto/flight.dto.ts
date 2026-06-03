import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { FLIGHTS_STATUS } from '../schema/flight.schema';

export class FlightDTO {
  @IsNumber()
  @IsNotEmpty()
  flight_no!: number;

  @IsString({ message: 'airline name must be string' })
  @IsNotEmpty()
  Airline_name!: string;

  @IsString()
  @IsNotEmpty()
  source!: string;

  @IsString()
  @IsNotEmpty()
  destination!: string;

  @IsString()
  @IsNotEmpty()
  departureTime!: string;

  @IsString()
  @IsNotEmpty()
  arrivalTime!: string;

  @IsNumber()
  @IsNotEmpty()
  totalSeats!: number;

  @IsNumber()
  @IsNotEmpty()
  availableSeats!: number;

  @IsEnum(FLIGHTS_STATUS, { message: 'flight status must be valid' })
  status!: FLIGHTS_STATUS;

  @IsNumber()
  @IsNotEmpty()
  price!: number;
}
