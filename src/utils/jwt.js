import jwt from "jsonwebtoken";
import config from "../config/config.js"
import {logger} from "./index.js"

//generador de token con jwt
export const generateToken = (user) => {
    const token = jwt.sign(user, config.secret_jwt, { expiresIn: 300 });
    logger.information("token", token);
    return token;
  };
  