import Grade from "../models/Grade.js";
import Question from "../models/Question.js";
import { BadRequestError, NotFoundError } from "../ereur/index.js";
import { StatusCodes } from "http-status-codes";

export const createGrade = async (req, res) => {
  const { userEmail, quizId, grade, message } = req.body;

  if (!userEmail || !quizId || !grade) {
    console.log("apporter tout les valeurs");
    throw new BadRequestError("apporter tout les valeurs");
  }


  
  const newGrade = await Grade.create(req.body);
  res.status(StatusCodes.CREATED).json({ newGrade });
};

export const getGradesBy = async (req, res) => {
  const { quizId } = req.body;


  let grades;
  if (quizId) {
    grades = await Grade.find({ quizId: quizId });
  } else {
    grades = await Grade.find({ userId: req.user.id });
  }
  const gradesLength = grades.length;

  res.status(StatusCodes.OK).send({ quizId, grades, gradesLength });
};
