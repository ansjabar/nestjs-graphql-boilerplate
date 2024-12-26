import { HttpStatus } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import { Callable } from '../@types';

export class HttpResponseDto<T = any> {
  constructor(
    private readonly _axiosResponse: AxiosResponse<T>,
    private readonly _error?: AxiosError,
  ) {}

  /**
   * Get the response.
   *
   * @returns AxiosResponse
   */
  response(): AxiosResponse<T> {
    return this._axiosResponse;
  }

  /**
   * Get the response.
   *
   * @returns AxiosResponse
   */
  data(): T {
    return this._axiosResponse.data;
  }

  /**
   * Get the status code of the response.
   *
   * @returns number
   */
  status(): number {
    return Number(this._axiosResponse.status);
  }

  /**
   * Determine if the response indicates a client error occurred.
   *
   * @returns boolean
   */
  clientError(): boolean {
    return (
      this.status() >= HttpStatus.BAD_REQUEST &&
      this.status() < HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  /**
   * Determine if the response indicates a server error occurred.
   *
   * @returns boolean
   */
  serverError(): boolean {
    return this.status() >= HttpStatus.INTERNAL_SERVER_ERROR;
  }

  /**
   * Determine if the request was successful.
   *
   * @returns boolean
   */
  successful(): boolean {
    return (
      this.status() >= HttpStatus.OK && this.status() < HttpStatus.AMBIGUOUS
    );
  }

  /**
   * Determine if the response indicates a client or server error occurred.
   *
   * @returns boolean
   */
  failed() {
    return this.serverError() || this.clientError();
  }

  /**
   * Get the error object if request failed
   *
   * @returns AxiosError
   */
  error(): AxiosError {
    if (this.failed()) {
      return this._error;
    }
  }

  /**
   * Get the error message if request failed
   *
   * @returns string
   */
  errorMessage(): string {
    if (this.failed()) {
      return this._error.message;
    }
  }

  /**
   * Execute the given callback if there was a server or client error.
   *
   * @param  callable  callback
   * @return this
   */
  async onError(callable: Callable): Promise<HttpResponseDto<T>> {
    if (this.failed()) {
      await callable(this._axiosResponse);
    }
    return this;
  }

  /**
   * Execute the given callback if there is a specific response status
   *
   * @param  callable  callback
   * @param  status  number
   * @return this
   */
  async onStatus(
    status: HttpStatus,
    callable: Callable,
  ): Promise<HttpResponseDto<T>> {
    if (this.status() === status) {
      await callable(this._axiosResponse);
    }
    return this;
  }

  /**
   * Determine if the response code was 200 "OK" response.
   *
   * @returns boolean
   */
  ok(): boolean {
    return this.status() === HttpStatus.OK;
  }

  /**
   * Determine if the response code was 201 "Created" response.
   *
   * @returns boolean
   */
  created(): boolean {
    return this.status() === HttpStatus.CREATED;
  }

  /**
   * Determine if the response code was 202 "Accepted" response.
   *
   * @returns boolean
   */
  accepted(): boolean {
    return this.status() === HttpStatus.ACCEPTED;
  }

  /**
   * Determine if the response code was the given status code and the body has no content.
   *
   * @returns boolean
   */
  noContent() {
    return this.status() === HttpStatus.NO_CONTENT;
  }

  /**
   * Determine if the response code was a 301 "Moved Permanently".
   *
   * @returns boolean
   */
  movedPermanently(): boolean {
    return this.status() === HttpStatus.MOVED_PERMANENTLY;
  }

  /**
   * Determine if the response code was a 302 "Found" response.
   *
   * @returns boolean
   */
  found(): boolean {
    return this.status() === HttpStatus.FOUND;
  }

  /**
   * Determine if the response was a 400 "Bad Request" response.
   *
   * @returns boolean
   */
  badRequest(): boolean {
    return this.status() === HttpStatus.BAD_REQUEST;
  }

  /**
   * Determine if the response was a 401 "Unauthorized" response.
   *
   * @returns boolean
   */
  unauthorized(): boolean {
    return this.status() === HttpStatus.UNAUTHORIZED;
  }

  /**
   * Determine if the response was a 402 "Payment Required" response.
   *
   * @returns boolean
   */
  paymentRequired(): boolean {
    return this.status() === HttpStatus.PAYMENT_REQUIRED;
  }

  /**
   * Determine if the response was a 403 "Forbidden" response.
   *
   * @returns boolean
   */
  forbidden(): boolean {
    return this.status() === HttpStatus.FORBIDDEN;
  }

  /**
   * Determine if the response was a 404 "Not Found" response.
   *
   * @returns boolean
   */
  notFound(): boolean {
    return this.status() === HttpStatus.NOT_FOUND;
  }

  /**
   * Determine if the response was a 408 "Request Timeout" response.
   *
   * @returns boolean
   */
  requestTimeout(): boolean {
    return this.status() === HttpStatus.REQUEST_TIMEOUT;
  }

  /**
   * Determine if the response was a 409 "Conflict" response.
   *
   * @returns boolean
   */
  conflict(): boolean {
    return this.status() === HttpStatus.CONFLICT;
  }

  /**
   * Determine if the response was a 422 "Unprocessable Entity" response.
   *
   * @returns boolean
   */
  unprocessableEntity(): boolean {
    return this.status() === HttpStatus.UNPROCESSABLE_ENTITY;
  }

  /**
   * Determine if the response was a 429 "Too Many Requests" response.
   *
   * @returns boolean
   */
  tooManyRequests(): boolean {
    return this.status() === HttpStatus.TOO_MANY_REQUESTS;
  }
}
