import { Milliseconds, RetryCallback, WhereCallback } from '../@types';

/**
 * Retry an operation for number of times
 *
 * @param {number | number[]} times
 * @param {RetryCallback<T>} callback
 * @param {WhereCallback} when
 * @returns {Promise<any>}
 */
export const retry = async <T>(
  times: number | number[],
  callback: RetryCallback<T>,
  when?: WhereCallback,
): Promise<any> => {
  let attempts = 0;
  let backoff: number[] = [];

  if (Array.isArray(times)) {
    backoff = times;
    times = times.length + 1;
  }

  while (true) {
    attempts++;
    times--;

    try {
      return await callback(attempts);
    } catch (e) {
      if (when && !when(e)) {
        throw e;
      }
      if (times < 1) {
        throw e;
      }

      let sleepDuration = 100;
      sleepDuration = backoff[attempts - 1] ?? sleepDuration;
      await await sleep(sleepDuration);
    }
  }
};

/**
 * Sleep, by pausing the execution of script
 *
 * @param {Milliseconds} duration
 * @returns {Promise<void>}
 */
export const sleep = (duration: Milliseconds): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, duration));
};
