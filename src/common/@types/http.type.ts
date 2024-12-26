import { AxiosResponse, Method, RawAxiosRequestHeaders } from 'axios';

export type HttpRequestType = {
  url: string;
  method: Method;
  data?: any;
  headers?: Record<string, string>;
};

export type Callable =
  | (<T = any>(response: AxiosResponse<T>) => Promise<void>)
  | (<T = any>(response: AxiosResponse<T>) => void);

declare const headersInstance: RawAxiosRequestHeaders;
export type ContentType = (typeof headersInstance)['Content-Type'];
export type SendCallback<R> = () => Promise<R>;
