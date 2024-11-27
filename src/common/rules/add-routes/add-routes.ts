import { Tree } from '@angular-devkit/schematics';


export function updateAppRoutes(tree: Tree, path: string, componentName: string, componentPath: string): Tree {
  let file = tree.read(path);

 
  if (!file) {
    console.log(`El archivo ${path} no existe. Creándolo...`);
    const defaultContent = `
    import { Routes } from '@angular/router';

    export const routes: Routes = [
      // Aquí se agregarán las rutas
    ];
    `;
    tree.create(path, defaultContent);
    file = tree.read(path); 
  }

  const sourceText = file!.toString('utf-8'); 

 
  const newRoute = `{ path: '${componentName.toLowerCase()}', loadComponent: () => import('${componentPath}').then(m => m.${componentName}Component) },`;
  const routesMarker = 'export const routes: Routes = [';
  const updatedSource = sourceText.replace(routesMarker, `${routesMarker}\n    ${newRoute}`);

  
  tree.overwrite(path, updatedSource);
  return tree;
}
