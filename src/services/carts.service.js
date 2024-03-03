import { cManager } from "../DAL/dao/carts.dao.js"


export const createNewCart = () => {
    const carts = cManager.createCart();
    return carts;
};

export const findCartById = (id) => {
    const cart = cManager.getCartProducts(id);
    if (!cart) {
        return undefined
    }
    return cart;
};


export const addProduct = (cid,pid) => {
    const prod = cManager.addProductToCart(cid,pid);
    return prod;
};

export const deleteOneFromCart = (cid,pid) => {
    const cart = cManager.deleteProduct(cid,pid);
    return cart;
};


export const updateAllProducts = (cid, arr) => {
    const prods = cManager.updateAllProducts(cid, arr);
    return prods;
};

export const updateQuantity = (cid, pid, quantity) => {
    const prod = cManager.updateProductQuantity(cid, pid, quantity);
    return prod;
};

export const deleteAllProductsInCart = (cid) => {
    const cart = cManager.deleteAllProducts(cid);
    return cart;
};