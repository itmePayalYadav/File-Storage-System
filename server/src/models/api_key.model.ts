import { Document, Types, Schema, model, Model } from 'mongoose';

export interface ApiKeyDocument extends Document {
  userId: Types.ObjectId;
  name: string;
  displayKey: string;
  hashKey: string;
  createdAt: Date;
  updatedAt: Date;
  lastUsedAt?: Date;
}

interface ApiKeyModel extends Model<ApiKeyDocument> {
  updateLastUsedAt: (hashKey: string) => Promise<void>;
}

const apiKeySchema = new Schema<ApiKeyDocument, ApiKeyModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    displayKey: {
      type: String,
      required: true,
    },
    hashKey: {
      type: String,
      required: true,
      select: false,
    },
    lastUsedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

apiKeySchema.statics.updateLastUsedAt = async function (
  hashKey: string,
): Promise<void> {
  await this.updateOne({ hashKey }, { lastUsedAt: new Date() });
};

const ApiKey = model<ApiKeyDocument, ApiKeyModel>('ApiKey', apiKeySchema);

export default ApiKey;
