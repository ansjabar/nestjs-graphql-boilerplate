import { Injectable } from '@nestjs/common';
import { google, people_v1 } from 'googleapis';
import { HttpStatusException } from '../../../common/exceptions';
import { removeAfterLastOccurrenceInclusive } from '../../../common/helpers';
import { oauth2Client } from '../../../libs/google/clients';
import { SocialLoginProviders } from '../../user/@types/social.type';
import { GoogleLoginRequestDto, SocialUserDto } from '../dtos';
import { AAuth } from './a-auth';

@Injectable()
export class GoogleAuth extends AAuth {
  protected provider: SocialLoginProviders = SocialLoginProviders.GOOGLE;

  protected parseAvatarUrl(url: string): string {
    return removeAfterLastOccurrenceInclusive(url, '=');
  }
  protected async user(dto: GoogleLoginRequestDto): Promise<SocialUserDto> {
    let googleUser: people_v1.Schema$Person;
    if (dto.code) {
      googleUser = await this.googleUserFromCode(dto.code);
    } else {
      googleUser = await this.googleUserFromAccessToken(dto.token);
    }
    return this.extractProfile(googleUser);
  }

  async googleUserFromCode(code: string): Promise<people_v1.Schema$Person> {
    const client = oauth2Client(this.configs.googleAuthConfigs);
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);
    const people = google.people({ version: 'v1', auth: client });
    const me = await people.people.get({
      resourceName: 'people/me',
      personFields: 'names,emailAddresses,photos',
    });
    return me.data;
  }

  async googleUserFromAccessToken(
    accessToken: string,
  ): Promise<people_v1.Schema$Person> {
    const response = await this.httpService
      .withUrlParameters({
        personFields: 'emailAddresses,names',
      })
      .withToken(accessToken)
      .get<people_v1.Schema$Person>(
        'https://people.googleapis.com/v1/people/me',
      );
    if (response.ok()) {
      return response.data();
    }
    console.log(response.data());
    throw new HttpStatusException(response.errorMessage(), response.status());
  }

  private extractProfile(
    peopleResource: people_v1.Schema$Person,
  ): SocialUserDto {
    const name = peopleResource.names.find(
      (name) => name.metadata.primary,
    ).displayName;

    const email = peopleResource.emailAddresses.find(
      (emailAddress) => emailAddress.metadata.primary,
    ).value;

    const avatarUrl = peopleResource?.photos?.find(
      (photo) => photo.metadata.primary,
    ).url;

    return { name, email, avatarUrl };
  }
}
