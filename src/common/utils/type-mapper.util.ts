import { ColumnMetadata } from "../interfaces/metadata.interface";
import { StringUtil } from "./string.util";

export class TypeMapperUtil {

  static mapSqlTypeToTsType(sqlType: string, name: string = ''): string {
    switch (sqlType.toLowerCase()) {
      // Numeric Types
      case 'integer':
      case 'smallint':
      case 'bigint':
      case 'numeric':
      case 'decimal':
      case 'real':
      case 'double precision':
        return 'number';

      // Text Types
      case 'character varying':
      case 'varchar':
      case 'text':
      case 'char':
      case 'uuid':
        return 'string';

      // Boolean Type
      case 'boolean':
        return 'boolean';

      // Date and Time Types
      case 'date':
      case 'time':
      case 'timestamp':
      case 'timestamp with time zone':
      case 'timestamp without time zone':
        return 'Date';

      case 'user-defined':
        return `${StringUtil.toClaseName(name)}`

      default:
        return 'any';
    }
  }

  
  static mapSqlNullableToOptional(sqlNullable: string): string {
    switch (sqlNullable.toLowerCase()) {
      case 'yes':
        return '@IsOptional()';
      default:
        return '';
    }
  }

  static mapSqlTypeToTsValidation(sqlType: string, name: string = ''): string {
    switch (sqlType.toLowerCase()) {
      // Integer Types
      case 'integer':
      case 'smallint':
      case 'bigint':
        return '@IsInt()';
  
      // Decimal or floating-point types
      case 'numeric':
      case 'decimal':
      case 'real':
      case 'double precision':
        return '@IsNumber()';
  
      // Text Types
      case 'character varying':
      case 'varchar':
      case 'text':
      case 'char':
      case 'uuid':
        return '@IsString()';
  
      // Boolean Type
      case 'boolean':
        return '@IsBoolean()';
  
      // Date and Time Types
      case 'date':
      case 'time':
      case 'timestamp':
      case 'timestamp with time zone':
        return '@IsDate()';

      case 'user-defined':
        return `@IsEnum(${StringUtil.toClaseName(name)})`
  
      default:
        return '';
    }
    
  }


  // Homologación de tipo SQL a tipo TypeORM
  static mapSqlTypeToOrmType (sqlType: string): string {
    switch (sqlType.toLowerCase()) {
      case 'integer':
      case 'smallint':
      case 'bigint':
        return 'int';
      case 'numeric':
      case 'decimal':
        return 'decimal';
      case 'real':
      case 'double precision':
        return 'float';
      case 'character varying':
      case 'varchar':
      case 'text':
      case 'char':
        return 'varchar';
      case 'uuid':
        return 'uuid';
      case 'boolean':
        return 'bool';
      case 'date':
        return 'date';
      case 'time':
        return 'time';
      case 'timestamp':
      case 'timestamp with time zone':
      case 'timestamp without time zone':
        return 'timestamp';
      case 'user-defined':
        return `enum`
      default:
        return 'any';
    }
  }

  static buildOrmColumnDecorator(column: ColumnMetadata): string {

    const typeOrmDecorators = [];

    if (column.pk) {
      const primaryDecorator = column.type === 'uuid'
        ? `@PrimaryGeneratedColumn('uuid')`
        : `@PrimaryGeneratedColumn()`;
      typeOrmDecorators.push(primaryDecorator);
      return typeOrmDecorators.join('\n  ');
    }

    const ormType = TypeMapperUtil.mapSqlTypeToOrmType(column.type);
    let columnDecorator = `@Column({ name: '${column.name}', type: '${ormType}'`;

    if(column.type.toLocaleLowerCase()==='user-defined'){
      columnDecorator += `, enum: ${StringUtil.toClaseName(column.name)}`;
    }
    
    if(column.unique){
      columnDecorator += `, unique: true`;
    }

    if(column.length){
      columnDecorator += `, length: ${column.length}`;
    }

    columnDecorator += ' })';
    typeOrmDecorators.push(columnDecorator);


    return typeOrmDecorators.join('\n  ');
  }
}
