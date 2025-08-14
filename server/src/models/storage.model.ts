import File from '@/models/file.model';
import { Storage_Unit } from '@/constant';
import { Document, Types, Schema, model, Model } from 'mongoose';
import { NotFound, Validation } from '@/utils/error';
import { formateBytes } from '@/utils/helper';
import { all } from 'axios';

interface IStorage {
  userId: Types.ObjectId;
  storageUnit: number;
  createdAt: Date;
  updatedAt: Date;
}

interface StorageMatrics {
  quota: number;
  usage: number;
  remaining: number;
}

interface UploadValidation {
  allowed: boolean;
  newUsage: number;
  remainingAfterUpload: number;
}

interface StorageStatics {
  getStorageMetrics(userId: Types.ObjectId): Promise<StorageMatrics>;
  validateUpload(
    userId: Types.ObjectId,
    fileSize: number,
  ): Promise<UploadValidation>;
}

interface StorageDocument extends IStorage, Document {}

interface StorageModel extends Model<StorageDocument>, StorageStatics {}

const storageSchema = new Schema<StorageDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    storageUnit: {
      type: Number,
      required: true,
      default: Storage_Unit,
      min: [0, 'Storage unit cannot be negative'],
    },
  },
  { timestamps: true },
);

storageSchema.statics = {
  async getStorageMetrics(userId: Types.ObjectId) {
    const storage = await (this as StorageModel).findOne({ userId }).lean();
    if (!storage) throw new NotFound('Storage not found for user');
    const usage = await File.calculateUsage(userId);
    return {
      quota: storage.storageUnit,
      usage,
      remaining: storage.storageUnit - usage,
    };
  },

  async validateUpload(userId: Types.ObjectId, totalFileSize: number) {
    if (totalFileSize < 0) {
      throw new Validation('File size cannot be negative');
    }
    const metrics = await (this as StorageModel).getStorageMetrics(userId);
    const hashSpace = metrics.remaining >= totalFileSize;
    if (!hashSpace) {
      const sortFail = totalFileSize - metrics.remaining;
      throw new Validation(
        `Insufficient storage space. Available: ${formateBytes(sortFail)} bytes`,
      );
    }
    return {
      allowed: true,
      newUsage: metrics.usage + totalFileSize,
      remainingAfterUpload: metrics.remaining - totalFileSize,
    };
  },
};

const Storage = model<StorageDocument, StorageModel>(
  'Storage',
  storageSchema,
) as StorageModel;

export default Storage;
