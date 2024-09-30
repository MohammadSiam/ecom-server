import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UserRegisterDTO } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { success } from 'src/helpers/http';
import { SUCCESS } from 'src/helpers/httpCodes';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Post('register')
  async create(
    @Req() request: Request,
    @Res() response: Response,
    @Body() createAuthDto: UserRegisterDTO,
  ) {
    try {
      const data: any = await this.authService.create(createAuthDto);
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  async loginUser(
    @Req() request: Request,
    @Res() response: Response,
    @Body('strEmailOrPhone') strEmailOrPhone: string,
    @Body('strPassword') strPassword: string,
  ) {
    try {
      const data: any = await this.authService.login(
        strEmailOrPhone,
        strPassword,
      );
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      throw error;
    }
  }

  @Post('logout')
  async logoutUser(
    @Res() response: Response,
    @Req() request: Request,
    @Body('credential') credential: string,
  ) {
    try {
      const data: any = await this.authService.logout(credential);
      return response.status(SUCCESS).json(data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
