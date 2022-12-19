import mongoose from "mongoose";

const GradeSchema = mongoose.Schema({
  quizId: { required: true, type: mongoose.Types.ObjectId, ref: "quiz" },

  
  userEmail: { type: String, required: [true, "Email"] },
  userName: String,
  grade: { required: true, type: String },
  message: String
});






export default mongoose.model("grade", GradeSchema);
