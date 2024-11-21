import { apply, chain, mergeWith, Rule, SchematicContext, Tree, template, url, strings, move } from '@angular-devkit/schematics';
import * as ts from 'typescript';
import { addNodeDependency, createGenericComponents } from '../common/rules';
import { StringUtil } from '../common/utils';
import { Attribute, ClassAttributes } from '../common/interfaces/create-generic.interface';

export function crudAngular(_options: any): Rule {
  return async (_tree: Tree, _context: SchematicContext) => {

    const classAttributes = getAttributesFromClassOrInterface(_options.path, _tree);
    _options.cols = createColsArray(classAttributes.attributes);
    _options.name = classAttributes.name;
    _options.path = StringUtil.toKebabCase(classAttributes.name);

    _options.fields = classAttributes.attributes.map(attribute => {
      return { label: StringUtil.toClaseName(attribute.name), type: getHtmlInputType(attribute.type), name: attribute.name }
    });
    
    const templateSource = apply(url('./files'), [
      template({
        ..._options,
        ...strings
      }),
      move(`./src/app/${StringUtil.toKebabCase(_options.name)}`),
    ]);

   // addRouteToRoutesArray(_tree, 'src/app/app.routes.ts', `{ path: ${_options.path}, component: ${_options.name}Component }`);
    // addRouteToRoutesArray(_tree, 'src/app/app.routes.ts', _options.path, `src/app/${_options.path}/_options.path.component`, `${_options.name}Component`);

 
    return chain([
      mergeWith(templateSource),
      createGenericComponents({
        options: _options,
        templatePath: '../common/files/angular-crud-generic/',
        targetPath: 'src/app/common/'
      }),
       addNodeDependency({
        "primeng": "^17.18.11",
      })
    ]);
  };
}



function getAttributesFromClassOrInterface(filePath: string, tree: Tree): ClassAttributes {
  const fileContent = tree.read(filePath)?.toString('utf-8');
  if (!fileContent) {
    throw new Error(`No se pudo leer el archivo en ${filePath}`);
  }

  const sourceFile = ts.createSourceFile(
    filePath,
    fileContent,
    ts.ScriptTarget.Latest,
    true
  );

  let className = '';
  const attributes: Attribute[] = [];

  ts.forEachChild(sourceFile, (node) => {
    if (ts.isInterfaceDeclaration(node) || ts.isClassDeclaration(node)) {
      className = node.name?.getText() || '';  //nombre de la clase o interfaz
      node.members.forEach(member => {
        if (ts.isPropertySignature(member) || ts.isPropertyDeclaration(member)) {
          const propertyName = member.name?.getText(); //nombre de la propiedad
          if (propertyName) {
            attributes.push({
              name: member.name?.getText(),
              type: member.type?.getText() ?? ''
            });
          }
        }
      });
    }
  });

  return { name: className, attributes: attributes };
}

function createColsArray(attributes: Attribute[]): string {
  return `[
    ${attributes
      .map(attr => `{ field: '${attr.name}', header: '${capitalize(attr.name)}' }`)
      .join(',\n    ')}
  ]`;
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getHtmlInputType(tsType: string): string {
  const typeMap: { [key: string]: string } = {
    string: "text",
    number: "number",
    boolean: "checkbox",
    date: "date",
    email: "email",
    password: "password",
    url: "url",
  };

  // Devolvemos el tipo HTML si existe en el mapa, si no, por defecto "text"
  return typeMap[tsType] || "text";
}
// export function addRouteToRoutesArray(
//   tree: Tree,
//   routesFilePath: string,
//   routePath: string,
//   componentPath: string,
//   componentName: string
// ): void {
//   // Lee el contenido del archivo de rutas
//   const buffer = tree.read(routesFilePath);
//   if (!buffer) throw new Error(`No se pudo leer el archivo: ${routesFilePath}`);

//   const sourceText = buffer.toString('utf-8');
//   const sourceFile:any = ts.createSourceFile(routesFilePath, sourceText, ts.ScriptTarget.Latest, true);

//   // 1. Insertar el import del componente
//   const importChange = insertImport(sourceFile, routesFilePath, componentName, componentPath);
//   if (importChange instanceof InsertChange) {
//     const recorder = tree.beginUpdate(routesFilePath);
//     recorder.insertLeft(importChange.pos, importChange.toAdd);
//     tree.commitUpdate(recorder);
//   }

//   // 2. Buscar el arreglo de rutas `routes` e insertar la nueva ruta
//   const routesArrayRegex = /export\s+const\s+routes\s*:\s*Routes\s*=\s*\[/;
//   const match = sourceText.match(routesArrayRegex);
//   if (match && match.index !== undefined) {
//     const insertPosition = match.index + match[0].length; // Posición después de '['
//     const newRoute = `\n  { path: '${routePath}', component: ${componentName} },`;

//     const recorder = tree.beginUpdate(routesFilePath);
//     recorder.insertLeft(insertPosition, newRoute);
//     tree.commitUpdate(recorder);
//   } else {
//     throw new Error("No se encontró el arreglo 'routes' en el archivo.");
//   }
// }

// function addRouteToRoutesArray(tree: Tree, filePath: string, route: string) {
//   const sourceFile = getSourceFile(tree, filePath);
//   const routesArray = findRoutesArray(sourceFile);
 
//   if (!routesArray) {
//     throw new SchematicsException(`No se encontró la declaración de 'routes' en ${filePath}`);
//   }
 
//   const position = routesArray.elements.end;
//   const change = new InsertChange(filePath, position, `,\n ${route}`);
//   const recorder = tree.beginUpdate(filePath);
//   recorder.insertLeft(change.pos, change.toAdd);
//   tree.commitUpdate(recorder);
// }
 
// function getSourceFile(tree: Tree, path: string): ts.SourceFile {
//   const buffer = tree.read(path);
//   if (!buffer) {
//     throw new SchematicsException(`No se pudo leer el archivo ${path}`);
//   }
//   const content = buffer.toString('utf-8');
//   return ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);
// }
 
// function findRoutesArray(sourceFile: ts.SourceFile): ts.ArrayLiteralExpression | null {
//   let routesArray: ts.ArrayLiteralExpression | null = null;
 
//   function visit(node: ts.Node) {
//     if (
//       ts.isVariableDeclaration(node) &&
//       node.name.getText() === 'routes' &&
//       ts.isArrayLiteralExpression(node.initializer!)
//     ) {
//       routesArray = node.initializer;
//     } else {
//       ts.forEachChild(node, visit);
//     }
//   }
 
//   ts.forEachChild(sourceFile, visit);
//   return routesArray;
// }