import dotenv from "dotenv";

dotenv.config()

export default {
  port: process.env.PORT,
  mongo_uri: process.env.MONGO_URI,
  secret_jwt: process.env.SECRET_JWT,
  acount_sid_twilio:process.env.ACCOUNT_SID_TWILIO,
  tocken_twilio:process.env.TOCKEN_TWILIO,
  gmail_user:process.env.GMAIL_USER,
  gmail_password:process.env.GMAIL_PASS,
};