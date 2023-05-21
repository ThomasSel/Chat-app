// const mongoose = require("mongoose");
import mongoose, { InferSchemaType } from "mongoose";

export interface IUser {
  email: string;
  username: string;
  password: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    unique: true,
    dropDups: true,
  },
  username: { type: String, required: true, minLength: 4 },
  password: { type: String, required: true, minLength: 6 },
});

export type UserModelType = mongoose.Model<IUser>;

const User: UserModelType = mongoose.model<IUser>("User", UserSchema);

export default User;
