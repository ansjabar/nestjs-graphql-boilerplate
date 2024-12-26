import { AppConfigClass } from '../../../../config/classes';
import { ADisk } from '../a.disk';

export class LocalDisk extends ADisk {
  async makeFileUrl(file: string, configs: AppConfigClass): Promise<string> {
    return `${configs.appConfigs.url}${configs.appConfigs.staticFilesRoute}/${file}`;
  }
}
