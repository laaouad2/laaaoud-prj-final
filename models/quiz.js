import mongoose from "mongoose";
import Question from "./quest.js";

const QuizSchema = mongoose.Schema(
  {




    title: {
      type: String,
      required: [true, "titre"],
      maxLength: 100
    },
    subject: {
      type: String,
      enum: ["english", "programing", "compta", "marketing"],
      default: "english"
    },
    description: {
      type: String,
      maxLength: 250
    },
    bgUrl: String,
    shortUrl: String,
    numberOfQuestions: {
      type: Number,
      default: 0
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: [true, "Owner must exist"]
    }
  },


  
  { timestamps: true }
);
QuizSchema.pre("remove", async function(next) {
  const quiz = this;
  await Question.deleteMany({ quizId: quiz._id });
});
export default mongoose.model("quiz", QuizSchema);
