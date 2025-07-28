import { SetMetadata } from '@nestjs/common';

export const TRANSFORM_RESPONSE_KEY = 'transformResponse';
export const TransformResponse = (value: boolean) => SetMetadata(TRANSFORM_RESPONSE_KEY, value);
