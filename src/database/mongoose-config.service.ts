import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { AllConfigType } from '../config/config.type';
import * as mongooseAutoPopulate from 'mongoose-autopopulate';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private configService: ConfigService<AllConfigType>) {}

  /**
   * Creates and returns the Mongoose module options.
   *
   * @returns {MongooseModuleOptions} The configuration options for Mongoose.
   *
   * @remarks
   * This method retrieves the database connection details from the configuration service,
   * including the URI, database name, username, and password. It also sets up a connection
   * factory to apply the `mongooseAutoPopulate` plugin to the connection.
   *
   * @example
   * ```typescript
   * const mongooseOptions = mongooseConfigService.createMongooseOptions();
   * ```
   */
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.configService.get('database.url', { infer: true }),
      dbName: this.configService.get('database.name', { infer: true }),
      user: this.configService.get('database.username', { infer: true }),
      pass: this.configService.get('database.password', { infer: true }),
      connectionFactory(connection) {
        connection.plugin(mongooseAutoPopulate);
        return connection;
      },
    };
  }
}
