import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../modules/user';
import {
  NotificationAddDto,
  NotificationFiltersDto,
  PaginationDto,
  RequiredUUIDDto,
} from '../dtos';
import { NotificationEntity } from '../entities/notification.entity';
import { NotificationRepository } from '../repositories/notification.repository';

@Injectable()
export class NotificationService {
  constructor(private readonly repository: NotificationRepository) {}

  /**
   * Returns a notification of the user
   *
   * @param {UserEntity} user
   * @param {RequiredUUIDDto} dto
   * @returns {Promise<NotificationEntity>}
   */
  async get(
    user: UserEntity,
    dto: RequiredUUIDDto,
  ): Promise<NotificationEntity> {
    return this.repository.get(dto, user);
  }

  /**
   * Returns all notifications of a user
   *
   * @param {UserEntity} user
   * @param {NotificationFiltersDto} filters
   * @param {PaginationDto} pagination
   * @returns {Promise<NotificationEntity[]>}
   */
  async all(
    user: UserEntity,
    filters: NotificationFiltersDto,
    pagination: PaginationDto,
  ): Promise<NotificationEntity[]> {
    return this.repository.all(user, filters, pagination);
  }

  /**
   * Mark notification as read
   *
   * @param {UserEntity} user
   * @param {RequiredUUIDDto} dto
   * @returns Promise<boolean>
   */
  async read(user: UserEntity, dto: RequiredUUIDDto): Promise<boolean> {
    this.repository.read(user, dto);
    return true;
  }

  /**
   * Add a new notification
   *
   * @param {NotificationEntity} entity
   * @returns {Promise<NotificationEntity>}
   */
  async add(dto: NotificationAddDto): Promise<NotificationEntity> {
    return this.repository.createAndSave(dto);
  }
}
