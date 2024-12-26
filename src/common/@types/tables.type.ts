export enum CommonModuleTables {
  LOCALES = 'locales',
  NOTIFICATIONS = 'notifications',
  USED_TOKENS = 'usedTokens',
}

export enum CommonColumns {
  ID = 'id',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  DELETED_AT = 'deletedAt',
}

export enum LocalesColumns {
  ID = CommonColumns.ID,
  NAME = 'name',
  TITLE = 'title',
  ACTIVE = 'active',
}

export enum UsedTokensColumns {
  ID = CommonColumns.ID,
  TOKEN = 'token',
  TYPE = 'type',
  EXPIRES_ON = 'expiresOn',
  CREATED_AT = CommonColumns.CREATED_AT,
}

export enum NotificationsColumns {
  ID = CommonColumns.ID,
  USER_ID = 'userId',
  TITLE = 'title',
  CONTENT = 'content',
  READ_AT = 'readAt',
  ENTITY = 'entity',
  ENTITY_ID = 'entityId',
  EXTERNAL_LINK = 'externalLink',
  CREATED_AT = CommonColumns.CREATED_AT,
}
