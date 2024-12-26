import Bugsnag from '@bugsnag/js';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import axios, {
  AxiosBasicCredentials,
  AxiosError,
  AxiosRequestConfig,
  RawAxiosRequestHeaders,
} from 'axios';
import { ContentType, SendCallback } from '../@types';
import { HttpResponseDto } from '../dtos';
import { isJsonString, retry, stringToJson } from '../helpers';

@Injectable()
export class HttpService {
  /**
   * The request headers object
   */
  private _headers: RawAxiosRequestHeaders = {};

  /**
   * The request configuration object
   */
  private _config: AxiosRequestConfig = {};

  /**
   * If request fails, how many times it should be retried
   */
  private _retryTimes: number | number[] = 1;

  /**
   * If request failed, retry only when request failed with a specific status
   */
  private _retryWhenStatus: number;

  /**
   * Log errors if set to true
   */
  private _logError: boolean;

  /**
   * The Logger object
   */
  private readonly logger = new Logger(HttpService.name);

  /**
   * Add the given headers to the request.
   *
   * @param headers RawAxiosRequestHeaders
   * @returns this
   */
  withHeaders(headers: RawAxiosRequestHeaders): this {
    this._headers = { ...this._headers, ...headers };
    return this;
  }

  /**
   * Specify an authorization token for the request.
   *
   * @param token string
   * @param type string
   * @returns this
   */
  withToken(token: string, type = 'Bearer'): this {
    this._headers.Authorization = `${type} ${token}`;
    return this;
  }

  /**
   * Specify the URL parameters that can be substituted into the request URL.
   *
   * @param params any
   * @returns this
   */
  withUrlParameters(params: any): this {
    this._config.params = params;
    return this;
  }

  /**
   * Indicate the request contains JSON.
   *
   * @returns this
   */
  asJson(): this {
    this.contentType('application/json');
    return this;
  }

  /**
   * Indicate that JSON should be returned by the server.
   *
   * @returns this
   */
  acceptJson(): this {
    this.accept('application/json');
    return this;
  }

  /**
   * Specify the request's content type.
   *
   * @param contentType ContentType
   * @returns this
   */
  contentType(contentType: ContentType): this {
    this._headers['Content-Type'] = contentType;
    return this;
  }

  /**
   * Indicate the type of content that should be returned by the server.
   *
   * @param contentType ContentType
   * @returns this
   */
  accept(contentType: ContentType): this {
    this._headers.Accept = contentType;
    return this;
  }

  /**
   * Specify the basic authentication username and password for the request.
   *
   * @param credentials AxiosBasicCredentials
   * @returns this
   */
  withBasicAuth(credentials: AxiosBasicCredentials): this {
    this._config.auth = credentials;
    return this;
  }

  /**
   * Specify if error should be loggede
   */
  logError(): this {
    this._logError = true;
    return this;
  }

  /**
   * Specify the request base url
   *
   * @param url string
   * @returns this
   */
  baseUrl(url: string): this {
    this._config.baseURL = url;
    return this;
  }

  /**
   * Issue a request with given configurations
   *
   * @param config AxiosRequestConfig<any>
   * @returns Promise<HttpResponseDto<any>>
   */
  async request<T = any, D = any>(
    config: AxiosRequestConfig<D>,
  ): Promise<HttpResponseDto<T>> {
    return this.send(
      async () => await axios.request(this.mergedConfig<D>(config)),
    );
  }

  /**
   * Issue a GET request to the given URL.
   *
   * @param url string
   * @param config AxiosRequestConfig<any>
   * @returns Promise<HttpResponseDto<any>>
   */
  async get<T = any, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<HttpResponseDto<T>> {
    return this.send(
      async () => await axios.get(url, this.mergedConfig<D>(config)),
    );
  }

  /**
   * Issue a DELETE request to the given URL.
   *
   * @param url string
   * @param config AxiosRequestConfig<any>
   * @returns Promise<HttpResponseDto<any>>
   */
  async delete<T = any, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<HttpResponseDto<T>> {
    return this.send(
      async () => await axios.delete(url, this.mergedConfig<D>(config)),
    );
  }

  /**
   * Issue a HEAD request to the given URL.
   *
   * @param url string
   * @param config AxiosRequestConfig<any>
   * @returns Promise<HttpResponseDto<any>>
   */
  async head<T = any, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<HttpResponseDto<T>> {
    return this.send(
      async () => await axios.head(url, this.mergedConfig<D>(config)),
    );
  }

