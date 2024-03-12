import twilio from "twilio";
import  jwt from "jsonwebtoken";
import { cartsService } from "../repositoryServices/index.js";
import config from "../config/config.js";
import customError from "../services/errors/errors.generate.js"
import { errorsMessage, errorsName } from "../services/errors/errors.enum.js";
import { productsService } from "../repositoryServices/index.js";
import { transporter } from "../utils/nodemailer.js";

export const createACart = (req, res) => {
    try{
        const cart = cartsService.createNewCart();
        res.status(200).json({ message: "Cart created" });
    }catch (error){
        res.status(500).json({message: error.message})
    }
};


export const findCart = async (req, res, next) => {
    try{
        const { cid } = req.params;
        const cart = await cartsService.findCartById(cid);
        const cartObj=cart.products.map(doc => doc.toObject())
        console.log("se encontro el carrito",cartObj)
        if (!cart) {
                customError.createError(errorsName.CART_NOT_FOUND,errorsMessage.CART_NOT_FOUND,500)
            }
        res.status(200).json({ message: "Cart found", payload:cartObj});
    }catch (error) {
        next(error)
    }        
};


export const addProductToCart =  async (req, res,next) => {
    const { cid, pid } = req.params;
    /* let token = req.headers.authorization?.split(' ')[1]; 
    const decoded = jwt.verify(token,config.secret_jwt);
    req.user = decoded; */
    const user=req.user
    console.log(user)
    if (!cid || !pid ) {
        customError.createError(errorsName.DATA_NOT_RECEIVED,errorsMessage.DATA_NOT_RECEIVED,500)
    }
    try {   
        const product= await productsService.findProdById(pid)
        console.log("product del add",product)
        if (user._id==product.owner) {
            customError.createError(errorsName.YOU_CREATED_PRODUCT,errorsMessage.YOU_CREATED_PRODUCT,500)
        }
        const productAdded = await cartsService.addProduct(cid, pid);
       // const product = await productsService.findProdById(pid)
        res.status(200).json({ message: "Product added to Cart", payload: product, cart: productAdded });
   }catch (error){
        res.status(500).json({message:error.message})
    }    
};


export const deleteFromCart =  async (req, res ,next) => {
    const { cid, pid } = req.params;

    if (!cid || !pid ) {
        return customError.createError(errorsName.DATA_NOT_RECEIVED,errorsMessage.DATA_NOT_RECEIVED,500)
    }
    try {
        const productDeleted= await cartsService.deleteOneFromCart(cid, pid);
    res.status(200).json({ message: "Product deleted to Cart", cart: productDeleted,payload:productDeleted.product });
    }catch (error){
        next(error)
    }    
};


export const updateProducts = async (req, res,next) => {
    const { cid } = req.params;
    try {
        const { products } = req.body
        if (!cid || !products) {
            customError.createError(errorsName.DATA_NOT_RECEIVED,errorsMessage.DATA_NOT_RECEIVED,500)
        }
        const cartProds = await cartsService.updateAllProducts(cid, products);       
        res.status(200).json({ message: "Products updated", cartProds });
    }catch (error) {
        next(error)
    }
}

export const updateProdQuantity = async (req, res,next) => {    
    try {
        const {cid, pid} = req.params
        const { quantity } = req.body 
        if (!cid ||!pid ||!quantity) {
            customError.createError(errorsName.DATA_NOT_RECEIVED,errorsMessage.DATA_NOT_RECEIVED,500)
        }       
        const response = await cartsService.updateQuantity(cid, pid, +quantity);       
        res.status(200).json({ message: "Product updated", response });
    }catch (error) {
        next (error)
    }
}


export const deleteAllProductsCart = async (req, res,next) => {    
    try {
        const {cid} = req.params  
        if (!cid) {
            customError.createError(errorsName.CART_NOT_FOUND,errorsMessage.CART_NOT_FOUND,500)
        }            
        const response = await cartsService.deleteAllProductsInCart(cid);       
        res.status(200).json({ message: "Products deleted", response });
    }catch (error) {
        next (error)
    }
}

export const thePurchase = async (req, res,next) => {    
    try {
        const {cid} = req.params
        if (!cid) {
            customError.createError(errorsName.CART_NOT_FOUND,errorsMessage.CART_NOT_FOUND,500)
        }              
        const response = await cartsService.purchase(cid);
        res.status(200).json({ response });
    }catch (error) {
        next(error)
    }
}