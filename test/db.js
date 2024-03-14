import mongoose from 'mongoose'
import config from '../src/config/config.js'
import { logger } from '../src/utils/loggerWinston.js'
mongoose.connect(config.mongo_uri)
.then(()=>logger.information("conectado a db"))
.catch(error=>logger.error(error))