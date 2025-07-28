import {
    Body,
    Delete,
    Get,
    NotFoundException,
    Patch,
    Post,
    Req,
    UsePipes,
} from '@nestjs/common';

import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { EntityServiceInterface } from '../interfaces/entity-service.interface';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { DeleteResult } from 'mongoose';
import { PrefixedUuidV7Param } from '../decorators/parse.prefixed.uuid.decorator';
import { GenerateUuidIfEmptyPipe } from '../pipes/generate.prefixed.uuid.pipe';

export class CrudController<CreateDtoType, UpdateDtoType> {
    readonly service: EntityServiceInterface;

    @Get()
    async findAll() {
        return await this.service.findAll();
    }

    @Get(':uid')
    @ApiParam({ name: 'uid' })
    async findOne(
        @PrefixedUuidV7Param('uid') uid: string,
    ): Promise<ObjectLiteral> {
        return await this._findOne(uid);
    }

    @Delete(':uid')
    @ApiParam({ name: 'uid' })
    async remove(
        @PrefixedUuidV7Param('uid') uid: string,
    ): Promise<ObjectLiteral[] | DeleteResult | undefined> {
        return await this.service.remove(uid);
    }

    @Post()
    @UsePipes(new GenerateUuidIfEmptyPipe())
    create(@Body() create: CreateDtoType, @Req() request: Request) {
        return this.service.create<CreateDtoType>(create);
    }

    @Patch(':uid')
    @ApiParam({ name: 'uid' })
    update(
        @PrefixedUuidV7Param('uid') uid: string,
        @Body() update: UpdateDtoType,
    ) {
        return this.service.update<UpdateDtoType>(uid, update);
    }

    async _findOne(uid: string) {
        const entity = await this.service.findOneByUid(uid);
        if (!entity) {
            throw new NotFoundException();
        }
        return entity;
    }
}
