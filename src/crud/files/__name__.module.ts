
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { <%= classify(name) %>Service } from './<%= dasherize(name) %>.service';
import { <%= classify(name) %>Controller } from './<%= dasherize(name) %>.controller';
import { <%= classify(name) %> } from './entities/<%= dasherize(name) %>.entity';

@Module({
  providers: [<%= classify(name) %>Service],
  controllers: [<%= classify(name) %>Controller],
  exports: [<%= classify(name) %>Service],
  imports:[ TypeOrmModule.forFeature([<%= classify(name) %>]) ]
})
export class <%= classify(name) %>Module {}