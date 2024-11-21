import {
    Rule,
    Tree,
    SchematicContext
  } from '@angular-devkit/schematics';

  export function addGlobalPipesToMain(): Rule {
    return (tree: Tree, _context: SchematicContext) => {
      const mainPath = '/main.ts';
  
      if (!tree.exists(mainPath)) {
        _context.logger.warn(`Archivo ${mainPath} no encontrado, agregar en el main.ts
                app.useGlobalPipes(
                    new ValidationPipe({
                    whitelist: true,
                    forbidNonWhitelisted: true
                    }));
            `);
        return tree;
      }
  
      const mainFile = tree.read(mainPath);
      if (!mainFile) return tree;
  
      let fileContent = mainFile.toString('utf-8');
  
      // Verificar si `app.useGlobalPipes` ya existe
      if (fileContent.includes('app.useGlobalPipes')) {
        return tree;
      }
  
      // Verificar e insertar la importación si es necesario
      const importStatement = `import { Logger, ValidationPipe } from '@nestjs/common';`;
      const importNestCommonRegex = /import\s*{([^}]*)}\s*from\s*'@nestjs\/common';/;
      const validationPipeCode = `app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true
        })
      );\n`;
  
      if (importNestCommonRegex.test(fileContent)) {
        // Si ya existe una importación de `@nestjs/common`, verificar si incluye `ValidationPipe`
        fileContent = fileContent.replace(importNestCommonRegex, (_match, imports) => {
          const importSet = new Set(imports.split(',').map((imp:string) => imp.trim()));
          importSet.add('Logger');
          importSet.add('ValidationPipe');
          const updatedImports = Array.from(importSet).join(', ');
          return `import { ${updatedImports} } from '@nestjs/common';`;
        });
      } else {
        // Si no hay importación de `@nestjs/common`, agregar la línea completa
        fileContent = `${importStatement}\n${fileContent}`;
      }
  
      // Encontrar el índice de la línea de creación de `app`
      const appCreationLine = 'NestFactory.create(AppModule);';
      const appCreationIndex = fileContent.indexOf(appCreationLine);
      if (appCreationIndex === -1) {
        _context.logger.warn('No se pudo encontrar la línea de creación de app.');
        return tree;
      }
  
      // Insertar el bloque `useGlobalPipes` justo después de la creación de `app`
      const insertPosition = appCreationIndex + appCreationLine.length;
      const updatedContent = [
        fileContent.slice(0, insertPosition),
        `\n    ${validationPipeCode}`,
        fileContent.slice(insertPosition),
      ].join('');
  
      tree.overwrite(mainPath, updatedContent);
      return tree;
    };
  }