import { ColumnMetadata } from "../interfaces/metadata.interface";
import { TypeMapperUtil as mapUtil, StringUtil as stringUtil } from "../utils/index";
import { strings } from '@angular-devkit/core';


export function createDTO(metadata: ColumnMetadata[], nameDTO: string) {

  let dtoContent = `export class ${nameDTO}Dto {\n\n`;
  let importElements = new Set<string>();
  metadata.forEach((column: ColumnMetadata) => {
    if (!column.pk) {
      const columnName = stringUtil.toAttributeName(column.name);
      const columnType = mapUtil.mapSqlTypeToTsType(column.type);
      const columnValidation = mapUtil.mapSqlTypeToTsValidation(column.type);
      const columnMandatory = mapUtil.mapSqlNullableToOptional(column.nullable)
      importElements.add(stringUtil.extractDecoratorName(columnValidation));

      if(columnMandatory!=='')
        importElements.add(stringUtil.extractDecoratorName(columnMandatory));

      dtoContent += `  ${columnMandatory}\n`;
      dtoContent += `  ${columnValidation}\n`;
      dtoContent += `  ${columnName}: ${columnType};\n\n`;
    }
  });

  const impValidatorElements = [...importElements].join(',');

  const importValidator = `import { ${impValidatorElements} } from 'class-validator'`;


  dtoContent += `\n}`;

  return `${importValidator}
  
  ${dtoContent}`;
}


export function createEntity(metadata: ColumnMetadata[], nameEntity: string) {
  let dtoContent = `
  @Entity({ name: '${metadata[0].table}' })
  export class ${strings.classify(nameEntity)} {\n`;

  let importElements = new Set<string>(['Entity']);

  metadata.forEach((column: ColumnMetadata) => {
    const columnName = stringUtil.toAttributeName(column.name);
    const columnType = mapUtil.mapSqlTypeToTsType(column.type);
    const columnDecorator = mapUtil.buildOrmColumnDecorator(column);

    importElements.add(stringUtil.extractDecoratorName(columnDecorator));

    dtoContent += `  ${columnDecorator}\n`;
    dtoContent += `  ${columnName}: ${columnType};\n`;
  });

  //validar que se ponga cunado tenga el ID
  importElements.add("PrimaryGeneratedColumn");

  const impValidatorElements = [...importElements].join(',');

  const importValidator = `import { ${impValidatorElements}  } from 'typeorm';`;

  dtoContent += `\n}`;

  return `${importValidator}
  
             ${dtoContent}`;
}