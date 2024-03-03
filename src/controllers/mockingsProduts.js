import { generateMockProducts } from "../utils/index.js"
import { faker } from "@faker-js/faker";

export const mockingProducts =async (req,res)=>{
    const productos=generateMockProducts(100)
    res.status(200).json({message:"productos creados",productos})
}


