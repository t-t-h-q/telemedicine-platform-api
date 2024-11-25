import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorSchema, DoctorSchemaClass } from './entities/doctor.schema';
import { DoctorRepository } from '../doctor.repository';
import { DoctorDocumentRepository } from './repositories/doctor.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DoctorSchemaClass.name, schema: DoctorSchema },
    ]),
  ],
  providers: [
    {
      provide: DoctorRepository,
      useClass: DoctorDocumentRepository,
    },
  ],
  exports: [DoctorRepository],
})
export class DocumentDoctorPersistenceModule {}
