import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

import { InsertChange, applyToUpdateRecorder } from '@schematics/angular/utility/change';

export function modifyAppConfig( byInterceptor:Boolean =false): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const configPath = 'src/app/app.config.ts';

    if (!tree.exists(configPath)) {
      throw new Error(`${configPath} no existe.`);
    }

    const sourceText = tree.read(configPath)?.toString();
    if (!sourceText) {
      throw new Error(`No se pudo leer el archivo ${configPath}.`);
    }

    // const sourceFile = ts.createSourceFile(
    //   configPath,
    //   sourceText,
    //   ts.ScriptTarget.Latest,
    //   true
    // );

    // Verificar si `provideHttpClient` ya está presente
    const provideHttpClientRegex = /provideHttpClient\s*\(([^)]*)\)/;
    const matches = sourceText.match(provideHttpClientRegex);

    let recorder = tree.beginUpdate(configPath);

    const importProvideHttpClient = `import { provideHttpClient, withInterceptors } from '@angular/common/http';`;
    const importAuthInterceptor = `import { authInterceptor } from './interceptors/auth.interceptor';`;

    if (!sourceText.includes(importProvideHttpClient)) {
      recorder.insertLeft(0, `${importProvideHttpClient}\n`);
    }

    if (!sourceText.includes(importAuthInterceptor) && byInterceptor) {
      recorder.insertLeft(0, `${importAuthInterceptor}\n`);
    }

    if ( matches || (matches && byInterceptor)) {
      // Si `provideHttpClient` ya existe, agregar `withInterceptors([authInterceptor])` si no está presente
      if(!byInterceptor){
            return;
      }
      const existingArgs = matches[1];
      if (!existingArgs.includes('withInterceptors')) {
        const position = sourceText.indexOf(matches[0]) + matches[0].length - 1; // Dentro de los paréntesis
        const insertChange = new InsertChange(
          configPath,
          position,
          ' withInterceptors([authInterceptor])'
        );
        applyToUpdateRecorder(recorder, [insertChange]);
      }
    } else{
      // Si `provideHttpClient` no existe, agregarlo completo al final del array `providers`
      const providersRegex = /providers\s*:\s*\[([^\]]*)\]/;
      const providersMatch = sourceText.match(providersRegex);

      if (providersMatch) {
        const position = sourceText.indexOf(providersMatch[1]) + providersMatch[1].length;
        const insertChange = new InsertChange(
          configPath,
          position,
          byInterceptor ? ',\n    provideHttpClient(withInterceptors([authInterceptor])),' : ',\n  provideHttpClient()'
        );
        applyToUpdateRecorder(recorder, [insertChange]);
      } else {
        throw new Error(`No se encontró la configuración de "providers" en ${configPath}.`);
      }
    }

    tree.commitUpdate(recorder);
    return tree;
  };
}
