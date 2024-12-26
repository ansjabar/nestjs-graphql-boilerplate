import * as bcryptjs from 'bcryptjs';

export const hash = {
  make: async (string: string, rounds = 10): Promise<string> =>
    await bcryptjs.hash(string, rounds),

  check: async (toCheck: { string: string; hash: string }): Promise<boolean> =>
    bcryptjs.compare(toCheck.string, toCheck.hash),
};
