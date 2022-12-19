import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err.message);
  const defualtError = {
    statusCode: err.statusCodes || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "ressayer apres"
  };



  
  if (err.name === "Validation Error") {
    defualtError.statusCode = StatusCodes.BAD_REQUEST;
    defualtError.msg = Object.values(err.errors) 
      .map(item => item.message) 
      .join(" , ");
  }
  if (err.code === 11000) {
    defualtError.statusCode = StatusCodes.BAD_REQUEST;
    defualtError.msg = `${Object.keys(err.keyValue)} erreur`;
  }





  res.status(defualtError.statusCode).send({ msg: defualtError.msg });
};

export default errorHandlerMiddleware;
