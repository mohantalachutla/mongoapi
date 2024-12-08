import mongoose from 'mongoose';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  socketTimeoutMS: 30000,
  serverSelectionTimeoutMS: 5000,
  poolSize: 10,
};

let connection, session;
export const db = async (MONGO_DB_URL) => {
  try {
    connection = await mongoose
      .connect(MONGO_DB_URL, options)
      .catch((err) => console.error(err));
    if (connection) {
      session = await connection.startSession();
    }
  } catch (err) {
    console.error(err);
    await session.endSession();
  }
  return session;
};

export { session };
