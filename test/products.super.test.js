import supertest from "supertest";
import { describe } from "mocha";
import {expect} from "chai";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

import{ uManager} from "../src/DAL/dao/mongo/users.dao.js"
const requester = supertest ('http://localhost:8080')
const pid="65b28d7600cb16e23a06ebe7"
const mockProduct={
        "title": "Prueba test",
        "description": "prueba1",
        "price": 1500,
        "thumbnail": "uuulrl",
        "code": "2133001",
        "stock": 50550,
        "category":"limpieza"
}
const mockUser= {
    email:"adminCoder@coder.com",
    password:'adminCod3r123'
}
let cookie;
let tokenDecoded;
describe("products endpoints",()=>{
    
    before(async function () {
        this.timeout(500000)
        await mongoose.connect('mongodb+srv://cibanez:JUiXF4gBSbSulLkt@cluster0.21urnbo.mongodb.net/ecommerce?retryWrites=true&w=majority')             
        //await mongoose.connection.collection('users').deleteOne({email: roleUser.email})
        //await mongoose.connection.collection('users').deleteOne({email: rolePremium.email})
        await mongoose.connection.collection('products').deleteOne({code: mockProduct.code})
        //await mongoose.connection.collection('products').deleteOne({code: productByPremium.code})   

        const response = await requester.post('/api/sessions/login').send(mockUser)

        const cookieResult = response.headers['set-cookie'][0]
        cookie = {
            name: cookieResult.split('=')[0],
            value: cookieResult.split('=')[1].split(';')[0]
        }
    }) 

    describe("GET /api/products/", ()=>{
        it("should get all products",async function (){
            this.timeout(50000)
            const response = await requester.get(`/api/products`)
            expect(response._body.prods).to.have.all.keys('info', 'page', 'payload', 'limit', 'order', 'query')
            expect(response._body.prods.payload).to.be.an('array') 
            expect(response._body.prods.info).to.have.property('count')
            expect(response._body.prods.info).to.have.property('totalPages')
            expect(response.statusCode).to.be.equal(200)
        })
    })
    describe("GET /api/products/:pid",()=>{
        it("should get product by id",async function(){
            this.timeout(50000)
            try {
                const response = await requester.get(`/api/products/${pid}`);

                console.log('Response Status:', response.status);
                console.log('Response Body:', response.body.prod._id);

                expect(response.status).to.equal(200);
                expect(response.body.prod._id).to.be.deep.equal(pid)
            } catch (error) {

                console.error('Error during test:', error.message);
                throw error; 
            }
        })
    })
    /* describe ("POST /api/product/",()=>{
        it("should create product",async function(){
            this.timeout(50000)
            try {
                
                const response = await requester.post("/api/products/").set('Cookie', [`${cookie.name}=${cookie.value}`]).send(mockProduct)
                /*console.log("response status POST",response.status)
                console.log("role",response) */
              /*   const ownId=response._body.user.owner
                const ownerProduct=await uManager.findUserByID(ownId)
                console.log(ownerProduct)
                console.log(ownId)
                expect(ownerProduct.role).to.be.equal("ADMIN" || "PREMIUM") */
               /*  expect(response.status).to.be.equal(200)
            } catch (error) {
                console.error(error.message)
            }
        })
    }) */ 
    describe("PUT /api/product/:pid",()=>{
        it('should update product by id',async function(){
            this.timeout(50000)
                const updatedProduct={
                    title:"pruebaUpdate1"
                }
                const response = await requester
                .put('/api/products/' +pid)
                .set('Cookie', [`${cookie.name} = ${cookie.value}`])
                .send(updatedProduct)
                expect(response.status).to.be.equal(200)
    
        })
     describe("DELETE /api/product/:pid",()=>{
        it("should delete product by id",async function(){
            this.timeout(50000)

                const response=await requester.delete(`/api/products/${pid}`)
                expect(response.status).to.be.equal(200)
                console.log("response status DELETE",response.status)

        }) 
    })
    } )
})
