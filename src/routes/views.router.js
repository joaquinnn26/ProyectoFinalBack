import { Router } from "express";
import { manager } from "../DAL/dao/mongo/products.dao.js";
import { cManager } from "../DAL/dao/mongo/carts.dao.js";
import { authorize } from "../middlewares/authMiddleware.js";
import { usersService } from "../repositoryServices/index.js";
import  jwt  from "jsonwebtoken";
import config from "../config/config.js";
import {logger} from "../utils/index.js"
import passport from "passport"
import "../passport.js"
import { findCartById } from "../services/carts.service.js";
const router = Router();

router.get("/login", (req, res) => {  
  if (req.session.passport){
    return res.redirect('/home')
  }  
    
  const allMessages = req.session.messages;
  if(allMessages){
    const messages = allMessages[allMessages.length - 1]
    return res.render("login", {messages, style: "login"});
  }
  return res.render("login", {style: "login"}); 
  
});

router.get("/documents",passport.authenticate('jwt', {session: false}) ,(req, res) => {
  const {_id}=req.user
  res.render("documents",{id:_id})
});

router.get("/signup", (req, res) => {  
  if (req.session.passport){
    return res.redirect('/home')
  }   
  res.render("signup", {style: "signup"});
});




router.get("/home", passport.authenticate('jwt', {session: false}) ,async (req, res) => {  
  try {
      const products = await manager.findAll(req.query)
      const {payload, info, page, limit, order, query} = products
      const { nextPage, prevPage } = info
      const {category} = query      
      const productObject = payload.map(doc => doc.toObject()); 
      if (!req.session.passport){
        return res.redirect('/login')
      }
      const { first_name, email, role } = req.user;
      const isAdmin=(role === "ADMIN")
      const cartUser=await usersService.findByEmail(email)
      const cart=await findCartById(cartUser.cart)
      const isLength=(cart.products.length>0)
      
      console.log("cart lenght",cart.products.length)
      res.render("products", { cartLength:cart.products.length,isLength:isLength,user: { first_name, email, isAdmin }, productList: productObject, category, page, limit, order, nextPage, prevPage, style: "products" });          
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});


router.get("/restaurar", (req, res) => {
  res.render("restore", {style: "restore"});
});

router.get("/recuperar/:id", (req, res) => {
  if (req.cookies.tokenEmail){
    const { id } = req.params  
    res.render("restoreTwo", {style: "restart",id: id.toString()});
  } else {
    console.log("No hay token en las cookies. Redirigiendo manualmente a /restore");
    return res.redirect("/restaurar")
  }
});



router.get("/error", (req, res) => {
  const allMessages = req.session.messages || [];
  const messages = allMessages.length > 0 ? allMessages[allMessages.length - 1] : null;
  res.render("error", {messages, style: "error"});
});




router.get("/chat", authorize(["USER"]),(req, res) => {
  res.render("chat");
});



router.get('/home/:id', async (req, res) => {  
  try {
      const { id } = req.params
     /*  const {cart} = req.user */
      //console.log(req.cookies.token)
      const decoded=jwt.verify(req.cookies.token,config.secret_jwt)
    console.log(decoded)
      const product = await manager.findById(id)              
      res.render('product', { product: product.toObject(),cart:decoded.cart, style: "productDetail" });           
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

router.get('/settings',authorize(["ADMIN"]),async(req,res)=>{
  try {
    const users=await usersService.getUsers()
    //console.log(users)
    res.render('settings',{users:users})
  } catch (error) {
    res.status(500).json({message:error.message})
  }
})

router.get('/cart/:cid', async (req, res) => {  
  try {
    const { cid } = req.params
    const response = await cManager.getCartProducts(cid)
    const array = response.products.map(doc => doc.toObject());    
    res.render('cart', {cartProductList: array,  style: "cart" })
}
catch (error){
    res.status(500).json({ message: error.message });
}
})



export default router;