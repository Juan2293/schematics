import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';

export function addModuleToAppImports(moduleName: string, importPathModule: string, basePath: string): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const appModulePath = `${basePath}/app.module.ts`;

    // Verifica que el archivo app.module.ts existe
    const buffer = tree.read(appModulePath);
    if (!buffer) {
      _context.logger.warn(`No se encontró el app.module.ts, Importar manualmente`)
      return;
    }

    // Lee y parsea el contenido del archivo app.module.ts
    const content = buffer.toString('utf-8');
    // const sourceFile = ts.createSourceFile(appModulePath, content, ts.ScriptTarget.Latest, true);

    // Chequea si el módulo ya está importado para evitar duplicación
    if (content.includes(`import { ${moduleName} }`)) {
      return tree;
    }

    // Inserta el nuevo import al inicio del archivo
    const newImport = `import { ${moduleName} } from '${importPathModule}';\n`;
    let updatedContent = newImport + content;

    // Busca la posición del arreglo de imports en el archivo
    const importsRegex = /imports\s*:\s*\[([\s\S]*?)\]/;
    const match = importsRegex.exec(updatedContent);

    if (match) {
      const importsStart = match.index + match[0].indexOf('[') + 1;
      updatedContent = [
        updatedContent.slice(0, importsStart),
        ` ${moduleName},`,
        updatedContent.slice(importsStart),
      ].join('');
    } else {
      _context.logger.warn(`No se encontró la sección de imports en app.module.ts`)
      return
    }

    // Sobreescribe app.module.ts con el contenido actualizado
    tree.overwrite(appModulePath, updatedContent);

    return tree;
  };
}