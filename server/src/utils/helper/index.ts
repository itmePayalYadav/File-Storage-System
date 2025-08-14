import { Byte_Unit } from '@/constant';

export const formateBytes = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;

  while (bytes >= Byte_Unit && i < units.length - 1) {
    bytes /= Byte_Unit;
  }

  const value = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
  }).format(bytes);

  return `${value} ${units[i]}`;
};
