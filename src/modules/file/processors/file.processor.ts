import { ProcessorFactory } from './processor.factory';
import { FileProcessorArgsType } from '../@types/file.type';
import { FileService } from '../services/file.service';

export class FileProcessor {
  constructor(protected fileService: FileService) {}

  async process(args: FileProcessorArgsType): Promise<object> {
    const factory = await ProcessorFactory.make(args, this.fileService);

    return await factory.process(args);
  }
}
