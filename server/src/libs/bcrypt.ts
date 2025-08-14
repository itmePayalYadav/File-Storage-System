import bcrypt from 'bcryptjs';

export const hashValue = async (value: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(value, salt);
};

export const compareValues = async (
  value: string,
  hashedValue: string,
): Promise<boolean> => {
  return bcrypt.compare(value, hashedValue);
};
