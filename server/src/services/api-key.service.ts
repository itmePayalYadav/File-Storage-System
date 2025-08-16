import { generateAPIKey } from '@/libs/crypto';
import ApiKey from '@/models/api_key.model';
import { NotFound } from '@/utils/error';

export const createApiKeyService = async (userId: string, name: string) => {
  const { rawKey, hashedKey, displayKey } = generateAPIKey();
  await ApiKey.create({
    userId,
    name,
    hashKey: hashedKey,
    displayKey,
  });
  return {
    rawKey,
  };
};

export const getAllApiKeysService = async (
  userId: string,
  pagination: {
    pageSize: number;
    pageNumber: number;
  },
) => {
  const { pageSize, pageNumber } = pagination;
  const skip = (pageNumber - 1) * pageSize;

  const [apiKeys, totalCount] = await Promise.all([
    ApiKey.find({ userId }).skip(skip).limit(pageSize).sort({ createdAt: -1 }),
    ApiKey.countDocuments({ userId }),
  ]);
  const totalPages = Math.ceil(totalCount / pageSize);
  return {
    apiKeys,
    pagination: {
      pageSize,
      totalCount,
      totalPages,
      pageNumber,
      skip,
    },
  };
};

export const deleteApiKeyService = async (userId: string, apiKeyId: string) => {
  const response = await ApiKey.deleteOne({
    _id: apiKeyId,
    userId,
  });
  if (response.deletedCount === 0) {
    throw new NotFound('API key not found');
  }
  return {
    deletedCount: response.deletedCount,
  };
};
