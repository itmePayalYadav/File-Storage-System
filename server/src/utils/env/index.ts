export const getEnv = (key: string, defaultValue?: string) => {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue === undefined) {
      throw new Error(
        `Environment variable ${key} is not set and no default value provided.`,
      );
    }
    return defaultValue;
  }
  return value;
};
