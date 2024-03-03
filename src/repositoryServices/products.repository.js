import { manager } from "../DAL/dao/mongo/products.dao.js";


export default class ProductsRepository {
    
    async findAllProds(obj) {
        const prods = manager.findAll(obj);
        return prods;
    }

    async createProd(obj) {
        const prod = manager.createOne(obj);
        return prod;
    }

    async findProdById(id) {
        const prod = manager.findById(id);
        return prod;
    }

    async deleteOneProd(id) {
        const prod = manager.deleteOne(id);
        return prod;
    }

    async updateProd(id, obj) {
        const prod = manager.updateOne(id, obj);
        return prod;
    }    
    async findByOwner(id){
        const prod =manager.findByOwner(id)
        return prod
    }
}