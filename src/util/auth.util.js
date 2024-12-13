export const signAuthToken = (accountId) => accountId;
export const verifyAuthToken = (token) => {
  console.debug({ token });
  return token;
};
