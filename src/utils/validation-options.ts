import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';

/**
 * Recursively generates error messages from validation errors.
 * @param errors - Array of ValidationError objects.
 * @returns An object containing the error messages.
 */
function generateErrors(errors: ValidationError[]): Record<string, any> {
  return errors.reduce(
    (accumulator, currentValue) => ({
      ...accumulator,
      [currentValue.property]:
        (currentValue.children?.length ?? 0) > 0
          ? generateErrors(currentValue.children ?? [])
          : Object.values(currentValue.constraints ?? {}).join(', '),
    }),
    {} as Record<string, any>,
  );
}

/**
 * Validation options for the ValidationPipe.
 * - `transform`: Automatically transform payloads to be objects typed according to their DTO classes.
 * - `whitelist`: Automatically strip non-whitelisted properties.
 * - `errorHttpStatusCode`: HTTP status code to be used for validation errors.
 * - `exceptionFactory`: A function that defines the exception to be thrown when validation fails.
 */
const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) => {
    return new UnprocessableEntityException({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      errors: generateErrors(errors),
    });
  },
};

export default validationOptions;
