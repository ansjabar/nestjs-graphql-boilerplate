import { IProcessor, FileProcessorArgsType } from '../@types/file.type';
import { FileService } from '../services/file.service';

export abstract class AProcessor implements IProcessor {
  constructor(protected readonly fileService: FileService) {}

  abstract isProcessable(
    args: FileProcessorArgsType,
  ): boolean | Promise<boolean>;

  abstract process(args: FileProcessorArgsType): object | Promise<object>;
}
