import { Body, Controller, Get, Param, Patch, Post, Delete, Query, Inject } from '@nestjs/common';
import { I<%= classify(name) %>Service } from './interfaces/<%= dasherize(name) %>.service.interface';
import {  Create<%= classify(name) %>Dto } from './dtos/create-<%= dasherize(name) %>.dto';
import {  Update<%= classify(name) %>Dto } from './dtos/update-<%= dasherize(name) %>.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('<%= dasherize(name) %>')
export class <%= classify(name) %>Controller {

    constructor(
        @Inject('I<%= classify(name) %>Service') private readonly <%= camelize(name) %>Service:I<%= classify(name) %>Service
    ){}

    @Get()
    getAll(@Query() paginationDto: PaginationDto){
        return this.<%= camelize(name) %>Service.findAll(paginationDto);
    }

    @Get(':id')
    getById(@Param('id') id: string ){
        return this.<%= camelize(name) %>Service.findOne(id);
    }

    @Post()
    create(@Body() create<%= classify(name) %>Dto: Create<%= classify(name) %>Dto){
        return this.<%= camelize(name) %>Service.create(create<%= classify(name) %>Dto);
    }

    @Patch(':id')
    update( 
        @Param('id') id: string,
        @Body() update<%= classify(name) %>Dto: Update<%= classify(name) %>Dto ){
        return this.<%= camelize(name) %>Service.update(id, update<%= classify(name) %>Dto);
    }

    @Delete(':id')
    delete( @Param('id') id: string ){
        this.<%= camelize(name) %>Service.delete(id);
    }

}