

import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { BaseEntity } from '../entities/generic.interface';
import { PaginationDto } from '../dtos/pagination.dto';
import { IBaseService } from '../interfaces/generic.service.interface';


@Injectable()
export class BaseService<TEntity extends BaseEntity, TDto> implements IBaseService<TEntity, TDto> {

  private readonly logger = new Logger('BaseService');

  constructor(
    private readonly entityRepository: Repository<TEntity>
  ) { }

  async create(createEntityDto: TDto) {
    try {
      const entity = this.entityRepository.create(createEntityDto as DeepPartial<TEntity>);
      await this.entityRepository.save(entity);
      return entity;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll(
    paginationDto?: PaginationDto,
    where: FindOptionsWhere<TEntity>[] | FindOptionsWhere<TEntity> = {},
    relations: string[] = []
  ) {

    const take = paginationDto?.take ?? 10;
    const skip = paginationDto?.skip ?? 0;

    return this.entityRepository.find({
      take: paginationDto ? take : undefined,
      skip: paginationDto ? skip : undefined,
      where: where,
      relations,
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

  async findOneBy(
    where: FindOptionsWhere<TEntity> | FindOptionsWhere<TEntity>[],
    relations: string[] = []
  ): Promise<TEntity> {

    const entity = await this.entityRepository.findOne({
      where,
      relations,
    });


    if (!entity) {
      const conditions = Array.isArray(where) ? JSON.stringify(where) : JSON.stringify([where]);
      throw new NotFoundException(`Entity not found with conditions: ${conditions}`);
    }

    return entity;
  }

  async update(id: string, updateEntityDto: DeepPartial<TEntity>) {

    const entity = await this.entityRepository.preload({
      id: id,
      ...updateEntityDto
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

  protected handleDBExceptions(error: any): never {

    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw error;
  }

}
