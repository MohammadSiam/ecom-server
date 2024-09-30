import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<Product>,
  ) { }
  async findAll() {
    try {
      const products = await this.productModel.find().exec();
      if (!products) {
        throw new InternalServerErrorException('Error fetching products');
      }
      return products;
    } catch (error) {
      throw new Error('Error fetching products');
    }
  }

  async findProductBySlug(slug: string) {
    try {
      const product = await this.productModel.findOne({ strSlug: slug }).exec();
      return product;
    } catch (error) {
      throw new Error('Error fetching product by slug');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  async findProductByCategory(category: string) {
    try {
      const products = await this.productModel
        .find({ strCategory: category })
        .exec();
      if (!products) {
        throw new InternalServerErrorException(
          'Error fetching products by category',
        );
      }
      return products;
    } catch (error) {
      throw new Error('Error fetching products by category');
    }
  }

  async searchProducts(name: string) {
    try {
      const info = this.productModel.find({
        strProductName: { $regex: `^${name}`, $options: 'i' },
      });
      return info;
    } catch (error) {
      throw new Error('Error searching products');
    }
  }

  async create(createProductDto: CreateProductDto) {
    try {
      const info = await this.productModel.create(createProductDto);
      if (!info) {
        throw new InternalServerErrorException('Error creating product');
      }
      return info;
    } catch (error) {
      throw new Error('Error creating product');
    }
  }
  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
