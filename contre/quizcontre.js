import Quiz from "../models/Quiz.js";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  UnAuthenticatedError,
  NotFoundError
} from "../ereur/index.js";
import mongoose from "mongoose";
import checkPermissions from "../utils/checkPermissions.js";
import ShortenURL from "../utils/ShortenURL.js";

export const createQuiz = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    console.log("apporter tout les quiz des valeur");
  
    throw new BadRequestError("apporter tout les quiz des valeur");
  }

  req.body.createdBy = req.user.id;
  const id = new mongoose.Types.ObjectId();
  const { link } = await ShortenURL(id);
  const quiz = await Quiz.create({ _id: id, shortUrl: link, ...req.body });

  res.status(StatusCodes.CREATED).json(quiz);
};

export const getAllQuizzes = async (req, res) => {
  const { search, sort, subject } = req.query;
  const queryObject = {
    createdBy: req.user.id
  };

  if (search) {
  
    queryObject.title = { $regex: search, $options: "i" };
  }
  if (subject && subject !== "tout") {
    queryObject.subject = subject;
  }


  let result = Quiz.find(queryObject);

  if (sort === "latest") {
    result = result.sort("-creat");
  }
  if (sort === "oldest") {
    result = result.sort("creat");
  }
  if (sort === "a-z") {
    result = result.sort("titre");
  }
  if (sort === "z-a") {
    result = result.sort("-titre");
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;
  const skip = (page - 1) * limit;

  result.skip(skip).limit(limit);

  const quizzes = await result;
  const totalQuizzes = await Quiz.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalQuizzes / limit);

  res.status(StatusCodes.OK).json({ quizzes, totalQuizzes, numOfPages });
};

export const deleteQuiz = async (req, res) => {
  const { id: quizId } = req.params;
  const quiz = await Quiz.findOne({ _id: quizId });

  if (!quiz) {
    throw new NotFoundError(`pas de quiz avec cette id : ${quizId}`);
  }

  checkPermissions({ requestUser: req.user, resourceUserId: quiz.createdBy });
  await quiz.remove();

  res.json({ msg: "quiz supprimer avec succes ", id: quizId, title: quiz.title });
};
export const updateQuiz = async (req, res) => {
  const { id: quizId } = req.params;
  const { title, description, bgUrl } = req.body;

  if (!title) {
    throw new BadRequestError("apporter tout les quiz des valeur");
  }
  const quiz = await Quiz.findOne({ _id: quizId });
  if (!quiz) {
    throw new NotFoundError(`pas de quiz avec cette id: ${quizId}`);
  }


  checkPermissions({ requestUser: req.user, resourceUserId: quiz.createdBy });
  const updatedQuiz = await Quiz.findOneAndUpdate({ _id: quizId }, req.body, {
    new: true,
    runValidators: true 
  });
  res.status(StatusCodes.OK).json(updatedQuiz);
};

export const getStats = async (req, res) => {
 
  let stats = await Quiz.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.id) } },
    { $group: { _id: "$subject", count: { $sum: 1 } } }
  ]);

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});


  const defaultStats = {
    english: stats.english || 0,
    programing: stats.programing || 0,
    math: stats.math || 0,
    marketing: stats.marketing || 0
  };


  let monthlyApplications = await Quiz.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.id) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } }, 
    { $limit: 6 }
  ]);
  monthlyApplications = monthlyApplications
    .map(monthItem => {
      const {
        _id: { year, month },
        count
      } = monthItem;
      const date = new Date(year, month, 0);
      let dateString = date.toDateString().split(" ");
      dateString = `${dateString[1]} ${dateString[3]}`;
      return { date: dateString, count };
    })
    .reverse();
  res.status(StatusCodes.OK).send({ stats: defaultStats, monthlyApplications });
};