  /**
   * Issue a POST request to the given URL.
   *
   * @param url string
   * @param data D
   * @param config AxiosRequestConfig<any>
   * @returns Promise<HttpResponseDto<any>>
   */
  async post<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<HttpResponseDto<T>> {
    return this.send(
      async () => await axios.post(url, data, this.mergedConfig<D>(config)),
    );
  }

  /**
   * Issue a PUT request to the given URL.
   *
   * @param url string
   * @param data any
   * @param config AxiosRequestConfig<any>
   * @returns Promise<HttpResponseDto<any>>
   */
  async put<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<HttpResponseDto<T>> {
    return this.send(
      async () => await axios.put(url, data, this.mergedConfig<D>(config)),
    );
  }

  /**
   * Issue a PATCH request to the given URL.
   *
   * @param url string
   * @param data any
   * @param config AxiosRequestConfig<any>
   * @returns Promise<HttpResponseDto<any>>
   */
  async patch<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<HttpResponseDto<T>> {
    return this.send(
      async () => await axios.patch(url, data, this.mergedConfig<D>(config)),
    );
  }

  /**
   * Issue a POST request as form to the given URL.
   *
   * @param url string
   * @param data any
   * @param config AxiosRequestConfig<any>
   * @returns Promise<HttpResponseDto<any>>
   */
  async postForm<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<HttpResponseDto<T>> {
    return this.send(
      async () => await axios.postForm(url, data, this.mergedConfig<D>(config)),
    );
  }

  /**
   * Issue a PUT request as form to the given URL.
   *
   * @param url string
   * @param data any
   * @param config AxiosRequestConfig<any>
   * @returns Promise<HttpResponseDto<any>>
   */
  async putForm<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<HttpResponseDto<T>> {
    return this.send(
      async () => await axios.putForm(url, data, this.mergedConfig<D>(config)),
    );
  }

  /**
   * Issue a PATCH request as form to the given URL.
   *
   * @param url string
   * @param data any
   * @param config AxiosRequestConfig<any>
   * @returns Promise<HttpResponseDto<any>>
   */
  async patchForm<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<HttpResponseDto<T>> {
    return this.send(
      async () =>
        await axios.patchForm(url, data, this.mergedConfig<D>(config)),
    );
  }

  /**
   * Merge the configurations
   *
   * @param config AxiosRequestConfig<any>,
   * @returns
   */
  private mergedConfig<D>(
    config: AxiosRequestConfig<D>,
  ): AxiosRequestConfig<D> {
    config = { ...this._config, ...config };
    config.headers = { ...config.headers, ...this._headers };
    return config;
  }

  /**
   * Specify the number of times the request should be attempted.
   * @param _retryTimes numbe | number[]
   * @param _retryWhenStatus HttpStatus
   * @returns this
   */
  retry(
    retryTimes: number | number[],
    retryWhenStatus?: HttpStatus,
  ): HttpService {
    this._retryTimes = retryTimes;
    this._retryWhenStatus = retryWhenStatus;

    return this;
  }

  /**
   * Call the actual axios method whicih sends the request
   *
   * @param callback SendCallback<R>
   * @returns Promise<HttpResponseDto<R>>
   */
  private async send<R>(
    callback: SendCallback<R>,
  ): Promise<HttpResponseDto<R>> {
    const when = this._retryWhenStatus
      ? (error): boolean => {
          if (error instanceof AxiosError) {
            return (
              new HttpResponseDto(error.response).status() ===
              this._retryWhenStatus
            );
          }
          return false;
        }
      : null;
    try {
      return new HttpResponseDto<R>(
        await retry(this._retryTimes, async () => await callback(), when),
      );
    } catch (error: any) {
      if (this._logError) {
        if (error instanceof AxiosError && error.config) {
          const request = {
            data: isJsonString(error.config.data)
              ? stringToJson(error.config.data)
              : error.config.data,
            headers: error.config.headers,
            url: error.config.url,
          };
          const response = {
            data: error.response.data,
            headers: error.response.headers,
            status: error.response.status,
          };
          if (Bugsnag.isStarted()) {
            Bugsnag.addMetadata('request', request);
            Bugsnag.addMetadata('response', response);
            Bugsnag.notify(error);
          }

          this.logger.error(
            `Http Error: ${JSON.stringify({
              error: error.message,
              request,
              response,
            })}`,
          );
        } else {
          this.logger.error(`Http Error:' ${JSON.stringify(error)}`);
        }
      }
      if (error instanceof AxiosError && error.response)
        return new HttpResponseDto<R>(error.response, error);
      throw error;
    }
  }
}
