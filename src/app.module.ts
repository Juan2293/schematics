import { BrandModule } from 'src/brand/brand.module';
import { ProductModule } from 'src/product/product.module';

import { join } from 'path/posix'; //en Node


import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';


import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { EnvConfiguration } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validations';

@Module({
  imports: [ BrandModule, ProductModule, 

    ConfigModule.forRoot({
      load: [ EnvConfiguration],
      validationSchema: JoiValidationSchema
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public')
    }),
    MongooseModule.forRoot( process.env.MONGODB,{
      dbName: process.env.MONGODB_NAME
    } ),
    PokemonModule,
    CommonModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
