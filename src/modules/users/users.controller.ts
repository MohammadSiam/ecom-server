import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserInfoDTO } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { success } from 'src/helpers/http';
import { SUCCESS } from 'src/helpers/httpCodes';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async findAll(@Req() request: Request, @Res() response: Response) {
    try {
      const data: any = await this.usersService.findAll();
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      throw error;
    }
  }

  @Get('email/:email')
  async findByEmail(
    @Req() request: Request,
    @Res() response: Response,
    @Param('email') email: string,
  ) {
    try {
      const data: any = await this.usersService.findByEmail(email);
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      throw error;
    }
  }

  @Get('role/:role')
  async findUserByRole(
    @Req() request: Request,
    @Res() response: Response,
    @Param('role') role: string,
  ) {
    try {
      const data: any = await this.usersService.findUserByRole(role);
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(
    @Req() request: Request,
    @Res() response: Response,
    @Param('id') id: string,
  ) {
    try {
      const data: any = await this.usersService.findOne(id);
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      throw error;
    }
  }

  @Post('create')
  async create(
    @Req() request: Request,
    @Res() response: Response,
    @Body() createUserDto: CreateUserInfoDTO,
  ) {
    try {
      const data: any = await this.usersService.create(createUserDto);
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      throw error;
    }
  }

  @Put('update/:id')
  async update(
    @Req() request: Request,
    @Res() response: Response,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const data: any = await this.usersService.updateUserInfo(
        id,
        updateUserDto,
      );
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      throw error;
    }
  }

  @Delete('delete/:id')
  async remove(
    @Req() request: Request,
    @Res() response: Response,
    @Param('id') id: string,
  ) {
    try {
      await this.usersService.deleteUserInfo(id);
      return response.status(SUCCESS).json(success({}, 1));
    } catch (error) {
      throw error;
    }
  }
}
