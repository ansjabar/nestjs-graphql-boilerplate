import * as sharp from 'sharp';
import { AProcessor } from '../a.processor';
import {
  ImageMetadataType,
  ThumbnailSizeType,
  FileProcessorArgsType,
  FileTypes,
} from '../../@types/file.type';
import * as path from 'path';
export class ImageProcessor extends AProcessor {
  private readonly thumbnailSizes: ThumbnailSizeType[] = [
    { height: 36, width: 36 },
    { height: 72, width: 72 },
  ];

  async isProcessable(args: FileProcessorArgsType): Promise<boolean> {
    try {
      if (!args.file.mimetype.startsWith('image')) return false;
      await sharp(args.buffer).metadata();
      return true;
    } catch (error) {
      return false;
    }
  }

  async process(args: FileProcessorArgsType): Promise<ImageMetadataType> {
    const { file, buffer, uploaderId } = args;

    const parsed = path.parse(file.filename);

    if (args.entity)
      await Promise.all(
        this.thumbnailSizes.map(async (size) => {
          const thumbnailBuffer = await sharp(buffer)
            .resize(size.width, size.height)
            .toBuffer();
          await this.fileService.uploadBuffer(
            thumbnailBuffer,
            {
              filename: `${parsed.name}_${size.width}x${size.height}.${parsed.ext}`,
              mimetype: file.mimetype,
            },
            uploaderId,
            args.entity,
            FileTypes.THUMBNAIL,
          );
        }),
      );
    const { width, height } = await sharp(buffer).metadata();
    return { width, height };
  }
}
