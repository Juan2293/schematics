import { Rule, SchematicContext, Tree, apply, url, template, move, chain, mergeWith } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { QUERY_METADA_FROM_TABLE } from '../common/constants/postgres-queries';
import { ColumnMetadata } from '../common/interfaces/metadata.interface';
import { PostgresService } from '../config/postgres.config';
import { addModuleToAppImports, addNodeDependency,createGenericService } from '../common/rules/index';
import {  StringUtil as stringUtil } from '../common/utils/index';
import { createDTO, createEntity } from '../common/functions/index';


export function crud(options: any): Rule {

  return async (tree: Tree, context: SchematicContext) => {

    options.name = stringUtil.replaceUnderscoresWithHyphens(options.table);

    context.logger.info("Starting schematics CRUD");

    const metadata: ColumnMetadata[] = await PostgresService.executeQuery<ColumnMetadata>(QUERY_METADA_FROM_TABLE, [options.table]);

    const className = stringUtil.toClaseName(options.table);
    const pathFileName = stringUtil.replaceUnderscoresWithHyphens(options.name);

    const entity = createEntity(metadata, className);
    const dtoContent = createDTO(metadata, `Create${className}`);


    tree.create(`src/${pathFileName}/dto/create-${pathFileName}.dto.ts`, dtoContent);
    tree.create(`src/${pathFileName}/entities/${pathFileName}.entity.ts`, entity);


    const templateSource = apply(url('./files'), [
      template({
        ...options,
        ...strings,
      }),
      move(`./src/${pathFileName}`),
    ]);

    return chain([
      mergeWith(templateSource),
      createGenericService(options),
      addNodeDependency({
        "uuid": "^10.0.0",
        "class-transformer": "^0.5.1",
        "class-validator": "^0.14.1",
        "typeorm": "^0.3.7",
        "@nestjs/mapped-types": "*",
        "@nestjs/typeorm": "^10.0.2"
      }),
      addModuleToAppImports(
        `${stringUtil.toClaseName(options.table)}Module`,
        `src/${pathFileName}/${pathFileName}.module`)
    ]);
  };

}
