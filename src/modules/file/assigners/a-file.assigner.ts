import { StorageService } from '@codebrew/nestjs-storage';
import { ForbiddenException } from '@nestjs/common';
import { TranslationService } from '../../../common/services/translation.service';
import { IFileAssigner, UpdateFileEntityType } from '../@types/file.type';
import { FileEntity } from '../entities/file.entity';
import { FileService } from '../services/file.service';

export abstract class AFileAssigner implements IFileAssigner {
  constructor(
    protected readonly fileService: FileService,
    protected readonly translationService: TranslationService,
  ) {}

  async assign(
    entityIds: number[],
    entity: UpdateFileEntityType,
  ): Promise<void> {
    await this.fileService.update(entityIds, entity);
  }

  verify(dbEntity: FileEntity, entityToAssign: UpdateFileEntityType) {
    this.verifyMimeType(dbEntity.mime);
    this.verifyOwnership(entityToAssign.userId, dbEntity.userId);
    this.isAlreadyAssigned(dbEntity, entityToAssign);
  }

  abstract verifyMimeType(mimeType: string): void;

  verifyOwnership(ownerId: number, assignerId: number) {
    if (ownerId !== assignerId)
      throw new ForbiddenException(
        this.translationService.translate('errors.file.notOwnByYou'),
      );
  }

  private isAlreadyAssigned(
    dbEntity: UpdateFileEntityType,
    entityToAssign: UpdateFileEntityType,
  ) {
    if (
      (dbEntity.entity && dbEntity.entity !== entityToAssign.entity) ||
      (dbEntity.entityId && dbEntity.entityId !== entityToAssign.entityId) ||
      (dbEntity.fileType && dbEntity.fileType !== entityToAssign.fileType)
    )
      throw new ForbiddenException(
        this.translationService.translate('errors.file.alreadyAssigned', {
          entity: dbEntity.entity,
          type: dbEntity.fileType,
        }),
      );
  }

  async unAssign(
    entities: FileEntity[],
    storage: StorageService,
  ): Promise<void> {
    await Promise.all(
      entities.map(async (e) => {
        const children = await this.fileService.children(e);
        await this.unAssign(children, storage);

        const disk = storage.getDisk(e.disk);
        await disk.delete(e.file);
        await this.fileService.delete(e);
      }),
    );
  }
}
