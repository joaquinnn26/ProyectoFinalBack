import { manager } from "../src/DAL/dao/mongo/products.dao.js";
import { uManager } from "../src/DAL/dao/mongo/users.dao.js";
import {expect} from "chai";
import { describe } from "mocha";
const mockProduct={
    "title": "Prueba test",
    "description": "prueba1",
    "price": 1500,
    "thumbnail": "uuulrl",
    "code": "005005",
    "stock": 50550,
    "category":"limpieza"
}


describe('GET products',function(){
    it('should an array',async function(){
        const response=await sds()
        expect(response).to.be.equal()
    })
    it('should products objects')
})

describe('CREATE product',function(){
    it('should id object',async function(){
        this.timeout(50000)
        const response=await manager.createOne(mockProduct)
        console.log(response)
        expect(response).to.exist;
    })
})