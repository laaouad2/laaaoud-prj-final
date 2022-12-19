import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  console.log({ name, email, password });

  if (!name || !email || !password) {
    throw new BadRequestError("apporter tout les valeurs");
  }
  const userAlreadyExist = await User.findOne({ email });
  if (userAlreadyExist) {
    console.log(userAlreadyExist);

    throw new BadRequestError("email utiliser");
  }
  const newUser = await User.create({ name, email, password });

  const token = newUser.createJWT();

  res.status(StatusCodes.CREATED).send({
    user: newUser,
    token
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {


    

    throw new BadRequestError("verifier email et mot de passe");
  }
  const lowerCaseEmail = email.toLocaleLowerCase();
  console.log(email, password, lowerCaseEmail);

  const user = await User.findOne({ email: lowerCaseEmail });
  console.log(user);

  if (!user) {
    throw new UnAuthenticatedError("email ou mot de passe eronner");
  }
  console.log("add..");

  const isPasswordCorrect = await user.comparePassword(password);
  console.log(" add", isPasswordCorrect);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("email ou mot de passe eronner");
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).send({ user, token });
};

export const updateUser = async (req, res) => {
  const { prenom, email, nom, location } = req.body;
  console.log(req.body);

  if (!prenom || !email || !nom || !location) {
    throw new BadRequestError("apporter tout les valeurs");
  }
  const user = await User.findOne({ _id: req.user.id });
  user.name = prenom;
  user.email = email;
  user.lastName = nom;
  user.location = location;
  await user.save();
  res.send({ user, token: req.user.token, location });
};
