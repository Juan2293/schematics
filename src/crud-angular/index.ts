import { apply, chain, mergeWith, Rule, SchematicContext, Tree, template, url, strings, move } from '@angular-devkit/schematics';
import * as ts from 'typescript';
import { addNodeDependency } from '../common/rules';



// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function crudAngular(_options: any): Rule {
  return (_tree: Tree, _context: SchematicContext) => {

    const attributes = getAttributesFromClassOrInterface(_options.path, _tree);
    _options.cols = createColsArray(attributes);
    _options.name = "luchina";

    console.log(_options)

    const templateSource = apply(url('./files'), [
      template({
        ..._options,
        ...strings
      }),
      move(`./src/${_options.name}`),
    ]);

    return chain([
      mergeWith(templateSource),
      addNodeDependency({
        "primeng": "^17.18.11",
      })
    ]);
  };
}



function getAttributesFromClassOrInterface(filePath: string, tree: Tree): string[] {
  const fileContent = tree.read(filePath)?.toString('utf-8');
  if (!fileContent) {
    throw new Error(`No se pudo leer el archivo en ${filePath}`);
  }

  console.log(fileContent);

  const sourceFile = ts.createSourceFile(
    filePath,
    fileContent,
    ts.ScriptTarget.Latest,
    true
  );

  const attributes: string[] = [];

  ts.forEachChild(sourceFile, (node) => {
    if (ts.isInterfaceDeclaration(node) || ts.isClassDeclaration(node)) {
      node.members.forEach(member => {
        if (ts.isPropertySignature(member) || ts.isPropertyDeclaration(member)) {
          const propertyName = member.name?.getText();
          if (propertyName) {
            attributes.push(propertyName);
          }
        }
      });
    }
  });

  console.log("ATRIBUTES", attributes)

  return attributes;
}

function createColsArray(attributes: string[]): string {
  return `[
    ${attributes
      .map(attr => `{ field: '${attr}', header: '${capitalize(attr)}' }`)
      .join(',\n    ')}
  ]`;
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}