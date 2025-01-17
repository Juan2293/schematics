import { IBaseService } from "../../common/interfaces/generic.service.interface";
import { Create<%= classify(name) %>Dto } from "../dtos/create-<%= dasherize(name) %>.dto";
import { <%= classify(name) %> } from "../entities/<%= dasherize(name) %>.entity";

export interface I<%= classify(name) %>Service extends IBaseService<<%= classify(name) %>, Create<%= classify(name) %>Dto>{}