import { ColumnMetadata } from "../interfaces/metadata.interface";
import { TypeMapperUtil as mapUtil, StringUtil as stringUtil } from "../utils/index";
import { strings } from '@angular-devkit/core';


export function createDTO(metadata: ColumnMetadata[], nameDTO: string, entityFile:string = '') {

  let dtoContent = `export class ${nameDTO}Dto {\n\n`;
  let importElements = new Set<string>();
  let importEnums = new Set<string>();
  metadata.forEach((column: ColumnMetadata) => {
    if (!column.pk) {
      const columnName = stringUtil.toAttributeName(column.name);
      const columnType = mapUtil.mapSqlTypeToTsType(column.type, column.name);
      const columnValidation = mapUtil.mapSqlTypeToTsValidation(column.type, column.name);
      const columnMandatory = mapUtil.mapSqlNullableToOptional(column.nullable)

      if (columnValidation && columnValidation.trim() !== '') {
        importElements.add(stringUtil.extractDecoratorName(columnValidation));
      }

      if (columnMandatory && columnMandatory.trim() !== '') {
        importElements.add(stringUtil.extractDecoratorName(columnMandatory));
      }

      if (column.type.toLocaleLowerCase() === 'user-defined') {
        importEnums.add(columnType);
      }

      if (columnMandatory)
        dtoContent += `  ${columnMandatory}\n`;

      if (columnValidation)
        dtoContent += `  ${columnValidation}\n`;

      dtoContent += `  ${columnName}: ${columnType};\n\n`;
    }
  });

  const impValidatorElements = [...importElements].join(',');
  let imports = `import { ${impValidatorElements} } from 'class-validator';`;

  if(importEnums.size > 0 ){
    const impEnumElements = [...importEnums].join(',');
    imports += `\nimport { ${impEnumElements} } from '../entities/${entityFile}.entity';`;
  }


  dtoContent += `\n}`;

  return `${imports}
  
  ${dtoContent}`;
}


export function createEntity(metadata: ColumnMetadata[], nameEntity: string) {
  let dtoContent = `
  @Entity({ name: '${metadata[0].table}' })
  export class ${strings.classify(nameEntity)} {\n\n`;

  let importElements = new Set<string>(['Entity']);

  let enumsBlock = ``;
  const generatedEnums = new Set<string>();

  metadata.forEach((column: ColumnMetadata) => {
    const columnName = stringUtil.toAttributeName(column.name);
    const columnType = mapUtil.mapSqlTypeToTsType(column.type, column.name);
    const columnDecorator = mapUtil.buildOrmColumnDecorator(column);


    if (column.type.toLocaleLowerCase() === 'user-defined') {
      const enumName = stringUtil.toClaseName(column.name);

      // Verifica si ya fue generado
      if (!generatedEnums.has(enumName)) {
        generatedEnums.add(enumName);
        enumsBlock += generateEnumBlock(enumName, column.enum_values);
      }
    }

    importElements.add(stringUtil.extractDecoratorName(columnDecorator));

    dtoContent += `  ${columnDecorator}\n`;
    dtoContent += `  ${columnName}: ${columnType};\n\n`;
  });

  //validar que se ponga cunado tenga el ID
  importElements.add("PrimaryGeneratedColumn");

  const impValidatorElements = [...importElements].join(',');

  const importValidator = `import { ${impValidatorElements}  } from 'typeorm';`;

  dtoContent += `\n}`;

  return `${importValidator}
             ${enumsBlock}
             ${dtoContent}
             `;
}


function generateEnumBlock(enumName: string, enumValues: string): string {

  const sanitizedValues = enumValues
    .split(', ')
    .map((value: string) => value.trim())
    .map((value: string) => `${stringUtil.sanitizeEnumKey(value)} = '${value}'`);

  return `\nexport enum ${enumName} {\n  ${sanitizedValues.join(',\n  ')}\n}\n`;
}