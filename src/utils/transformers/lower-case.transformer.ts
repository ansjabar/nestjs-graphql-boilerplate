import { PipeTransform, Injectable } from '@nestjs/common';
import { toLowerCase } from '../../common/helpers';

@Injectable()
export class LowerCasePipe implements PipeTransform {
  constructor(private readonly props: string[]) {}

  transform(value: any) {
    this.props.forEach((p) => {
      if (value[p]) value[p] = toLowerCase(value[p]);
    });

    return value;
  }
}
