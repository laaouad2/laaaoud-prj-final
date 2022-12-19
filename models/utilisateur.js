import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const userSchema = new mongoose.Schema({





  name: {
    type: String,
    required: [true, "Nom approrter"],
    minLength: 3,
    maxLength: 20,
    trim: true
  },
  lastName: {
    type: String,
    maxLength: 20,
    trim: true,
    default: "Nom"
  },
  email: {
    type: String,
    required: [true, "Email apporter"],
    unique: true,
    validate: {
   



      validator: validator.isEmail,
      message: " email non valide "
    }
  },
  password: {
    type: String,
    required: [true, "mot de passe apporter"],
    minLength: 6
  },
  location: {
    type: String,
    minLength: 6,
    default: "cairo , EG"
  }
});





userSchema.pre("save", async function(next) {
 
  if (!this.isModified("mot de passe")) return;

  const salts = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salts);
  this.email = this.email.toLocaleLowerCase();
});

userSchema.methods.createJWT = function() {
  return JWT.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d" 
  });
};


userSchema.methods.comparePassword = async function(userPassword) {
 

  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};


userSchema.methods.toJSON = function() {
  const user = this;
  const tempUser = user.toObject();
  delete tempUser.password;
  return tempUser;
};

export default mongoose.model("utilisateurr", userSchema);
