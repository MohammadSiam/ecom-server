import { PartialType } from '@nestjs/mapped-types';
import { UserRegisterDTO } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(UserRegisterDTO) {}
