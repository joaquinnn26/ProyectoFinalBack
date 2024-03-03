import mongoose from "mongoose";
import config from "./config.js"
import { logger } from "../utils/index.js";




mongoose
  .connect(config.mongo_uri)
  .then(() => logger.information("Conectado a la DB"))
  .catch((error) => logger.fatal(error));