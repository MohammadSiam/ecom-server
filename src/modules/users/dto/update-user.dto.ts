import { PartialType } from '@nestjs/mapped-types';
import { CreateUserInfoDTO } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserInfoDTO) {}
