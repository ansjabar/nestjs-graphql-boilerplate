import {
  WrapInTransactionOptions,
  wrapInTransaction,
} from 'typeorm-transactional';

export const InTransaction = (
  options?: WrapInTransactionOptions,
): MethodDecorator => {
  return (
    _: unknown,
    methodName: string | symbol,
    descriptor: TypedPropertyDescriptor<unknown>,
  ) => {
    const originalMethod = descriptor.value as () => unknown;

    if (process.env.NODE_ENV !== 'test') {
      // Apply transactional behavior only in test environment
      descriptor.value = wrapInTransaction(originalMethod, {
        ...options,
        name: methodName,
      });

      Reflect.getMetadataKeys(originalMethod).forEach((previousMetadataKey) => {
        const previousMetadata = Reflect.getMetadata(
          previousMetadataKey,
          originalMethod,
        );

        Reflect.defineMetadata(
          previousMetadataKey,
          previousMetadata,
          descriptor.value as object,
        );
      });

      Object.defineProperty(descriptor.value, 'name', {
        value: originalMethod.name,
        writable: false,
      });
    } else {
      // If not in test environment, simply return the original method without modification
      descriptor.value = originalMethod;
    }
  };
};
