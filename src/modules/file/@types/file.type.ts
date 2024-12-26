import { DriverType, StorageService } from '@codebrew/nestjs-storage';
import { AppConfigClass } from '../../../config/classes';
import { FileEntity } from '../entities/file.entity';
import { FileService } from '../services/file.service';
import { FilesColumns } from './tables.type';

export interface IProcessor {
  isProcessable(args: FileProcessorArgsType): boolean | Promise<boolean>;
  process(args: FileProcessorArgsType): object | Promise<object>;
}

export enum FileTypes {
  PROFILE_PICTURE = 'PROFILE_PICTURE',
  THUMBNAIL = 'THUMBNAIL',
}

export type ThumbnailSizeType = {
  height: number;
  width: number;
};

export type ImageMetadataType = {
  width: number;
  height: number;
};

export type FileArgumentsType = {
  storage: StorageService;
  file: Buffer;
  filePath: string;
};

export interface IDisk {
  upload(args: FileArgumentsType): Promise<void>;
  makeFileUrl(file: string, configs: AppConfigClass): Promise<string>;
}

export type AllowedDriverTypes = DriverType.LOCAL;

export type FileProcessorArgsType = {
  file: FileType;
  buffer: Buffer;
  uploaderId: number;
  entity?: FileEntity;
};

export type UpdateFileEntityType = Pick<
  FileEntity,
  FilesColumns.ENTITY | FilesColumns.ENTITY_ID | FilesColumns.USER_ID
> & {
  fileType: FileTypes;
};

export type QueryFileEntityType =
  | UpdateFileEntityType
  | { id: number }
  | Omit<UpdateFileEntityType, FilesColumns.USER_ID>;

export interface IFileAssigner {
  assign(
    entityIds: number[],
    entity: UpdateFileEntityType,
    fileService: FileService,
  ): Promise<void>;

  unAssign(entities: FileEntity[], storage: StorageService): Promise<void>;

  verifyMimeType(mimeType: string): void;
}

export type FileType = {
  filename: string;
  mimetype: string;
};

export type AssignerType = {
  entity: string;
  entityId: number;
  fileType: FileTypes;
  userId: number;
};

export type AssignSingleType = {
  newFileId: number | null;
  oldFileId: number | null;
} & AssignerType;

export type AssignMultipleType = {
  newFileIds: number[];
} & AssignerType;

export type UnAssignSingleType = {
  fileId: number;
} & AssignerType;

export type UnAssignMultipleType = {
  fileIds: number[];
} & AssignerType;
