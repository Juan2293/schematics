export class StringUtil {

  static extractDecoratorName(decorator: string): string {
    const match = decorator.match(/@(\w+)\s*\(/);
    return match ? match[1] : '';
  }

  static toAttributeName(str: string) {
    str = str.toLocaleLowerCase();
    return str.replace(/_([a-z])/g, (_match, p1) => p1.toUpperCase());
  }

  //input: my_class-name output: MyClassName
  static toClaseName(str: string): string {
    str = str.toLocaleLowerCase();
    return str
    .replace(/([_-]\w)/g, (match) => match.toUpperCase().replace(/[_-]/, ''))
    .replace(/^./, str[0].toUpperCase());
  }

  static toPascalCase(str: string): string {
    return str.replace(/(\w)(\w*)/g, (_, c1, c2) => c1.toUpperCase() + c2.toLowerCase());
  }

  //input:text_interface  output: text-interface
  static replaceUnderscoresWithHyphens(str: string): string {
    const regex = /_+(?=\w)/g;
    return str.replace(regex, '-');
  }

  //input:ProductInterface  output: product-interface
  static toKebabCase(input: string): string {
    return input
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
      .toLowerCase(); 
  }

  static  sanitizeEnumKey(value: string): string {
    const accents = [
      { base: 'a', letters: /[áàâäÁÀÂÄ]/gi }, 
      { base: 'e', letters: /[éèêëÉÈÊË]/gi },
      { base: 'i', letters: /[íìîïÍÌÎÏ]/gi },
      { base: 'o', letters: /[óòôöÓÒÔÖ]/gi },
      { base: 'u', letters: /[úùûüÚÙÛÜ]/gi },
      { base: 'n', letters: /[ñÑ]/gi },
      { base: 'c', letters: /[çÇ]/gi },
    ];
  
    let cleanedValue = value;
  
    // Eliminar tildes
    accents.forEach(acc => {
      cleanedValue = cleanedValue.replace(acc.letters, acc.base);
    });
  
    // Convertir a mayúsculas
    cleanedValue = cleanedValue.toUpperCase();
  
    // Reemplazar espacios y caracteres no alfanuméricos por guiones bajos
    cleanedValue = cleanedValue.replace(/[^a-zA-Z0-9]/g, '_');
  
    // Eliminar guiones bajos extra al principio o al final
    cleanedValue = cleanedValue.replace(/^_+|_+$/g, '');
  
    return cleanedValue;
  }

}