import { FLIGHTS_STATUS } from '../schema/flight.schema';

export interface FlightInterface {
  source?: string;
  destination?: string;
  status?: FLIGHTS_STATUS;
  price?: number;
  arrivalTime?: string;
  departureTime?: string;
  Airline_name?: string;
}
