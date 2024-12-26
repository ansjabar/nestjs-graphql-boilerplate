import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { FileRepository } from './repositories/file.repository';
import { FileMutationResolver } from './resolvers/file.mutation.resolver';
import { FileService } from './services/file.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  providers: [FileService, FileMutationResolver, FileRepository],
  exports: [FileService],
})
export class FileModule {}
