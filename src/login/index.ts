import { apply, chain, mergeWith, Rule, SchematicContext, Tree, template, url, strings, move } from '@angular-devkit/schematics';

import { addNodeDependency, createGenericComponents, updateAppRoutes } from '../common/rules';
import { StringUtil } from '../common/utils';



export function login(): Rule {
  return async (_tree: Tree, _context: SchematicContext) => {

  
   let _name:any = 'login'; //classAttributes.name;
    
    const templateSource = apply(url('./files'), [
      template({
        ..._name,
        ...strings
      }),
      move(`./src/app/${StringUtil.toKebabCase(_name)}`),
    ]);

   
    const routesPath = './src/app/app.routes.ts'; 
    const componentPath = `./${_name.toLowerCase()}/${_name.toLowerCase()}.component`;

    updateAppRoutes(_tree, routesPath, capitalizeFirstLetter(_name), componentPath);
    return chain([
      mergeWith(templateSource),
      createGenericComponents({
        options: _name,
        templatePath: '../common/files/angular-crud-generic/',
        targetPath: 'src/app/common/'
      }),
       addNodeDependency({
        "primeng": "^17.18.11",
      }),
      
    ]);
  };

  function capitalizeFirstLetter(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  
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