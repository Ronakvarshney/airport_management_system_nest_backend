import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Flight, flightDocument } from './schema/flight.schema';
import { Model } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
import { FlightInterface } from './interface/flightInterface';
import { FlightDTO } from './dto/flight.dto';

@Injectable()
export class FlightsService {
  constructor(
    @InjectModel(Flight.name)
    private flightModel: Model<flightDocument>,
    private readonly mailService: MailService,
  ) {}
  async getAllFlights() {
    return await this.flightModel.find({});
  }

  async getFlightDetails(id) {
    const flight = await this.flightModel.findById(id);
    if (!flight) {
      throw new NotFoundException('Flight not found');
    }

    return flight;
  }

  async filterFlights(body: FlightInterface) {
    const filter: Record<string, any> = {};
    if (body.destination) {
      filter.destination = body.destination;
    }
    if (body.source) {
      filter.source = body.source;
    }
    if (body.departureTime) {
      filter.departureTime = body.departureTime;
    }
    if (body.arrivalTime) {
      filter.arrivalTime = body.arrivalTime;
    }
    if (body.Airline_name) {
      filter.Airline_name = body.Airline_name;
    }
    if (body.status) {
      filter.status = body.status;
    }
    if (body.price) {
      filter.price = body.price;
    }

    return await this.flightModel.find(filter);
  }

  async createFlight(body: FlightDTO) {
    const checkExisitingFlight = await this.flightModel.findOne({
      flight_no: body.flight_no,
      source: body.source,
      destination: body.destination,
      Airline_name: body.Airline_name,
      arrivalTime: body.arrivalTime,
      departureTime: body.departureTime,
    });
    if (checkExisitingFlight) {
      throw new ConflictException('Flight already exists with this details.');
    }

    await this.flightModel.create(body);
    return { message: 'flight has been created..' };
  }
}
