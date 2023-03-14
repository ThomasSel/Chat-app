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
      await mongoose.connection.db.dropDatabase();
      await mongoose.disconnect();
    } catch (err) {
      throw new Error("Couldn't drop the test database");
    }
  },
  deleteCollection: async (model) => {
    await model.deleteMany({});
  },
};
