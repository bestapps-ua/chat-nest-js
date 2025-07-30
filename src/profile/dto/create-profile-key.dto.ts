
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateDto } from '../../shared/dto/dto';

export class CreateProfileKeyDto extends CreateDto {
    userId: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    publicKey: string;
}
