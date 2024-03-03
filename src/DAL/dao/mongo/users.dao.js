import { usersModel } from "../../models/users.model.js"

class UsersManager  {
    async deleteUserByEmail(email){
        try {
            const result=await usersModel.deleteOne(email)
            return result
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async deleteUserById(idUser){
        try {
            const result=await usersModel.deleteOne({_id:idUser})
            return result
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async getUser(){
        try {
            const result=await usersModel.find()
            return result
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    async findUserByID(id) {
        try {
            const result = await usersModel.findById(id);
            console.log(result);
            return result;
        } catch (error) {
            console.error(error);
            throw error; 
        }
    }

    async findUserByEmail(email){
        const result = await usersModel.findOne({ email })
        return result
    }

    async createUser(obj){
        const result = await usersModel.create(obj)
        return result
    }

    async findUserByCart(cart){        
        return await usersModel.findOne({cart})
    }
    async findUserByRole(role){
        const result= await usersModel.findOne({role})
        return result
    }
    async updateUser(email, obj) {
        const result = await usersModel.updateOne({ email }, obj);
        console.log("email del update",email)
        console.log("obj",obj)
        console.log(result)
        return result;
      }  
/*       async updateUserById(id, obj) {
        const result = await usersModel.updateOne( {_id: id} , obj);
        console.log("update USERDAo",result)
        return result;
      }   */
}


export const uManager = new UsersManager()