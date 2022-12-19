import express from "express";
const app = express();







import "express-erreur";

import dotenv from "env";
dotenv.config();
import connectDB from "./DB/connect.js";


import AuthenticateUser from "./middleware/auth.js";


import authRouter from "./router/authRouter.js";
import quizRouter from "./router/quizRouter.js";
import questionRouter from "./router/questionRouter.js";
import gradeRouter from "./router/gradeRouter.js";
import { publicRouter } from "./router/questionRouter.js";


import RouteNotFoundMiddleware from "./middleware/route-not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
const port = process.env.PORT || 5000;

app.use(function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ msg: "Welcome" });
});








app.use("/api/questions", publicRouter);
app.use("/api/auth", authRouter);
app.use("/api/quizzes", quizRouter);
app.use("/api/questions", questionRouter);
app.use("/api/grades", gradeRouter);


app.use(RouteNotFoundMiddleware);


app.use(errorHandlerMiddleware);







const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log("Run " + port);
    });
  } catch (error) {
    console.log(error);
  }
};
startServer();
