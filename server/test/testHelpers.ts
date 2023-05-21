import mongoose from "mongoose";

export const connect = () =>
  mongoose
    .connect(
      `mongodb://127.0.0.1:27017/chatAppTest_${
        process.env.JEST_WORKER_ID ?? "1"
      }`
    )
    .catch(() => {
      throw new Error("Couldn't connect to test database");
    });

export const disconnect = async () => {
  try {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  } catch (err) {
    throw new Error("Couldn't drop the test database");
  }
};

export const deleteCollection = async (model: mongoose.Model<any>) => {
  await model.deleteMany({});
};
