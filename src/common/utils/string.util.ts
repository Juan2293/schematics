export class StringUtil {

  static extractDecoratorName(decorator: string): string {
    const match = decorator.match(/@(\w+)\s*\(/);
    return match ? match[1] : '';
  }

  static toAttributeName(str: string) {
    str = str.toLocaleLowerCase();
    return str.replace(/_([a-z])/g, (_match, p1) => p1.toUpperCase());
  }

  static toClaseName(str: string): string {
    str = str.toLocaleLowerCase();
    return str.replace(/(_\w)/g, (match) => match.toUpperCase().replace('_', ''))
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

}