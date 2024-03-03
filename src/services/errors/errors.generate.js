import { logger } from "../../utils/index.js";

export default class customError {
    static createError(name,message,code){
        const error=new Error(message);
        error.name=name
        error.code=code
        logger.error(error.name)
        logger.error(error.code)
        logger.error(error.message)
        throw error
    }
}
