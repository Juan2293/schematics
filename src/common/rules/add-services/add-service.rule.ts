import { Rule, apply, url, template, move, chain, mergeWith } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { CreateGeneric } from '../../interfaces';

export function createGenericComponents(options: CreateGeneric): Rule {
    return () => {
      const templateSource = apply(url(options.templatePath), [
        template({
          ...options,
          ...strings,
        }),
        move(options.targetPath),
      ]);
      
      return chain([mergeWith(templateSource)]);
    }
  }