import { StorageService } from '@codebrew/nestjs-storage';
import { ConflictException, Injectable } from '@nestjs/common';
import { fromBuffer } from 'file-type';
import { FileUpload } from 'graphql-upload';
import { difference } from 'lodash';
import * as path from 'path';
import { In, IsNull } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { streamToBuffer } from '../../../common/helpers';
import { HttpService } from '../../../common/services/http.service';
import { TranslationService } from '../../../common/services/translation.service';
import { AppConfigClass } from '../../../config/classes';
import { UserEntity } from '../../user/entities/user.entity';
import {
  AssignerType,
  AssignMultipleType,
  AssignSingleType,
  FileType,
  FileTypes,
  QueryFileEntityType,
  UnAssignMultipleType,
  UnAssignSingleType,
  UpdateFileEntityType,
} from '../@types/file.type';
import { AssignerFactory } from '../assigners/assigner.factory';
import { ADisk } from '../disks/a.disk';
import { DiskFactory } from '../disks/disk.factory';
import { FileEntity } from '../entities/file.entity';
import { FileProcessor } from '../processors/file.processor';
import { FileRepository } from '../repositories/file.repository';

@Injectable()
export class FileService {
  disk: ADisk;

  private assignerFactory: AssignerFactory;
  private diskFactory: DiskFactory;

  constructor(
    private readonly repository: FileRepository,
    public readonly storage: StorageService,
    public readonly configs: AppConfigClass,
    private readonly httpService: HttpService,
    private readonly translationService: TranslationService,
  ) {
    this.assignerFactory = new AssignerFactory(this, translationService);
    this.diskFactory = new DiskFactory(translationService);
    this.disk = this.diskFactory.make(this.configs.storageConfigs.defaultDisk);
  }

  async upload(files: FileUpload[], user: UserEntity): Promise<FileEntity[]> {
    const response: FileEntity[] = [];
    for await (const file of files) {
      const buffer = await streamToBuffer(file.createReadStream());
      if (buffer.length === 0) continue;
      const entity = await this.uploadBuffer(buffer, file, user.id);

      const [entityWithChildren] = await this.entityFile({ id: entity.id });

      response.push(entityWithChildren);
    }

    return response;
  }

  async uploadFromUrl(url: string, user: UserEntity): Promise<FileEntity> {
    const response = await this.httpService.get(url, {
      responseType: 'arraybuffer',
    });
    const buffer = Buffer.from(response.data());
    const fileType = await fromBuffer(buffer);
    const file = {
      filename: `${uuidv4()}.${fileType.ext}`,
      mimetype: fileType.mime,
    };
    const entityWithChildren = await this.uploadBuffer(buffer, file, user.id);
    return entityWithChildren;
  }

  async uploadBuffer(
    buffer: Buffer,
    file: FileType,
    uploaderId: number,
    parentEntity?: FileEntity,
    childFileType?: FileTypes,
  ): Promise<FileEntity> {
    const filePath = this.getFileFilePath(String(uploaderId), file.filename);
    await this.disk.upload({ storage: this.storage, file: buffer, filePath });

    const entity = await this.repository.createAndSave({
      file: filePath,
      name: file.filename,
      userId: uploaderId,
      mime: file.mimetype,
      disk: this.configs.storageConfigs.defaultDisk,
      size: buffer.length,
      entity: parentEntity ? FileEntity.name : null,
      entityId: parentEntity ? parentEntity.id : null,
      fileType: parentEntity ? childFileType : null,
    });

    const metadata = await new FileProcessor(this).process({
      file,
      buffer,
      uploaderId,
      entity: parentEntity ? null : entity,
    });
    entity.metadata = JSON.stringify(metadata);
    await this.repository.save(entity);
    return entity;
  }

  private getFileFilePath(userDir: string, fileName: string) {
    return `${userDir}/${this.generateFileName(fileName)}`;
  }

  private generateFileName(fileName: string) {
    return `${uuidv4()}${path.parse(fileName).ext}`;
  }

  async update(ids: number[], entity: UpdateFileEntityType) {
    await this.repository.update(
      {
        id: In(ids),
        userId: entity.userId,
        entity: IsNull(),
        entityId: IsNull(),
        fileType: IsNull(),
      },
      entity,
    );
  }

  async delete(entity: FileEntity): Promise<void> {
    await this.repository.remove(entity);
  }

  async entityFile(entity: QueryFileEntityType): Promise<FileEntity[]> {
    const entities = await this.repository.findManyBy(entity);
    await Promise.all(
      entities.map(async (entity) => {
        entity.file = await this.fileUrl(entity);

        const children = await this.children(entity);
        entity.children = await Promise.all(
          children.map(async (child) => {
            child.file = await this.fileUrl(child);
            return child;
          }),
        );
      }),
    );

    return entities;
  }

  private async fileUrl(entity: FileEntity): Promise<string> {
    const disk = this.diskFactory.make(entity.disk);
    return await disk.makeFileUrl(entity.file, this.configs);
  }

  async assignFile(ids: number[], entityToAssign: UpdateFileEntityType) {
    const assigner = this.assignerFactory.make(entityToAssign.fileType);

    const entities = await this.repository.findManyBy({ id: In(ids) });

    if (entities.length !== ids.length) {
      const notFOundIds = difference(
        ids,
        entities.map((e) => e.id),
      ).join();
      throw new ConflictException(
        this.translationService.translate('errors.file.notFoundOnAssign', {
          ids: notFOundIds,
        }),
      );
    }

    entities.map((e) => {
      assigner.verify(e, entityToAssign);
    });

    await assigner.assign(ids, entityToAssign);
  }

  async unAssignFile(ids: number[], entityToAssign: UpdateFileEntityType) {
    const assigner = this.assignerFactory.make(entityToAssign.fileType);

    const entities = await this.repository.findManyBy({ id: In(ids) });

    entities.map((e) => {
      assigner.verifyOwnership(e.userId, entityToAssign.userId);
    });

    await assigner.unAssign(entities, this.storage);
  }

  async children(entity: FileEntity): Promise<FileEntity[]> {
    return await this.repository.children(entity);
  }

  async assignSingle(assign: AssignSingleType) {
    const data = this.prepareAssignData(assign);

    if (assign.newFileId) await this.assignFile([assign.newFileId], data);

    if (assign.oldFileId) await this.unAssignFile([assign.oldFileId], data);
  }

  async assignMultiple(assign: AssignMultipleType) {
    await this.assignFile(assign.newFileIds, this.prepareAssignData(assign));
  }

  async unassignSingle(unassign: UnAssignSingleType) {
    await this.unAssignFile(
      [unassign.fileId],
      this.prepareAssignData(unassign),
    );
  }

  async unassignMultiple(unassign: UnAssignMultipleType) {
    await this.unAssignFile(unassign.fileIds, this.prepareAssignData(unassign));
  }

  private prepareAssignData(assign: AssignerType) {
    return {
      entity: assign.entity,
      entityId: assign.entityId,
      fileType: assign.fileType,
      userId: assign.userId,
    };
  }
}
