import {
  firstWord,
  isJsonString,
  jsonToString,
  makePossessive,
  randomAlphaNumericString,
  randomAlphabetString,
  removeAfterLastOccurrenceInclusive,
  stringToJson,
  toLowerCase,
} from '../helpers';

describe('Helper', () => {
  describe('randomAlphaNumericString', () => {
    it('should generate a random aplha-numeric string', async () => {
      const string = randomAlphaNumericString();
      expect(string).toBeDefined();
      expect(string.length).toBe(64);
    });
  });
  describe('randomAlphabetString', () => {
    it('should generate a random aplha string', async () => {
      const string = randomAlphabetString();
      expect(string).toBeDefined();
      expect(string.length).toBe(64);
    });
  });

  describe('firstWord', () => {
    it('should return the first word of string of one word', async () => {
      expect(firstWord('Hello')).toEqual('Hello');
    });

    it('should return the first word of string of two words', async () => {
      expect(firstWord('Hello World')).toEqual('Hello');
    });

    it('should return the first word of string of more than two words', async () => {
      expect(firstWord('Hello Beautiful World')).toEqual('Hello');
    });
  });

  describe('toLowerCase', () => {
    it('should convert a string to lower case', async () => {
      expect(toLowerCase('Hello World')).toEqual('hello world');
    });
  });

  describe('removeAfterLastOccurrenceInclusive', () => {
    it('should remove string after "=" character', () => {
      expect(removeAfterLastOccurrenceInclusive('before=after', '=')).toEqual(
        'before',
      );
    });

    it('should remove string after only last occurrence of "=" character', () => {
      expect(
        removeAfterLastOccurrenceInclusive('first=last=after', '='),
      ).toEqual('first=last');
    });

    it('should return string as it if there is no occurrnece of "=" character', () => {
      expect(
        removeAfterLastOccurrenceInclusive('string should be as it is', '='),
      ).toEqual('string should be as it is');
    });
  });

  describe('jsonToString', () => {
    it('should parse json to string', () => {
      expect(jsonToString({ key: 'value' })).toBe('{"key":"value"}');
    });
  });

  describe('stringToJson', () => {
    it('should parse string to json', () => {
      expect(stringToJson('{"key": "value"}')).toEqual({ key: 'value' });
    });
  });

  describe('makePossessive', () => {
    it('should make possessive when does not end with s', () => {
      expect(makePossessive('Muhammad')).toEqual(`Muhammad's`);
    });
    it('should make possessive when ends with s', () => {
      expect(makePossessive('Anas')).toEqual(`Anas'`);
    });
  });

  describe('isJsonString', () => {
    it('should return true is string is json', () => {
      expect(isJsonString('{"key":"value"}')).toBeTruthy();
    });
    it('should return false is string is json', () => {
      expect(isJsonString('not a json')).toBeFalsy();
    });
  });
});
