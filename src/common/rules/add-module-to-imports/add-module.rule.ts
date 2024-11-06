import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';

export function addModuleToAppImports(moduleName: string, modulePath: string): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const appModulePath = 'src/app.module.ts';
    
    // Verifica que el archivo app.module.ts existe
    const buffer = tree.read(appModulePath);
    if (!buffer) {
      throw new Error('No se encontró app.module.ts');
    }

    // Lee y parsea el contenido del archivo app.module.ts
    const content = buffer.toString('utf-8');
    // const sourceFile = ts.createSourceFile(appModulePath, content, ts.ScriptTarget.Latest, true);
    
    // Chequea si el módulo ya está importado para evitar duplicación
    if (content.includes(`import { ${moduleName} }`)) {
      console.log(`El módulo ${moduleName} ya está importado en app.module.ts`);
      return tree;
    }

    // Inserta el nuevo import al inicio del archivo
    const newImport = `import { ${moduleName} } from '${modulePath}';\n`;
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
      throw new Error('No se encontró la sección de imports en app.module.ts');
    }

    // Sobreescribe app.module.ts con el contenido actualizado
    tree.overwrite(appModulePath, updatedContent);

    return tree;
  };
}