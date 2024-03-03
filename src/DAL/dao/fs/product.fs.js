
const path = require('path');
import { promises } from 'fs';
import { __dirname } from '../../../utils.js';
const { promisify } = require('util');

class ProductsManagerFs {
    constructor(filePath) {
        this.filePath = filePath || path.join(__dirname, 'products.json');
    }

    async findAll(obj) {
        const { limit = 10, page = 1, order = "def", ...query } = obj;

        let products = await this.readProductsFromFile();

        let sort;
        if (order === "asc") {
            sort = (a, b) => a.price - b.price;
        } else if (order === "des") {
            sort = (a, b) => b.price - a.price;
        } else {
            // No se especifica un orden, no hacer nada
        }

        if (sort) {
            products = products.sort(sort);
        }

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedProducts = products.slice(startIndex, endIndex);

        const totalPages = Math.ceil(products.length / limit);

        const info = {
            status: 'success',
            count: products.length,
            totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
            page,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            nextLink: page < totalPages ? `/api/products?page=${page + 1}` : null,
            prevLink: page > 1 ? `/api/products?page=${page - 1}` : null,
        };

        return { info, payload: paginatedProducts, page, limit, order, query };
    }

    async createOne(obj) {
        const products = await this.readProductsFromFile();
        products.push(obj);
        await this.writeProductsToFile(products);
        return obj;
    }

    async findById(id) {
        const products = await this.readProductsFromFile();
        const result = products.find(product => product._id === id);
        return result;
    }

    async deleteOne(id) {
        let products = await this.readProductsFromFile();
        const index = products.findIndex(product => product._id === id);
        if (index !== -1) {
            const deletedProduct = products.splice(index, 1)[0];
            await this.writeProductsToFile(products);
            return deletedProduct;
        } else {
            return null; // Producto no encontrado
        }
    }

    async updateOne(id, obj) {
        let products = await this.readProductsFromFile();
        const index = products.findIndex(product => product._id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...obj };
            await this.writeProductsToFile(products);
            return products[index];
        } else {
            return null; // Producto no encontrado
        }
    }

    async readProductsFromFile() {
        try {
            const content = await promises.readFile(this.filePath, 'utf-8');
            return JSON.parse(content);
        } catch (error) {
            // Si el archivo no existe o hay un error al leerlo, devuelve un array vacío.
            return [];
        }
    }

    async writeProductsToFile(products) {
        await promises.writeFile(this.filePath, JSON.stringify(products, null, 2), 'utf-8');
    }
}

export const productManagerFs=new ProductsManagerFs("products.json");