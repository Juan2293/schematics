

import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { BaseEntity } from '../entities/generic.interface';
import { PaginationDto } from '../dtos/pagination.dto';


@Injectable()
export abstract class BaseService<TEntity extends BaseEntity, TDto> {

  private readonly logger = new Logger('BaseService');

  constructor(
    private readonly entityRepository: Repository<TEntity>
  ) { }

  async create(createProductDto: TDto) {
    try {
      const entity = this.entityRepository.create(createProductDto as DeepPartial<TEntity>);
      await this.entityRepository.save(entity);
      return entity;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll(
    paginationDto?: PaginationDto,
    where?: FindOptionsWhere<TEntity>[] | FindOptionsWhere<TEntity>,
    relations?: string[]
  ) {

    const take = paginationDto?.take ?? 10;
    const skip = paginationDto?.skip ?? 0;
  
    return this.entityRepository.find({
      take: paginationDto ? take : undefined,
      skip: paginationDto ? skip : undefined, 
      where: where || {}, 
      relations: relations || [], 
    });
  }

  async findOne(term: string) {
    const entity = await this.entityRepository.findOne({
      where: { id: term } as FindOptionsWhere<TEntity>,
    });

    if (!entity)
      throw new NotFoundException(`Entity with id ${term} not found`);

    return entity;
  }

  async findOneBy(terms: Record<string, any>): Promise<TEntity> {
    const entity = await this.entityRepository.findOne({
      where: terms as FindOptionsWhere<TEntity>,
    });

    if (!entity) {
      throw new NotFoundException(`Entity with terms ${JSON.stringify(terms)} not found`);
    }

    return entity;
  }

  async update(id: string, updateProductDto: DeepPartial<TEntity>) {

    const entity = await this.entityRepository.preload({
      id: id,
      ...updateProductDto
    });

    if (!entity) throw new NotFoundException(`T with id: ${id} not found`);

    try {
      await this.entityRepository.save(entity);
      return entity;
    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  async delete(id: string) {
    const entity = await this.findOne(id);
    await this.entityRepository.remove(entity);
  }

  private handleDBExceptions(error: any) {

    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

}
