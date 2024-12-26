import { HttpStatus } from '@nestjs/common';
import { httpService } from '../../../test/setup';

type HttpResponseType = {
  args?: { [k in string]: string };
  form?: { [k in string]: string };
  json?: { [k in string]: string };
  headers?: { [k in string]: string };
  url: string;
};

type Methods =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'head'
  | 'delete'
  | 'status'
  | 'basic-auth';

const requestUrl = (method: Methods, status?: number) =>
  `https://postman-echo.com/${method}/${status ?? ''}`;

describe('HttpService', () => {
  it('should be defined', () => {
    expect(httpService).toBeDefined();
  });

  it('should issue a "get" request by setting the base url', async () => {
    const response = await httpService
      .baseUrl('https://postman-echo.com')
      .get<HttpResponseType>('get');
    expect(response.ok()).toBeTruthy();
    expect(response.data().url).toBe('https://postman-echo.com/get');
  });

  describe('get', () => {
    it('should issue a "get" request', async () => {
      const response = await httpService.get<HttpResponseType>(
        'https://httpbin.org/get',
      );
      expect(response.ok()).toBeTruthy();
      expect(response.data()).toBeDefined();
    });

    it('should issue a "get" request with headers', async () => {
      const token = 'some-bearer-token';
      const response = await httpService
        .withHeaders({ Authorization: `Bearer ${token}` })
        .get<HttpResponseType>('https://httpbin.org/get');
      expect(response.ok()).toBeTruthy();
      expect(response.data().headers['Authorization']).toBe(`Bearer ${token}`);
    });

    it('should issue a "get" request with query parameters', async () => {
      const params = { paramOne: 'valueOne', paramTwo: 'valueTwo' };
      const response = await httpService
        .withUrlParameters(params)
        .get<HttpResponseType>('https://httpbin.org/get');
      expect(response.ok()).toBeTruthy();
      expect(response.data().args).toEqual(params);
    });

    it('should issue a "get" request with Bearer token', async () => {
      const token = 'some-bearer-token';
      const response = await httpService
        .withToken(token)
        .get<HttpResponseType>('https://httpbin.org/get');
      expect(response.ok()).toBeTruthy();
      expect(response.data().headers['Authorization']).toBe(`Bearer ${token}`);
    });

    it('should issue a "get" request with specified type of token', async () => {
      const token = 'some-bearer-token';
      const response = await httpService
        .withToken(token, 'Basic')
        .get<HttpResponseType>('https://httpbin.org/get');
      expect(response.ok()).toBeTruthy();
      expect(response.data().headers['Authorization']).toBe(`Basic ${token}`);
    });

    it('should issue a "post" request as json', async () => {
      const response = await httpService
        .asJson()
        .post<HttpResponseType>(requestUrl('post'));
      expect(response.ok()).toBeTruthy();
      expect(response.data().headers['content-type']).toBe('application/json');
    });

    it('should issue a "post" request which accepts json', async () => {
      const response = await httpService
        .acceptJson()
        .post<HttpResponseType>(requestUrl('post'));
      expect(response.ok()).toBeTruthy();
      expect(response.data().headers['accept']).toBe('application/json');
    });

    it('should issue a "post" request with content type header', async () => {
      const response = await httpService
        .contentType('application/x-www-form-urlencoded')
        .post<HttpResponseType>(requestUrl('post'));
      expect(response.ok()).toBeTruthy();
      expect(response.data().headers['content-type']).toBe(
        'application/x-www-form-urlencoded',
      );
    });

    it('should issue a "post" request with accept header', async () => {
      const response = await httpService
        .accept('application/json')
        .post<HttpResponseType>(requestUrl('post'));
      expect(response.ok()).toBeTruthy();
      expect(response.data().headers['accept']).toBe('application/json');
    });

    it('should issue a authorized "get" request with basic auth', async () => {
      const response = await httpService
        .withBasicAuth({ username: 'postman', password: 'password' })
        .get<HttpResponseType>(requestUrl('basic-auth'));
      expect(response.ok()).toBeTruthy();
    });

    it('should issue a unauthorized "get" request with basic auth', async () => {
      const response = await httpService
        .withBasicAuth({ username: 'postman', password: 'wrong' })
        .get<HttpResponseType>(requestUrl('basic-auth'));
      expect(response.unauthorized()).toBeTruthy();
    });

    it('should issue a "post" request with data as json', async () => {
      const data = { prop: 'value' };
      const response = await httpService
        .asJson()
        .acceptJson()
        .post<HttpResponseType>(requestUrl('post'), data);
      expect(response.ok()).toBeTruthy();
      expect(response.data().json).toEqual(data);
    });

    it('should issue a "post" request with data as form', async () => {
      const data = { prop: 'value' };
      const response = await httpService.postForm<HttpResponseType>(
        requestUrl('post'),
        data,
      );
      expect(response.ok()).toBeTruthy();
      expect(response.data().form).toEqual(data);
    });

    it('should issue a "put" request with data as json', async () => {
      const data = { prop: 'value' };
      const response = await httpService
        .asJson()
        .acceptJson()
        .put<HttpResponseType>(requestUrl('put'), data);
      expect(response.ok()).toBeTruthy();
      expect(response.data().json).toEqual(data);
    });

    it('should issue a "patch" request with data as json', async () => {
      const data = { prop: 'value' };
      const response = await httpService
        .asJson()
        .acceptJson()
        .patch<HttpResponseType>(requestUrl('patch'), data);
      expect(response.ok()).toBeTruthy();
      expect(response.data().json).toEqual(data);
    });

    it('should issue a "delete" request with data as json', async () => {
      const response = await httpService.delete<HttpResponseType>(
        requestUrl('delete'),
      );
      expect(response.ok()).toBeTruthy();
    });

    it('should issue a "head" request with data as json', async () => {
      const response = await httpService.head<HttpResponseType>(
        requestUrl('head'),
      );
      expect(response.ok()).toBeTruthy();
    });

    it('should issue a "get" request using request method', async () => {
      const response = await httpService.request<HttpResponseType>({
        url: requestUrl('get'),
        method: 'get',
      });
      expect(response.ok()).toBeTruthy();
    });

    it('should issue a "put" request with data as form', async () => {
      const data = { prop: 'value' };
      const response = await httpService.putForm<HttpResponseType>(
        requestUrl('put'),
        data,
      );
      expect(response.ok()).toBeTruthy();
      expect(response.data().form).toEqual(data);
    });

    it('should issue a "patch" request with data as form', async () => {
      const data = { prop: 'value' };
      const response = await httpService.patchForm<HttpResponseType>(
        requestUrl('patch'),
        data,
      );
      expect(response.ok()).toBeTruthy();
      expect(response.data().form).toEqual(data);
    });

    it('should issue a "get" request with a client error response', async () => {
      const response = await httpService.get<HttpResponseType>(
        requestUrl('status', 404),
      );
      expect(response.clientError()).toBeTruthy();
    });

    it('should issue a "get" request with a server error response', async () => {
      const response = await httpService.get<HttpResponseType>(
        requestUrl('status', HttpStatus.SERVICE_UNAVAILABLE),
      );
      expect(response.serverError()).toBeTruthy();
    });

    it('should issue a "get" request with a successr response', async () => {
      const response = await httpService.get<HttpResponseType>(
        requestUrl('status', HttpStatus.CREATED),
      );
      expect(response.successful()).toBeTruthy();
    });

    it('should issue a "get" request with a failed response', async () => {
      const response = await httpService.get<HttpResponseType>(
        requestUrl('status', HttpStatus.UNAUTHORIZED),
      );
      expect(response.failed()).toBeTruthy();
    });

    it('should issue a "get" request with a OK response', async () => {
      const response = await httpService.get<HttpResponseType>(
        requestUrl('status', HttpStatus.OK),
      );
      expect(response.ok()).toBeTruthy();
    });

    it('should issue a "get" request with a CREATED response', async () => {
      const response = await httpService.get<HttpResponseType>(
        requestUrl('status', HttpStatus.CREATED),
      );
      expect(response.created()).toBeTruthy();
    });

    it('should issue a "get" request with a ACCEPTED response', async () => {
      const response = await httpService.get<HttpResponseType>(
        requestUrl('status', HttpStatus.ACCEPTED),
      );
      expect(response.accepted()).toBeTruthy();
    });

    it('should issue a "get" request with a NO_CONTENT response', async () => {
      const response = await httpService.get<HttpResponseType>(
        requestUrl('status', HttpStatus.NO_CONTENT),
      );
      expect(response.noContent()).toBeTruthy();
    });

    it('should issue a "get" request with a MOVED_PERMANENTLY response', async () => {
      const response = await httpService.get<HttpResponseType>(
        requestUrl('status', HttpStatus.MOVED_PERMANENTLY),
      );
      expect(response.movedPermanently()).toBeTruthy();
    });

    it('should issue a "get" request with a FOUND response', async () => {
      const response = await httpService.get<HttpResponseType>(
        requestUrl('status', HttpStatus.FOUND),
      );
      expect(response.found()).toBeTruthy();
    });

    it('should issue a "get" request with a BAD_REQUEST response', async () => {
      const response = await httpService.get<HttpResponseType>(
        requestUrl('status', HttpStatus.BAD_REQUEST),
      );
      expect(response.badRequest()).toBeTruthy();
    });

    it('should issue a "get" request with a UNAUTHORIZED response', async () => {
      const response = await httpService.get<HttpResponseType>(
        requestUrl('status', HttpStatus.UNAUTHORIZED),
      );
      expect(response.unauthorized()).toBeTruthy();
    });

    it('should issue a "get" request with a PAYMENT_REQUIRED response', async () => {
      const response = await httpService.get<HttpResponseType>(
        requestUrl('status', HttpStatus.PAYMENT_REQUIRED),
      );
      expect(response.paymentRequired()).toBeTruthy();
    });

    it('should issue a "get" request with a FORBIDDEN response', async () => {
      const response = await httpService.get<HttpResponseType>(
        requestUrl('status', HttpStatus.FORBIDDEN),
      );
      expect(response.forbidden()).toBeTruthy();
    });

    it('should issue a "get" request with a NOT_FOUND response', async () => {
      const response = await httpService.get<HttpResponseType>(
        requestUrl('status', HttpStatus.NOT_FOUND),
      );
      expect(response.notFound()).toBeTruthy();
    });

    it('should issue a "get" request with a REQUEST_TIMEOUT response', async () => {
      const response = await httpService.get<HttpResponseType>(
        requestUrl('status', HttpStatus.REQUEST_TIMEOUT),
      );
      expect(response.requestTimeout()).toBeTruthy();
    });

    it('should issue a "get" request with a CONFLICT response', async () => {
      const response = await httpService.get<HttpResponseType>(
        requestUrl('status', HttpStatus.CONFLICT),
      );
      expect(response.conflict()).toBeTruthy();
    });

    it('should issue a "get" request with a UNPROCESSABLE_ENTITY response', async () => {
      const response = await httpService.get<HttpResponseType>(
        requestUrl('status', HttpStatus.UNPROCESSABLE_ENTITY),
      );
      expect(response.unprocessableEntity()).toBeTruthy();
    });

    it('should issue a "get" request with a TOO_MANY_REQUESTS response', async () => {
      const response = await httpService.get<HttpResponseType>(
        requestUrl('status', HttpStatus.TOO_MANY_REQUESTS),
      );
      expect(response.tooManyRequests()).toBeTruthy();
    });

    it('should issue a "get" request with error, and log the error', async () => {
      const response = await httpService
        .logError()
        .get<HttpResponseType>(
          requestUrl('status', HttpStatus.INTERNAL_SERVER_ERROR),
        );
      expect(response.serverError()).toBeTruthy();
    });

    it('should issue a "get" request with error, and retry when status is ', async () => {
      const response = await httpService
        .retry(1, HttpStatus.INTERNAL_SERVER_ERROR)
        .get<HttpResponseType>(
          requestUrl('status', HttpStatus.INTERNAL_SERVER_ERROR),
        );
      expect(response.serverError()).toBeTruthy();
    });
  });
});
