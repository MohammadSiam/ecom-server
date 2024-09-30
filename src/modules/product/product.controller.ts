import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';
import { SUCCESS } from 'src/helpers/httpCodes';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Get()
  async findAll(@Req() request: Request, @Res() response: Response) {
    try {
      const data: any = await this.productService.findAll();
      return response.status(SUCCESS).json(data);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching products');
    }
  }

  @Get('slug/:slug')
  async findBySlug(
    @Req() request: Request,
    @Res() response: Response,
    @Param('slug') slug: string,
  ) {
    try {
      const data: any = await this.productService.findProductBySlug(slug);
      return response.status(SUCCESS).json(data);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching products');
    }
  }

  @Get('category/:categoryName')
  async findByCategory(
    @Req() request: Request,
    @Res() response: Response,
    @Param('categoryName') categoryName: string,
  ) {
    try {
      const data: any =
        await this.productService.findProductByCategory(categoryName);
      return response.status(SUCCESS).json(data);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching products by category',
      );
    }
  }

  @Post('search')
  async search(
    @Req() request: Request,
    @Res() response: Response,
    @Body('productname') productname: string,
  ) {
    try {
      const data: any = await this.productService.searchProducts(productname);
      return response.status(SUCCESS).json(data);
    } catch (error) {
      throw new InternalServerErrorException('Error searching products');
    }
  }

  @Post('create')
  async create(
    @Req() request: Request,
    @Res() response: Response,
    @Body() createProductDto: CreateProductDto,
  ) {
    try {
      const data: any = await this.productService.create(createProductDto);
      return response.status(SUCCESS).json(data);
    } catch (error) {
      throw new InternalServerErrorException('Error creating product');
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
