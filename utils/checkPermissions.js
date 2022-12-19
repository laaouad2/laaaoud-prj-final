import { UnAuthenticatedError } from "../ereur/index.js";
import { request } from "http";

const checkPermissions = ({ requestUser, resourceUserId }) => {
  //resourceUserId.toString() =  model.createdBy.toString()
  if (requestUser.id === resourceUserId.toString()) return; // return without any Error
  throw new UnAuthenticatedError("acces non autoriser");
};

export default checkPermissions;
