import crypto from 'crypto';
import logger from '@/logger';
import { KEY_TYPE } from '@/constant';
import { KeyType } from '@/libs/crypto';
import ApiKey from '@/models/api_key.model';
import { Auth, NotFound, Validation } from '@/utils/error';
import { NextFunction, Request, Response } from 'express';
import { findByIdUserService } from '@/services/user.service';

export const apiKeyAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new Auth('API key required. User authorization Bearer <API_KEY>');
    }
    const apiKey = authHeader.slice(7).trim();
    if (!apiKey) {
      throw new Validation('API Key Missing');
    }
    if (!apiKey.startsWith('sk_') || apiKey.length < 20) {
      throw new Validation('Invalid API Key format');
    }
    const parts = apiKey.split('_');
    if (parts.length < 3 || parts[0] !== 'sk') {
      throw new Validation('Invalid API Key format');
    }
    const KeyType = parts[1];
    if (!Object.values(KEY_TYPE).includes(KeyType as KeyType)) {
      throw new Validation('Invalid API Key type');
    }
    const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
    const apiKeyDoc = await ApiKey.findOne({
      hashKey: hashedKey,
    })
      .select('+hashkey')
      .lean();
    if (!apiKeyDoc) {
      throw new Validation('Invalid API key');
    }
    const user = await findByIdUserService(apiKeyDoc.userId.toString());
    if (!user) {
      throw new NotFound('User not found');
    }
    ApiKey.updateLastUsedAt(hashedKey).catch(logger.error);
    req.user = user;
    logger.info('API KEY Used', apiKeyDoc.displayKey);
    next();
  } catch (error) {
    next(error);
  }
};
