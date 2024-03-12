
import {Router} from "express"
import passport from "passport"
import "../passport.js"
import { generateToken } from "../utils/index.js"
import ResponseDto from "../DAL/dtos/response.dto.js";
import { signup,login,current,signout,recuperar, restaurar } from "../controllers/session.controller.js";
import { usersService } from "../repositoryServices/index.js";



const router = Router();


router.post('/signup', passport.authenticate('signup'),signup)

router.get('/current', passport.authenticate('jwt', {session: false}), current)

router.get('/signout', signout)

router.post('/login', passport.authenticate('login', { failureMessage:true,
  failureRedirect: "/error",}),login) 

router.post("/restaurar", restaurar)

router.post("/recuperar/:id",recuperar)
export default router



