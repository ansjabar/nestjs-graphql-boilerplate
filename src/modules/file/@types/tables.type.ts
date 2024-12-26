import { CommonColumns } from '../../../common/@types';

export enum FileModuleTables {
  FILES = 'files',
}

export enum FilesColumns {
  ID = CommonColumns.ID,
  ENTITY = 'entity',
  ENTITY_ID = 'entityId',
  FILE_TYPE = 'fileType',
  FILE = 'file',
  NAME = 'name',
  MIME = 'mime',
  METADATA = 'metadata',
  SIZE = 'size',
  DISK = 'disk',
  USER_ID = 'userId',
  CREATED_AT = CommonColumns.CREATED_AT,
  UPDATED_AT = CommonColumns.UPDATED_AT,
  DELETED_AT = CommonColumns.DELETED_AT,
}
