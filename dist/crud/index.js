"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.example = example;
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
function example(_options) {
    return (_tree, _context) => {
        const templateSource = (0, schematics_1.apply)((0, schematics_1.url)('./files'), [
            (0, schematics_1.template)(Object.assign(Object.assign({}, _options), core_1.strings)),
            (0, schematics_1.move)(`./src/${core_1.strings.dasherize(_options.name)}`), // Crea una carpeta con el nombre del módulo
        ]);
        return (0, schematics_1.chain)([(0, schematics_1.mergeWith)(templateSource)]);
    };
}
//# sourceMappingURL=index.js.map