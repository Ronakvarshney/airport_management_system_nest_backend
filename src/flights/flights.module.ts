import { Module } from '@nestjs/common';
import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Flight, flightSchema } from './schema/flight.schema';
import { MailModule } from 'src/mail/mail.module';

@Module({
  controllers: [FlightsController],
  providers: [FlightsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Flight.name,
        schema: flightSchema,
      },
    ]),
    MailModule,
  ],
})
export class FlightsModule {}
