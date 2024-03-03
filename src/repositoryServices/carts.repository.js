import { cManager } from "../DAL/dao/mongo/carts.dao.js";
import { uManager } from "../DAL/dao/mongo/users.dao.js";
import { ticketsDao } from "../DAL/dao/mongo/tickets.dao.js";
import { v4 as uuidv4 } from 'uuid'
import { logger } from "../utils/index.js";

export default class CartsRepository {
    
    async createNewCart() {
        const carts = cManager.createCart();
        return carts;
    }

    async findCartById(id) {
        const cart = await cManager.getCartProducts(id);
        return cart
    }

    async addProduct(cid, pid) {
        const prod = cManager.addProductToCart(cid,pid);
        return prod;
    }

    async deleteOneFromCart(cid, pid) {
        const cart = cManager.deleteProduct(cid,pid);
        return cart;
    }

    async updateAllProducts(cid, arr) {
        const prods = cManager.updateAllProducts(cid, arr);
        return prods;
    }

    async updateQuantity(cid, pid, quantity) {
        const prod = cManager.updateProductQuantity(cid, pid, quantity);
        return prod;
    }

    async deleteAllProductsInCart(cid) {
        const cart = cManager.deleteAllProducts(cid);
        return cart;
    }

    async purchase(cid){
        // suficiente stock restarlo del stock
        // stock insuficiente no agregar el prod a la compra final
        // generar un ticket
        // devolver arreglo prod si compra no exitosa
        // carrito debe tener al final solo productos que no se compraron
        const cart = await cManager.getCartProducts(cid)
        const user = await uManager.findUserByCart(cid)
        const products = cart.products
        logger.information(user)
        let availableProducts = []
        let unavailableProducts = []
        let totalAmount = 0
        for(let item of products) {
            logger.information(item)
            if(item.product.stock >= item.quantity){
                availableProducts.push(item)
                item.product.stock -= item.quantity
                await item.product.save()
                totalAmount += item.quantity * item.product.price
            }else{
                unavailableProducts.push(item)
            }
        }
        
        cart.products = unavailableProducts
        await cart.save()
        
        logger.information("available", availableProducts)
        logger.information("unavailable", unavailableProducts)
        if(availableProducts.length){
            const ticket = {
                code:uuidv4(),
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: user.email
            }
            await ticketsDao.createTicket(ticket)
            return { availableProducts, totalAmount }
        }
        return { unavailableProducts }
    }
}