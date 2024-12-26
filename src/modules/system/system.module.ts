import { Module } from '@nestjs/common';
import { SystemService } from './services/system.service';
import { SystemQueryResolver } from './resolvers/system.query.resovler';

@Module({
  providers: [SystemService, SystemQueryResolver],
})
export class SystemModule {}
