import { Rule, apply, url, template, move, mergeWith, Tree, SchematicContext, forEach } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { CreateGeneric } from '../../interfaces';

export function createGenericComponents(options: CreateGeneric): Rule {
    return (tree: Tree, _context: SchematicContext): Rule => {

      const sourceTemplates = apply(url(options.templatePath), [
        forEach((fileEntry) => {
          const destinationFilePath = `${options.targetPath}/${fileEntry.path}`;
          if (tree.exists(destinationFilePath)) {
            return null;
          }
          return fileEntry;
        }),
        template({ ...strings }),
        move(options.targetPath), 
      ]);
  
      return mergeWith(sourceTemplates);
    };
  }