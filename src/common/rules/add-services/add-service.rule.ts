import { Rule, SchematicContext, Tree, apply, url, template, move, chain, mergeWith } from '@angular-devkit/schematics';
import { join, normalize, strings } from '@angular-devkit/core';

export function createGenericService(options: any): Rule {
    return (tree: Tree, context: SchematicContext) => {
      const servicePath = join(normalize('src/common/services'), 'generic.service.ts');

      // Verificar si el archivo ya existe
      if (tree.exists(servicePath)) {
        context.logger.info('El archivo generic.service.ts ya existe. No se realizará ninguna acción.');
        return tree;
      }

      // Si no existe, crear el archivo usando una plantilla
      const templateSource = apply(url('../common/files'), [
        template({
          ...options,
          ...strings,
        }),
        move(`./src/common/`),
      ]);

      return chain([mergeWith(templateSource)]);
    }
  }