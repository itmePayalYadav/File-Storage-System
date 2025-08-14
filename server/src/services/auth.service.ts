import logger from '@/logger';
import mongoose from 'mongoose';
import User from '@/models/user.model';
import Storage from '@/models/storage.model';
import { StatusCodes } from 'http-status-codes';
import { Conflict, AppError, NotFound, Auth, Server } from '@/utils/error';
import { LoginSchemaType, RegisterSchemaType } from '@/validators';
import { signJwtToken } from '@/libs/jwt';

export const registerService = async (body: RegisterSchemaType) => {
  const { email } = body;
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const existingUser = await User.findOne({ email }).session(session);
      if (existingUser) {
        throw new Conflict('User already exists');
      }

      const [user] = await User.create(
        [
          {
            ...body,
            profilePicture: body.profilePicture || '',
          },
        ],
        { session },
      );

      if (!user) {
        throw new NotFound('User not found before creating storage');
      }

      const [storage] = await Storage.create([{ userId: user._id }], {
        session,
      });

      return { user: (user as any).omitPassword() };
    });
  } catch (error) {
    logger.error('Error during user registration:', error);
    throw new Server('Internal server error during registration');
  } finally {
    session.endSession();
  }
};

export const loginService = async (body: LoginSchemaType) => {
  const { email, password } = body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFound('User not found');
  }
  const isMatched = await user.comparePassword(password);
  if (!isMatched) {
    throw new Auth('Invalid Password');
  }
  const { token, expiresAt } = signJwtToken({
    userId: user._id.toString(),
  });
  return {
    user: (user as any).omitPassword(),
    accessToken: token,
    expiresAt,
  };
};
