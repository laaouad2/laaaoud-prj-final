import express from "express";
const router = express.Router();
import AuthenticateUser from "../middleware/auth.js";
import { register, login, updateUser } from "../controller/authController.js";





router.route("/register").post(register);
router.route("/login").post(login);







router.route("/update").post(AuthenticateUser, updateUser);

export default router;
