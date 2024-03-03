import mongoose from 'mongoose'
import config from '../src/config/config.js'
mongoose.connect(config.mongo_uri)
.then(()=>console.log("conectado a db"))
.catch(error=>console.log(error))