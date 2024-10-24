import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import validationOptions from './utils/validation-options';
import { AllConfigType } from './config/config.type';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Initializes and configures the NestJS application.
 *
 * This function performs the following tasks:
 * - Creates the NestJS application with CORS enabled.
 * - Configures the dependency injection container to use the AppModule.
 * - Retrieves the configuration service.
 * - Enables shutdown hooks for graceful shutdown.
 * - Sets a global prefix for all routes, excluding the root path.
 * - Enables URI-based versioning for the API.
 * - Applies global validation pipes for request validation.
 * - Applies global interceptors for class serialization.
 * - Configures Swagger for API documentation with bearer authentication.
 * - Starts the application and listens on port 3000.
 *
 * @async
 * @function bootstrap
 * @returns {Promise<void>} A promise that resolves when the application is successfully started.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { cors: true });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);

  app.enableShutdownHooks();
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  try {
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);
  } catch (error) {
    console.error('Error setting up Swagger documentation:', error);
  }

  await app.listen(configService.getOrThrow('app.port', { infer: true }));
}
bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});
