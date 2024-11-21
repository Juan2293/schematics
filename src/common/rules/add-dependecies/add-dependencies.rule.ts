import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

    

export function addNodeDependency(dependencies: Record<string, string>): Rule {
  return (tree: Tree, context: SchematicContext) => {

    const packageJsonPath = '/package.json'

    const buffer = tree.read(packageJsonPath);
    if (!buffer) {
      throw new Error('Not found: package.json');
    }

    const packageJson = JSON.parse(buffer.toString());

    // Inicializar la propiedad `dependencies` si no existe
    if (!packageJson.dependencies) {
      packageJson.dependencies = {};
    }

    let installDependencies: boolean = false;
    // Añadir solo las dependencias que no existan
    for (const [depName, depVersion] of Object.entries(dependencies)) {
      if (!packageJson.dependencies[depName]) {
        packageJson.dependencies[depName] = depVersion;
        installDependencies = true;
      }
    }

    // Sobreescribir el archivo package.json con los nuevos cambios

    // Agregar la tarea de instalación de paquetes

    if (installDependencies) {
      tree.overwrite(packageJsonPath, JSON.stringify(packageJson, null, 2));
      context.addTask(new NodePackageInstallTask());
    }

    return tree;
  };

}