import { join } from 'path';
import * as request from 'supertest';
import { app, prepareGqlResponse } from '../../../../test/setup';

export const upload = async <T>(token: string, files: string[]): Promise<T> => {
  const operation = {
    query:
      'mutation ($files: [Upload!]!) { upload(files: $files) {id, file, name, metadata, createdAt, children { id, file, name, metadata, createdAt} } }',
    variables: {
      files: Array.from({ length: files.length }, () => null),
    },
  };

  const map = {};
  files.forEach((file, index) => {
    map[index.toString()] = [`variables.files.${index}`];
  });

  const upload = request(app.getHttpServer())
    .post('/graphql')
    .set('Authorization', `Bearer ${token}`)
    .set('x-apollo-operation-name', 'true')
    .field('operations', JSON.stringify(operation))
    .field('map', JSON.stringify(map));

  files.forEach((file, index) => {
    upload.attach(
      index.toString(),
      join(process.cwd(), './test/setup/' + file),
    );
  });

  const result = (await upload).body;
  return prepareGqlResponse('upload', result);
};
