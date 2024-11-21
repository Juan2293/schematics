import { Type } from "class-transformer";
import {  IsOptional, Min } from "class-validator";

export class PaginationDto{

    @IsOptional()
    @Min(1)
    @Type( () => Number)
    take?: number;
    
    @IsOptional()
    @Min(0)
    @Type( () => Number)
    skip?: number;
}