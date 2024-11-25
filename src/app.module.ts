import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { MailerModule } from './mailer/mailer.module';
import { SessionModule } from './session/session.module';
import { UsersModule } from './users/users.module';
import { DoctorsModule } from './doctors/doctors.module';
import appConfig from './config/app.config';
import databaseConfig from './database/config/database.config';
import authConfig from './auth/config/auth.config';
import mailConfig from './mail/config/mail.config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './database/mongoose-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig, mailConfig],
      envFilePath: ['.env'],
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    UsersModule,
    AuthModule,
    SessionModule,
    MailModule,
    MailerModule,
    DoctorsModule,
  ],
})
export class AppModule {}
