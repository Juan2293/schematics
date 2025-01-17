import { DeepPartial, FindOptionsWhere } from "typeorm";
import { PaginationDto } from "../dtos/pagination.dto";


export interface IBaseService<TEntity, TDto> {

  findAll(
    paginationDto?: PaginationDto,
    where?: FindOptionsWhere<TEntity>[] | FindOptionsWhere<TEntity>,
    relations?: string[]
  );

  create(createEntityDto: TDto);

  findOne(term: string);

  findOneBy(
    where: FindOptionsWhere<TEntity> | FindOptionsWhere<TEntity>[],
    relations?: string[]
  ): Promise<TEntity>;

  update(id: string, updateEntityDto: DeepPartial<TEntity>);

  delete(id: string);
}