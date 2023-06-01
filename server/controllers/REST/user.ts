import User from "../../models/user";
import { Request, Response } from "express";

export const create = async (req: Request, res: Response): Promise<void> => {
  const email: string = req.body.email;
  const username: string = req.body.username;
  const password: string = req.body.password;

  const user = new User({
    email: email,
    username: username,
    password: password,
  });

  try {
    await user.save();
    res.status(201).json({ message: "User created" });
  } catch (error) {
    res.status(400).json({ message: "Error - Invalid details" });
  }
};
