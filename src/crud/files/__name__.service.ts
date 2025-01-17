import {  Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../common/services/generic.service';
import { I<%= classify(name) %>Service } from './interfaces/<%= dasherize(name) %>.service.interface';
import { Create<%= classify(name) %>Dto } from './dtos/create-<%= dasherize(name) %>.dto';
import { <%= classify(name) %> } from './entities/<%= dasherize(name) %>.entity';

@Injectable()
export class <%= classify(name) %>Service extends BaseService<<%= classify(name) %>, Create<%= classify(name) %>Dto> implements I<%= classify(name) %>Service {

    constructor(
        @InjectRepository(<%= classify(name) %>)
        private readonly <%= camelize(name) %>Repository: Repository<<%= classify(name) %>>,
      ) {
        super(<%= camelize(name) %>Repository); 
      }
 
}