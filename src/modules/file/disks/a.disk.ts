import { AppConfigClass } from '../../../config/classes';
import { IDisk, FileArgumentsType } from '../@types/file.type';

export abstract class ADisk implements IDisk {
  async upload(args: FileArgumentsType): Promise<void> {
    const { storage, filePath, file } = args;
    await storage.getDisk().put(filePath, file);
  }

  abstract makeFileUrl(file: string, configs: AppConfigClass): Promise<string>;
}
