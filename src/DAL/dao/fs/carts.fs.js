import { promises } from 'fs';
const path = require('path');
import { __dirname } from '../../../utils.js';
class CartsManagerFs {
    constructor(filePath) {
        this.filePath = filePath || path.join(__dirname, 'carts.json');
    }

    async createCart() {
        const newCart = { products: [] };
        await this.writeCartToFile(newCart);
        return newCart;
    }

    async getCartProducts(cid) {
        const cart = await this.readCartFromFile(cid);
        return cart;
    }

    async addProductToCart(cid, pid) {
        const selectedCart = await this.readCartFromFile(cid);
        const productIndex = selectedCart.products.findIndex(p => p.product === pid);

        if (productIndex !== -1) {
            selectedCart.products[productIndex].quantity += 1;
        } else {
            selectedCart.products.push({ product: pid, quantity: 1 });
        }

        await this.writeCartToFile(selectedCart);
        return selectedCart;
    }

    async deleteProduct(cid, pid) {
        const selectedCart = await this.readCartFromFile(cid);
        const productIndex = selectedCart.products.findIndex(p => p.product === pid);
        const deletedProduct = selectedCart.products[productIndex];

        if (productIndex !== -1) {
            selectedCart.products.splice(productIndex, 1);
            await this.writeCartToFile(selectedCart);
        }

        return deletedProduct;
    }

    async updateAllProducts(cid, arr) {
        const selectedCart = await this.readCartFromFile(cid);
        selectedCart.products = arr;
        await this.writeCartToFile(selectedCart);
        return selectedCart;
    }

    async updateProductQuantity(cid, pid, quant) {
        const selectedCart = await this.readCartFromFile(cid);
        const productIndex = selectedCart.products.findIndex(p => p.product === pid);

        if (productIndex !== -1) {
            selectedCart.products[productIndex].quantity = quant;
            await this.writeCartToFile(selectedCart);
        }

        return selectedCart;
    }

    async deleteAllProducts(cid) {
        const selectedCart = await this.readCartFromFile(cid);
        selectedCart.products = [];
        await this.writeCartToFile(selectedCart);
        return selectedCart;
    }

    async readCartFromFile(cid) {
        try {
            const content = await promises.readFile(this.filePath, 'utf-8');
            const carts = JSON.parse(content);
            const cart = carts.find(cart => cart._id === cid) || { products: [] };
            return cart;
        } catch (error) {
            // Si hay un error al leer el archivo, devuelve un carrito vacío.
            return { products: [] };
        }
    }

    async writeCartToFile(cart) {
        try {
            const content = await promises.readFile(this.filePath, 'utf-8');
            const carts = JSON.parse(content);

            const existingIndex = carts.findIndex(existingCart => existingCart._id === cart._id);
            if (existingIndex !== -1) {
                carts[existingIndex] = cart;
            } else {
                carts.push(cart);
            }

            await promises.writeFile(this.filePath, JSON.stringify(carts, null, 2), 'utf-8');
        } catch (error) {
            // Manejar errores de escritura aquí
            console.error('Error al escribir en el archivo:', error.message);
        }
    }
}
export const cartsManagerFs=new CartsManagerFs("carts.json")