import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { UserRegisterDTO } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginInfo, LoginInfoDocument } from './entities/auth.entity';
import { comparePasswords, hashPassword } from 'src/helpers/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(LoginInfo.name)
    private loginInfoModel: Model<LoginInfoDocument>,
    private userInfoService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  private async generateRefreshToken(existingUser: any) {
    const oldRefToken = existingUser.strRefresh_token;
    if (!oldRefToken) {
      throw new InternalServerErrorException(
        'Refresh token not found in the existing user.',
      );
    }

    try {
      const decodedRefToken: any = this.jwtService.decode(oldRefToken);

      if (!decodedRefToken) {
        throw new InternalServerErrorException(
          'Invalid refresh token in the decoded token.',
        );
      }

      const { email, role, name } = decodedRefToken;

      const payload = {
        email,
        role,
        name,
      };

      const refreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: '30d',
      });
      await this.loginInfoModel.updateOne(
        { _id: existingUser._id },
        { $set: { strRefresh_token: refreshToken } },
      );

      const decodedToken = this.jwtService.decode(refreshToken) as {
        exp: number;
      };
      const expiresInSeconds = decodedToken.exp;
      const expiresIn = new Date(expiresInSeconds * 1000);

      return { refreshToken, expiresIn };
    } catch (error) {
      throw error;
    }
  }

  private async generateAccessToken(existingUser: any) {
    const oldRefToken = existingUser.strRefresh_token;
    if (!oldRefToken) {
      throw new InternalServerErrorException(
        'Refresh token not found to generate Access token',
      );
    }

    try {
      const decodedRefToken: any = this.jwtService.decode(oldRefToken);

      if (!decodedRefToken) {
        throw new InternalServerErrorException(
          'Invalid refresh token in the decoded token.',
        );
      }

      const { email, role, name } = decodedRefToken;

      const payload = {
        email,
        role,
        name,
      };

      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
      });
      await this.loginInfoModel.updateOne(
        { _id: existingUser._id },
        { $set: { strAccess_token: accessToken } },
      );
      const decodedToken = this.jwtService.decode(accessToken) as {
        exp: number;
      };
      const expiresInSeconds = decodedToken.exp;
      const expiresIn = new Date(expiresInSeconds * 1000);
      return { accessToken, expiresIn };
    } catch (error) {
      console.error('Error generating access token:', error);
      throw error;
    }
  }

  credentialType(identifier: string) {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const isPhoneNumber = /^\d+$/.test(identifier);

    if (isEmail) {
      return 'email';
    } else if (isPhoneNumber) {
      return 'phone';
    } else {
      return 'invalid';
    }
  }

  async create(createAuthDto: UserRegisterDTO) {
    try {
      if (
        !createAuthDto.strEmail ||
        !createAuthDto.strPassword ||
        !createAuthDto.strPhone
      ) {
        throw new UnauthorizedException('Invalid credentials!');
      }
      const isUserEmailExist = await this.userInfoService.findByEmail(
        createAuthDto.strEmail,
      );
      if (isUserEmailExist) {
        throw new UnauthorizedException('Email already exists!');
      }
      const isUserPhoneExist = await this.userInfoService.findByPhone(
        createAuthDto.strPhone,
      );
      if (isUserPhoneExist) {
        throw new UnauthorizedException('Phone already exists!');
      }
      const hashedPassword = await hashPassword(createAuthDto.strPassword);
      const user = await this.userInfoService.create({
        strUserName: createAuthDto.strUserName,
        strFirstName: createAuthDto.strFirstName,
        strLastName: createAuthDto.strLastName,
        strPhone: createAuthDto.strPhone,
        strEmail: createAuthDto.strEmail,
        strPassword: hashedPassword,
        strImageURL: createAuthDto.strImageURL,
      });
      if (!user) {
        throw new UnauthorizedException('Failed to create user!');
      }
      const expiresIn = '30d';
      const payload = {
        email: user.strEmail,
        name: `${user.strFirstName} ${user.strLastName}`,
      };
      const refreshToken = await this.jwtService.signAsync(payload, {
        expiresIn,
      });
      const newUser = await this.loginInfoModel.create({
        strUserId: user._id,
        strEmail: user.strEmail,
        strPhone: user.strPhone,
        strPassword: hashedPassword,
        intOtp: Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000,
        strAccess_token: '',
        strRefresh_token: refreshToken,
        dteLastLogin: new Date(),
      });
      return {
        strEmail: user.strEmail,
        strPhone: user.strPhone,
        strAccess_token: newUser.strAccess_token,
        strRefresh_token: newUser.strRefresh_token,
        name: `${user.strFirstName} ${user.strLastName}`,
      };
    } catch (error) {
      throw error;
    }
  }

  async comparePasswords(plainPassword: string, hashedPassword: string) {
    if (!plainPassword || !hashedPassword) {
      throw new Error('Both password and hash are required.');
    }
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  }

  async login(strEmailOrPhone: string, strPassword: string) {
    try {
      if (!strEmailOrPhone || !strPassword) {
        throw new UnauthorizedException('Email or password is required');
      }
      let user: any;
      let isEmailLogin = false;
      if (strEmailOrPhone.includes('@')) {
        isEmailLogin = true;
        user = await this.userInfoService.findByEmail(strEmailOrPhone);
      } else {
        user = await this.userInfoService.findByPhone(strEmailOrPhone);
      }
      if (!user) {
        throw new UnauthorizedException(
          'user not found with this email or phone!',
        );
      }
      const passwordMatched = await comparePasswords(
        strPassword,
        user.strPassword,
      );
      if (!passwordMatched) {
        throw new UnauthorizedException('invalid password!');
      }
      const existingUser = await this.loginInfoModel
        .findOne({
          $or: [
            { strEmail: isEmailLogin ? strEmailOrPhone : null },
            { strPhone: !isEmailLogin ? strEmailOrPhone : null },
          ],
        })
        .exec();
      if (!existingUser) {
        throw new InternalServerErrorException(
          'User data not found in the login repository.',
        );
      }
      const refreshToken = await this.generateRefreshToken(existingUser);
      const accessToken = await this.generateAccessToken(existingUser);
      return {
        userId: user._id,
        name: `${user.strFirstName} ${user.strLastName}`,
        email: user.strEmail,
        phone: user.strPhone,
        accessToken: accessToken.accessToken,
        access_token_expiresIn: accessToken.expiresIn,
        refreshToken: refreshToken.refreshToken,
        refresh_token_expiresIn: refreshToken.expiresIn,
      };
    } catch (error) {
      throw error;
    }
  }

  async logout(credential: string) {
    try {
      const credType = await this.credentialType(credential);
      if (credType === 'email' || credType === 'phone') {
        const userField = credType === 'email' ? 'strEmail' : 'strPhone';
        const existingUser = await this.loginInfoModel.findOne({
          [userField]: credential,
        });
        if (!existingUser) {
          throw new UnauthorizedException('User not found');
        }
        await this.loginInfoModel.updateOne(
          { _id: existingUser._id },
          { $set: { strAccess_token: '' } },
        );
        return { message: 'Logged out successfully' };
      } else {
        throw new UnauthorizedException('Invalid credential');
      }
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
