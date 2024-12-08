import crypto from 'crypto';

export const getCryptoAddress = () => crypto.randomUUID();

export const signAuthToken = (accountId) => accountId;
export const verifyAuthToken = (token) => {
  console.debug({ token });
  return token;
};
