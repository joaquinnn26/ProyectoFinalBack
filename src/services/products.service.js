import { manager } from "../DAL/dao/mongo/products.dao.js";


export const findAllProds = (obj) => {
  const prods = manager.findAll(obj);
  return prods;
};

export const createProd = (obj) => {
    const prod = manager.createOne(obj);
    return prod;
};

export const findProdById = (id) => {
    const prod = manager.findById(id);
    return prod;
};

export const deleteOneProd = (id) => {
    const prod = manager.deleteOne(id);
    return prod;
};

export const updateProd = (id, obj) => {
    const prod = manager.updateOne(id, obj);
    return prod;
};