import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Dto {
}

export class CreateDto extends Dto {

}

export class CreateEntityDto extends CreateDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    uid: string;
}

export class UpdateDto extends Dto {}
