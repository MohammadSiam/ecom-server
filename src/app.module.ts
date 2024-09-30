import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import configService from './database/ormconfig.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    MongooseModule.forRoot(configService.getMongoConfig().uri, {
      dbName: configService.getMongoConfig().dbName,
      authMechanism: configService.getMongoConfig().authMechanism,
      user: configService.getMongoConfig().user,
      pass: configService.getMongoConfig().pass,
    }),
    AuthModule,
    UsersModule,
    ProductModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
