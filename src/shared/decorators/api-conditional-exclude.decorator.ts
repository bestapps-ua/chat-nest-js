import { applyDecorators } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

export function ApiConditionalExclude(shouldExclude: boolean) {
    if (shouldExclude) {
        return applyDecorators(ApiExcludeEndpoint());
    }
    return applyDecorators();
}
