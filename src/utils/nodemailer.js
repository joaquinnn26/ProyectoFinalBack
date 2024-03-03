import nodemailer from "nodemailer"
import { logger } from "../utils/index.js";
import config from "../config/config.js";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.gmail_user,
    pass: config.gmail_password,
  },
});

transporter.verify().then(() => {
    logger.information("Ready for send email")
}).catch((err) => {
    logger.error("error email")
});