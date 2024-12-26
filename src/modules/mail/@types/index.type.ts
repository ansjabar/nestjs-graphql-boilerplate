export enum MailTypes {
  USER_WELCOME = 'USER_WELCOME',
  PASSWORD_FORGOT = 'PASSWORD_FORGOT',
  ACCOUNT_VERIFICATION = 'ACCOUNT_VERIFICATION',
}

export type MailCacheType = {
  createdAt: number;
};

export type MailQueueType = {
  to: string;
  subject: string;
  template: string;
  context: { [k: string]: any };
};

export type ThrottleIdentifierType = {
  [k in string]: string | number;
};
