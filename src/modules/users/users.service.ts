import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserInfoDTO } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserInfo, UserInfoDocument } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserInfo.name)
    private userInfoModel: Model<UserInfoDocument>,
  ) {}

  async findAll() {
    try {
      const userInfo = await this.userInfoModel.find().exec();

      if (!userInfo || userInfo.length === 0) {
        throw new NotFoundException('User not found');
      }

      return userInfo;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      // Use findById to search for a user by its MongoDB ObjectId
      const userInfo = await this.userInfoModel.findById(id).exec();

      // If no user is found, throw a NotFoundException
      if (!userInfo) {
        throw new NotFoundException('User not found');
      }

      return userInfo;
    } catch (error) {
      throw error; // Allow NestJS to handle the exception
    }
  }

  async findByEmail(strEmail: string) {
    try {
      const userInfo = await this.userInfoModel.findOne({ strEmail }).exec();
      return userInfo;
    } catch (error) {
      return error.response;
    }
  }

  async findByPhone(strPhone: string) {
    try {
      const userInfo = await this.userInfoModel.findOne({ strPhone }).exec();
      return userInfo;
    } catch (error) {
      return error.response;
    }
  }

  async findUserByRole(role: string) {
    try {
      const userInfo = await this.userInfoModel
        .find({ 'role.strRoleName': role })
        .exec();
      return userInfo;
    } catch (error) {
      throw error;
    }
  }

  async create(createUserDto: CreateUserInfoDTO) {
    try {
      const emailExists = await this.findByEmail(createUserDto.strEmail);
      if (emailExists) {
        throw new InternalServerErrorException('Email already exists');
      }
      const phoneExists = await this.findByPhone(createUserDto.strPhone);
      if (phoneExists) {
        throw new InternalServerErrorException('Phone already exists');
      }
      const userInfo = await this.userInfoModel.create(createUserDto);

      if (!userInfo) {
        throw new NotFoundException(
          'User could not be created. Please try again',
        );
      }

      return userInfo;
    } catch (error) {
      throw error;
    }
  }

  async updateUserInfo(intId: string, userInfoDTO: UpdateUserDto) {
    try {
      // Find the user by ID
      const userInfo = await this.userInfoModel.findById(intId).exec();
      if (!userInfo) throw new NotFoundException('User not found');

      // Update the user information
      const updatedUserInfo = await this.userInfoModel
        .findByIdAndUpdate(intId, userInfoDTO, { new: true })
        .exec();

      if (!updatedUserInfo)
        throw new NotFoundException('User cannot be updated. Please try again');

      return updatedUserInfo;
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(intId: string, strPassword: string) {
    try {
      // Find the user by ID
      const userInfo = await this.userInfoModel.findById(intId).exec();
      if (!userInfo) throw new NotFoundException('User not found');

      // Update the user's password
      const updatedPasswordInfo = await this.userInfoModel
        .findByIdAndUpdate(
          intId,
          { strPassword: strPassword },
          { new: true }, // Return the updated document
        )
        .exec();

      if (!updatedPasswordInfo)
        throw new NotFoundException(
          'Password cannot be updated. Please try again',
        );

      return updatedPasswordInfo;
    } catch (error) {
      throw error;
    }
  }

  async deleteUserInfo(intId: string) {
    try {
      // Find the user by ID
      const userInfo = await this.userInfoModel.findById(intId).exec();
      if (!userInfo) throw new NotFoundException('User not found');

      // Delete the user
      const deletedUserInfo = await this.userInfoModel
        .findByIdAndDelete(intId)
        .exec();
      if (!deletedUserInfo)
        throw new NotFoundException('User cannot be deleted. Please try again');

      return deletedUserInfo;
    } catch (error) {
      throw error;
    }
  }
}
