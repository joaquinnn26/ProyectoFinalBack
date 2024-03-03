
import { hashData, compareData, logger } from "../utils/index.js";
import {Router} from "express"
import passport from "passport"
import "../passport.js"
import { generateToken , transporter} from "../utils/index.js"
import ResponseDto from "../DAL/dtos/response.dto.js";
import { recuperar, restaurar } from "../controllers/session.controller.js";
import { usersService } from "../repositoryServices/index.js";
import { uManager } from "../DAL/dao/mongo/users.dao.js";


const router = Router();


router.post('/signup', passport.authenticate('signup'),(req, res) => {
    res.json({message: 'Signed up'})    
})




router.get('/current', passport.authenticate('jwt', {session: false}), async(req, res) => {
  const userDTO = new ResponseDto(req.user);
  res.status(200).json({message: 'User logged', user: userDTO})  
})


router.get('/signout', async(req, res)=>{
  req.session.destroy(()=> {       
      res.redirect('/login')
  })
})



router.post('/login', passport.authenticate('login', { failureMessage:true,
  failureRedirect: "/error",}),async (req, res) => {

    const {name, email, age, role, cart,_id} = req.user    
   console.log(req.user)
    const token = generateToken({ name, email, age, role, cart,_id})

    res.cookie('token', token, { maxAge: 6000000, httpOnly: true })
    
    const lastConnection=await uManager.updateUser(email,{last_connection:new Date()})
    return res.redirect('/home')
}) 

router.post("/restaurar", restaurar)

router.post("/recuperar/:id",recuperar)
export default router



