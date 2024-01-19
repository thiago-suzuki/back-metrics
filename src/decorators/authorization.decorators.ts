import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { verify } from 'jsonwebtoken';

export const Authorization = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const { headers } = ctx.switchToHttp().getRequest();

    const options = {
      issuer: 'gbm-authentication',
    };

    const decoded = verify(
      headers['authorization'].replace('Bearer ', ''),
      process.env.ACCESS_TOKEN_SECRET,
      options,
    );

    return decoded;
  },
);