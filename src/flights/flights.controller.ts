import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { FlightsService } from './flights.service';
import type { FlightInterface } from './interface/flightInterface';
import { Roles } from 'src/auth/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { FlightDTO } from './dto/flight.dto';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightservice: FlightsService) {}
  @Get()
  async getAllflights() {
    return await this.flightservice.getAllFlights();
  }

  @Get(':id')
  async getFlightDetails(@Param('id') id: string) {
    return this.flightservice.getFlightDetails(id);
  }

  @Post('/filter')
  async filterFlights(
    @Body()
    body: FlightInterface,
  ) {
    return this.flightservice.filterFlights(body);
  }

  @Post('/create')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async createFlight(@Body() body: FlightDTO) {
    return this.flightservice.createFlight(body);
  }
}
