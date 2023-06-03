import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import User from "../../models/user";

export const create = async (req: Request, res: Response): Promise<void> => {
  const email: string = req.body.email;
  const username: string = req.body.username;
  const password: string = req.body.password;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    email: email,
    username: username,
    password: hashedPassword,
  });

  try {
    await user.save();
    res.status(201).json({ message: "User created" });
  } catch (error) {
    res.status(400).json({ message: "Error - Invalid details" });
  }
};
