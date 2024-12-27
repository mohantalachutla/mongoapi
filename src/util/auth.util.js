import process from 'process';
import jwt from 'jsonwebtoken';

export const signAuthToken = (payload) =>
  jwt.sign(
    {
      data: payload,
      iat: Date.now(),
      exp:
        Date.now() / 1000 +
        (process.env.JWT_EXPIRATION_IN_MIN
          ? process.env.JWT_EXPIRATION_IN_MIN * 60 * 1000
          : 24 * 60 * 60 * 1000),
    },
    process.env.JWT_SECRET
  );
export const verifyAuthToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
