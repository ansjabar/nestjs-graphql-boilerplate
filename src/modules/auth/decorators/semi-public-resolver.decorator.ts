import { SetMetadata } from '@nestjs/common';

/**
 * Set the semi public resolvers, authentication gaurd will ignore these resolvers
 * @param {string[]} paths array of paths of the resolvers
 * @returns {void}
 */
export const SemiPublicResolver = (paths: string[]) =>
  SetMetadata('isSemiPublicResolver', paths);
