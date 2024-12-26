import { IProcessor, FileProcessorArgsType } from '../@types/file.type';
import { FileService } from '../services/file.service';
import { DefaultProcessor } from './processor-types/default.processor';
import { ImageProcessor } from './processor-types/image.processor';

type SupportedProcessors = 'image';

type ProcessorsType = { [key in SupportedProcessors]: IProcessor };

export class ProcessorFactory {
  static async make(
    args: FileProcessorArgsType,
    fileService: FileService,
  ): Promise<IProcessor> {
    let processor: IProcessor;
    const processors = this.processors(fileService);

    for (const p in processors) {
      if (await processors[p].isProcessable(args)) {
        processor = processors[p];
        break;
      }
    }

    return processor || new DefaultProcessor(fileService);
  }

  private static processors(fileService: FileService): ProcessorsType {
    const processors: ProcessorsType = {
      image: new ImageProcessor(fileService),
    };
    return processors;
  }
}
