import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AppointmentSchema,
  AppointmentSchemaClass,
} from './entities/appointment.schema';
import { AppointmentRepository } from '../appointment.repository';
import { AppointmentDocumentRepository } from './repositories/appointment.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AppointmentSchemaClass.name, schema: AppointmentSchema },
    ]),
  ],
  providers: [
    {
      provide: AppointmentRepository,
      useClass: AppointmentDocumentRepository,
    },
  ],
  exports: [AppointmentRepository],
})
export class DocumentAppointmentPersistenceModule {}
