import { Router } from "express";
import { logger } from "../utils/index.js";

const router=Router()




router.post("/",(req,res)=>{
    //fatal: 0,
    logger.fatal("este es un logger fatal")
    //error:1,
    logger.error("este es un logger error")
    //warning: 2,
    logger.warning("este es un logger warning")
    //information: 3,
    logger.information("este es un logger information")
    //http:4,
    logger.debug("este es un logger debug")
    //debug:5,
    logger.http("este es un logger http")
    res.send('Logs generados. Verifica la consola o el archivo errors.log.')
})

export default router