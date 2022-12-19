import Question from "../models/Question.js";
import Quiz from "../models/Quiz.js";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  UnAuthenticatedError,
  NotFoundError
} from "../ereur/index.js";
import checkPermissions from "../utils/checkPermissions.js";

export const createQuestion = async (req, res) => {
  const { title, quizId, correctAnswer } = req.body;

  if (!title || !quizId || !correctAnswer) {
    console.log("apporter tout les valeurs des questions");
    throw new BadRequestError("apporter tout les valeurs des questions");
  }


  
  const quiz = await Quiz.findOne({ _id: quizId });
  if (!quiz) {
    console.log("Quiz n'existe pas");
    throw new NotFoundError("Quiz n'existe pas");
  }
  checkPermissions({ requestUser: req.user, resourceUserId: quiz.createdBy });




  const numberOfQuestions = quiz.numberOfQuestions + 1;
  await Quiz.findOneAndUpdate({ _id: quizId }, { numberOfQuestions });

  const question = await Question.create(req.body);
  res.status(StatusCodes.CREATED).json(question);
};


export const updateQuestion = async (req, res) => {
  const { id: questionId } = req.params;
  const { title, quizId, correctAnswer } = req.body;

  if (!title || !quizId || !correctAnswer) {
    console.log("apporter tout les valeurs des questions");
    throw new BadRequestError("apporter tout les valeurs des questions");
  }

  const quiz = await Quiz.findOne({ _id: quizId });
  if (!quiz) {
    console.log("Quiz n'existe pas");
    throw new NotFoundError("Quiz n'existe pas");
  }
  checkPermissions({ requestUser: req.user, resourceUserId: quiz.createdBy });
  const updateQuestion = await Question.findOneAndUpdate(
    { _id: questionId },
    req.body,
    {
      new: true, 
      runValidators: true 
    }
  );
  res.status(StatusCodes.OK).json({ updateQuestion });
};


export const deleteQuestion = async (req, res) => {
  const { id: questionId } = req.params;

 
  const question = await Question.findOne({ _id: questionId });
  if (!question) {
    console.log("question n'existe pas");
    throw new NotFoundError("question n'existe pas");
  }
  const quiz = await Quiz.findOne({ _id: question.quizId });
  if (!quiz) {
    console.log("Quiz n'existe pas");
    throw new NotFoundError("Quiz n'existe pas");
  }
  checkPermissions({ requestUser: req.user, resourceUserId: quiz.createdBy });


  const numberOfQuestions = quiz.numberOfQuestions - 1;
  await Quiz.findOneAndUpdate({ _id: question.quizId }, { numberOfQuestions });
  await question.remove();

  res.json({
    msg: "question supprimer avec succes ",
    id: questionId,
    title: question.title
  });
};


export const getQuizQuestions = async (req, res) => {
  const { id: quizId } = req.params;
  if (!quizId) {
    console.log("Quiz Id n'existe pas");
    throw new BadRequestError("Quiz Id n'existe pas");
  }
  const quiz = await Quiz.findOne({ _id: quizId });
  if (!quiz) {
    console.log("Quiz Id n'existe pas");
    throw new NotFoundError("Quiz n'existe pas");
  }
  let result = await Question.find({ quizId: quizId });
  res.status(StatusCodes.OK).send({ quiz, questions: result });
};
