import { FileService } from '../services/file.service';
import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { UserEntity } from '../../user/entities/user.entity';
import { User } from '../../auth/decorators';
import { FileEntity } from '../entities/file.entity';
import { InTransaction } from '../../../utils';

@Resolver()
export class FileMutationResolver {
  constructor(private readonly fileService: FileService) {}

  @Mutation(() => [FileEntity])
  @InTransaction()
  async upload(
    @User() user: UserEntity,
    @Args({ name: 'files', type: () => [GraphQLUpload] })
    files: FileUpload[],
  ): Promise<FileEntity[]> {
    return await this.fileService.upload(files, user);
  }
}
