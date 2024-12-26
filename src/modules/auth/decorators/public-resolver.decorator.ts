import { SetMetadata } from '@nestjs/common';

/**
 * Set the public resolvers, authentication gaurd will ignore these resolvers
 * @param {string[]} paths array of paths of the resolvers
 * @returns {void}
 */
export const PublicResolver = (paths: string[]) =>
  SetMetadata('isPublicResolver', paths);
