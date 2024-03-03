import winston from "winston";
import config from "../config/config.js";
//loggers con winston

const customLevels = {
    levels: {
      fatal: 0,
      error:1,
      warning: 2,
      information: 3,
      http:4,
      debug:5,
    },
    colors: {
      fatal: "black",
      error:"red",
      warning: "yellow",
      information: "green",
      http:"blue",
      debug:"gray",
    },
  };
  
  export let logger;
  
  if (config.environment === "production") {
    logger = winston.createLogger({
      levels: customLevels.levels,
      transports: [
        new winston.transports.Console({
          level: "information",
          format: winston.format.combine(
            winston.format.colorize({ colors: customLevels.colors }),
            winston.format.simple()
          ),
        }),
        new winston.transports.File({
          level: "error",
          filename:"errors.log"
        })
      ],
    });
  } else {
    logger = winston.createLogger({
      levels: customLevels.levels,
      transports: [
        new winston.transports.Console({
          level: "debug",
          format: winston.format.combine(
            winston.format.colorize({ colors: customLevels.colors }),
            winston.format.simple()
          ),
        }),
  
      ],
    });
  }
  

