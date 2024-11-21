import { Options } from "./options.interface";

export interface CreateGeneric{
    options:               Options;
    templatePath:          string;
    targetPath:            string;
}

export interface ClassAttributes{
    name:         string
    attributes:   Attribute [],
}

export interface Attribute{
    name: string | '';
    type: string | '';
}