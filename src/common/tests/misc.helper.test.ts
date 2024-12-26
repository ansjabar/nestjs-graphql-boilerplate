import { retry } from './../helpers';

describe('retry', () => {
  it('should successfully execute the callback on the first attempt', async () => {
    const callback = jest.fn().mockResolvedValue('success');

    const result = await retry(3, callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(result).toBe('success');
  });

  it('should retry the callback specified number of times on failure', async () => {
    const callback = jest
      .fn()
      .mockRejectedValueOnce(new Error('failure1'))
      .mockRejectedValueOnce(new Error('failure2'))
      .mockResolvedValue('success');

    const result = await retry(3, callback);

    expect(callback).toHaveBeenCalledTimes(3);
    expect(result).toBe('success');
  });

  it('should fail after exhausting all retries', async () => {
    const callback = jest.fn().mockRejectedValue(new Error('failure'));

    await expect(retry(3, callback)).rejects.toThrow('failure');

    expect(callback).toHaveBeenCalledTimes(3);
  });

  it('should use backoff delays between attempts when specified', async () => {
    const callback = jest
      .fn()
      .mockRejectedValueOnce(new Error('failure1'))
      .mockRejectedValueOnce(new Error('failure2'))
      .mockResolvedValue('success');

    await retry([100, 200], callback);

    expect(callback).toHaveBeenCalledTimes(3);
  });

  it('should use default delay if backoff array is shorter than retries', async () => {
    const callback = jest
      .fn()
      .mockRejectedValueOnce(new Error('failure1'))
      .mockResolvedValue('success');

    await retry([100], callback);

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should not retry if the times parameter is 1', async () => {
    const callback = jest.fn().mockRejectedValue(new Error('failure'));

    await expect(retry(1, callback)).rejects.toThrow('failure');

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
