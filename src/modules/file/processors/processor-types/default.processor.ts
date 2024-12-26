import { AProcessor } from '../a.processor';

export class DefaultProcessor extends AProcessor {
  isProcessable(): boolean | Promise<boolean> {
    return true;
  }
  process(): object | Promise<object> {
    return {};
  }
}
