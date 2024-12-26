const randomString = (length: number, charSet: string) => {
  let result = '';
  const charactersLength = charSet.length;
  let counter = 0;
  while (counter < length) {
    result += charSet.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const randomAlphaNumericString = (length = 64): string =>
  randomString(length, 'abcdefghijklmnopqrstuvwxyz0123456789');

export const randomAlphabetString = (length = 64): string =>
  randomString(length, 'abcdefghijklmnopqrstuvwxyz');

export const firstWord = (string: string): string => {
  return string.trim().split(/\s+/)[0];
};

export const toLowerCase = (string: string): string =>
  string.toLowerCase().trim();

export const makePossessive = (word: string): string => {
  if (word.endsWith('s')) {
    return word + "'";
  } else {
    return word + "'s";
  }
};

export const removeAfterLastOccurrenceInclusive = (
  string: string,
  character: string,
): string => {
  const lastIndexOfEqual = string.lastIndexOf(character);

  if (lastIndexOfEqual !== -1) {
    return string.substring(0, lastIndexOfEqual);
  } else {
    return string;
  }
};

export const isJsonString = (string: string) => {
  try {
    JSON.parse(string);
    return true;
  } catch (error) {
    return false;
  }
};

export const stringToJson = (string: string) => JSON.parse(string);

export const jsonToString = (json: object) => JSON.stringify(json);
