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
      const { first_name, email, role,cart } = req.user;
      const isAdmin=(role === "ADMIN")
      //cart info
 /*      const cartUser=await usersService.findByEmail(email)
      const cart=await findCartById(cartUser.cart)
      const isLength=(cart.products.length>0)
      const productsCart=cart.products.map(doc=> doc.toObject())
      let totalCompra = 0
      for (const prod of productsCart) {
        totalCompra += prod.quantity * prod.product.price
      } */

      res.render("products", { /* total:totalCompra,cart:productsCart,cartLength:cart.products.length,isLength:isLength, */user: { cart,first_name, email, isAdmin }, productList: productObject, category, page, limit, order, nextPage, prevPage, style: "products" });          
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
    try {
      const { id } = req.params
      const product = await manager.findById(id)
      const { name, email, role, cart } = req.user;
      /* const userCart = req.user.cart */
      console.log("req.user.cart en home/id =>",req.user.cart)   
      console.log("req.user del homer",req.user)           
      res.render('product', { product: product.toObject(), user: { name, email, role, cart }, style: "productDetail" });           
    } catch (error) {
      res.status(500).json({ message: error.message });
    }          
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

router.get('/settings',authorize(["ADMIN"]),async(req,res)=>{
  try {
    const users=await usersService.getUsers()
    //console.log(users)
    res.render('settings',{users:users,email:req.user.email})
  } catch (error) {
    res.status(500).json({message:error.message})
  }
})

router.get('/cart/:cid', async (req, res) => {  
  try {
    const { cid } = req.params
    const { name, email, role, cart } = req.user;
    const response = await cManager.getCartProducts(cid)
    const array = response.products.map(doc => doc.toObject());    
    /* console.log("cid en get /cart/:cid =>", cid) */
    res.render('cart', {cartProductList: array, cid, user: { name, email, role, cart }, style: "cart" })
}
catch (error){
    res.status(500).json({ message: error.message });
}
})



export default router;