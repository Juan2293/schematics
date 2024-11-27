import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { addModuleToAppImports, addNodeDependency, createGenericComponents } from '../common/rules';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function authBack(options: any): Rule {
  return async (_tree: Tree, _context: SchematicContext) => {

    return chain([
      createGenericComponents({
        options: options,
        templatePath: './files/',
        targetPath: `${options.path}/`
      }),
      addNodeDependency({
        "@nestjs/config": "^3.3.0",
        "@nestjs/jwt": "^10.2.0",
        "@nestjs/mapped-types": "*",
        "@nestjs/passport": "^10.0.3",
        "class-transformer": "^0.5.1",
        "class-validator": "^0.14.1",
        "passport": "^0.7.0",
        "passport-jwt": "^4.0.1",
        "bcrypt": "^5.1.1",
        "reflect-metadata": "^0.1.13",
        "uuid": "^10.0.0",
        "@types/bcrypt": "^5.0.2",
        "@types/passport-jwt": "^4.0.1"
      }),
      addModuleToAppImports(
        `AuthModule`,
        `./auth/auth.module`,
        options.path
      ),
    ]);
  };

}


