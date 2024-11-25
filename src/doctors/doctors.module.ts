import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { DocumentDoctorPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    // import modules, etc.
    DocumentDoctorPersistenceModule,
    UsersModule,
  ],
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports: [DoctorsService, DocumentDoctorPersistenceModule],
})
export class DoctorsModule {}
