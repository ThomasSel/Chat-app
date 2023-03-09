const mongoose = require("mongoose");

module.exports = {
  connect: () =>
    mongoose
      .connect(
        `mongodb://127.0.0.1:27017/chatAppTest_${process.env.JEST_WORKER_ID}`
      )
      .catch(() => {
        throw new Error("Couldn't connect to test database");
      }),
  disconnect: async () => {
    try {
      await mongoose.connection.db.dropDatabase().catch(console.error);
      await mongoose.disconnect();
    } catch (err) {
      throw new Error("Couldn't drop the test database");
    }
  },
  deleteCollection: (collection) =>
    mongoose.connection.collections[collection].drop().catch((error) => {
      if (error.message !== "ns not found") new Error(error.message);
    }),
};
