import { UploadSourceEnum } from '@/enums';
import { formateBytes } from '@/utils/helper';
import { Document, Types, Schema, model, Model } from 'mongoose';

export interface FileDocument extends Document {
  userId: Types.ObjectId;
  formattedSize: string;
  originalName: string;
  storageKey: string;
  mimeType: string;
  size: number;
  ext: string;
  url: string;
  uploadVia: keyof typeof UploadSourceEnum;
  createdAt: Date;
  updatedAt: Date;
}

interface FileModel extends Model<FileDocument> {
  calculateUsage(userId: Types.ObjectId): Promise<number>;
}

const fileSchema = new Schema<FileDocument, FileModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    storageKey: {
      type: String,
      required: true,
      unique: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    ext: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    uploadVia: {
      type: String,
      required: true,
      enum: Object.keys(UploadSourceEnum),
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        ret.formattedSize = formateBytes(ret.size);
        return ret;
      },
    },
  },
);

fileSchema.statics.calculateUsage = async function (
  userId: Types.ObjectId,
): Promise<number> {
  const result = await this.aggregate([
    {
      $match: { userId },
    },
    {
      $group: {
        _id: null,
        totalSize: {
          $sum: '$size',
        },
      },
    },
  ]);
  return result[0]?.totalSize || 0;
};

fileSchema.index({ userId: 1 });
fileSchema.index({ createdAt: -1 });

const File = model<FileDocument, FileModel>('File', fileSchema);

export default File;
