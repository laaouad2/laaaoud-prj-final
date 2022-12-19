import mongoose from "mongoose";

const QuestionSchema = mongoose.Schema({



  
  titleType: {
    type: String,
    enum: ["text", "photo", "audio", "video"],
    default: "text"
  },
  titleTypeAssetUrl: String,
  AnswerType: {
    type: String,
    enum: ["mcq", "photosMcq"],
    default: "mcq"
  },
  title: {
    type: String,
    required: [true, "Question titre"],
    maxLength: 300
  },





  quizId: {
    type: mongoose.Types.ObjectId,
    ref: "quiz",
    required: [true, "quiz "]
  },
  wrongAnswers: [{ type: String }], 
  correctAnswer: {
    type: String,
    required: [true, "Question correct "],
    maxLength: 300
  }
});

export default mongoose.model("question", QuestionSchema);
