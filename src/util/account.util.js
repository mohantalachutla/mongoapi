import process from 'process';

export const getSystemEmail = () => {
  return process.env.SYSTEM_EMAIL ?? 'SYSTEM@gmail.com';
};
