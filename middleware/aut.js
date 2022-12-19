import JWT from "jsonwebtoken";
import { UnAuthenticatedError } from "../errors/index.js";

const Auth = async (req, res, next) => {
  const authToken = req.headers.authorization;
  console.log(req.headers);

  if (!authToken || !authToken.startsWith("Bearer")) {
    console.log("no header");
    throw new UnAuthenticatedError("Authentication non valide");
  }

  const token = authToken.split(" ")[1];




  
  try {

    const tokenPayload = JWT.verify(token, process.env.JWT_SECRET);
    console.log(tokenPayload);

   
    req.user = { id: tokenPayload.id, token };

    next();
  } catch (error) {
    throw new UnAuthenticatedError(" Authentication non valide");
  }
};

export default Auth;
