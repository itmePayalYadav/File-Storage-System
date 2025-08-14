import { ENV } from '@/config';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

type TimeUnit = 's' | 'm' | 'h' | 'd' | 'w' | 'M' | 'y';
type TimeString = `${number}${TimeUnit}`;

export type AccessPayload = {
  userId: string;
};

type SignOptsAndSecret = SignOptions & {
  secret: string;
  expiresIn: TimeString | number;
};

const defaults: SignOptions = {
  audience: ['user'],
};

const accessTokenSignOptions: SignOptsAndSecret = {
  secret: ENV.JWT_SECRET,
  expiresIn: ENV.JWT_EXPIRES_IN as TimeString,
};

export const signJwtToken = (
  payload: AccessPayload,
  options?: SignOptsAndSecret,
) => {
  const isAccessToken = !options || options === accessTokenSignOptions;
  const { secret, ...opts } = options || accessTokenSignOptions;
  const token = jwt.sign(payload, secret, {
    ...defaults,
    ...opts,
  });
  const expiresAt = isAccessToken
    ? (jwt.decode(token) as JwtPayload)?.exp! * 1000
    : undefined;

  return {
    token,
    expiresAt,
  };
};
