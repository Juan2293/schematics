
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { <%= classify(name) %>Service } from './<%= dasherize(name) %>.service';
import { <%= classify(name) %>Controller } from './<%= dasherize(name) %>.controller';
import { <%= classify(name) %> } from './entities/<%= dasherize(name) %>.entity';

@Module({
  providers: [{
    provide: 'I<%= classify(name) %>Service',
    useClass: <%= classify(name) %>Service
  }],
  controllers: [<%= classify(name) %>Controller],
  exports: ['I<%= classify(name) %>Service'],
  imports:[ TypeOrmModule.forFeature([<%= classify(name) %>]) ]
})
export class <%= classify(name) %>Module {}