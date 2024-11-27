## Crear proyecto schematics para los templates

1. Install schematics-cli
```
npm install -g @angular-devkit/schematics-cli
```

2. Crear nueva carpeta e inicializar el proyecto de Schematics:
```
schematics blank --name=my-schematic
```


3. El el archivo `src/my-schematic/index.ts`, agregar el código para la creación de la plantilla

```typescript
import { Rule, SchematicContext, Tree, apply, url, template, move, chain, mergeWith } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';

export function mySchematic(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const templateSource = apply(url('./files'), [
      template({
        ..._options,
        ...strings,
      }),
      move('./'),
    ]);

    return chain([mergeWith(templateSource)]);
  };
}
```

4. Agregar los schematics en el archivo `src/collection.json`
```json
{
  "schematics": {
    "my-schematic": {
      "description": "A blank schematic",
      "factory": "./my-schematic/index#mySchematic"
    }
  }
}
```

Tener en cuenta que `index#mySchematic` hace referencia al nombre de la función que está creado en el index.ts

5. Crear una carpeta `files` dentro de `src/my-schematic/` para almacenar los archivos que schematic usará como plantilla.

6. Crear uno o varios archivos plantilla `__name__.module.ts.template` 

```typescript
import { Module } from '@nestjs/common';

@Module({})
export class <%= classify(name) %>Module {}
```

Este archivo usa interpolación (<%= %>) para insertar valores de las opciones del schematic (en este caso, el nombre del módulo).


7. Actualizar `package.json`,   agregar el script del schematic que se cró
```json
"scripts": {
  
  "my-schematic": "schematics .:my-schematic"
}
```

8. Compilar el proyecto
```
npm run build
```

9. Publicar 
```
npm publish
```

10. Utilizar en otro proyecto, se llama  `schematics:name-in-package:schema --variable=value`

```
schematics example-schematics-dc:crud --name=brand
```

#Opcional

Probar Schematic, el valor del  atributo __name__ será el nombre del modulo creado.
```
npm run crud -- --table=product --path=src/  --dry-run=false
```