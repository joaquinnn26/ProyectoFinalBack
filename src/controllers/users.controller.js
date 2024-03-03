import { usersService } from "../repositoryServices/index.js";
import customError from "../services/errors/errors.generate.js"
import { errorsMessage, errorsName } from "../services/errors/errors.enum.js";
import passport from "passport";
import { uManager } from "../DAL/dao/mongo/users.dao.js";
import {saveUserDocuments} from "../services/users.service.js"


export const getUsers=async (req,res)=> {
    const users=await usersService.getUsers()
    res.status(200).json({message:"usuarios encontrados:",users})
}

export const findUserById = (req, res) => {
    passport.authenticate("jwt", { session: false }),

    async (req, res) => {
        const { idUser } = req.params;
        const user = await usersService.findById(idUser);
        if (!user) {
            customError.createError(errorsName.USER_NOT_FOUND,errorsMessage.USER_NOT_FOUND,500)
            }
        res.json({ message: "User", user });
}};

export const findUserByEmail = async (req, res) => {
    const { UserEmail } = req.body;
    const user = await usersService.findByEmail(UserEmail);
    if (!user) {
        customError.createError(errorsName.USER_NOT_FOUND,errorsMessage.USER_NOT_FOUND,500)
    }
    res.status(200).json({ message: "User found", user });
};

export const createUser =  async (req, res) => {
    const { name, lastName, email, password } = req.body;
    if (!name || !lastName || !email || !password) {
        customError.createError(errorsName.DATA_NOT_RECEIVED,errorsMessage.DATA_NOT_RECEIVED,500)
    }
    const createdUser = await usersService.createOne(req.body);
    res.status(200).json({ message: "User created", user: createdUser });
};

export const changeRole= async (req, res) => {
        const { idUser } = req.params;
        console.log(req.params)
        const user = await usersService.findById(idUser);
        if (!user) {
            customError.createError(errorsName.USER_NOT_FOUND,errorsMessage.USER_NOT_FOUND,500)
            }
        
    try {
        console.log("usuario se eocntro en changerole",user)

        let result
        if (user.documents[0].name=="dni" && user.documents[1].name=="address" && user.documents[2].name=="bank") {
            console.log("role usuario",user.role)
        let roleChange;
        if (user.role == 'PREMIUM') {
            roleChange = 'USER' 
        } else if (user.role == 'user' || user.role == "USER" ){
            roleChange =  'PREMIUM' 
        }
        console.log(roleChange)
        result =await usersService.updateUser(user.email,{role:roleChange})
        }else{
            customError.createError(errorsName.DOCUMENT_MISSING,errorsMessage.DOCUMENT_MISSING,404)
        }

        res.status(200).json({message:"role updated",user:result})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const documentMulter=async(req,res)=> {
    const {idUser} =req.params;
    
    const emailUser=await usersService.findById(idUser)
    const email=emailUser.email
    console.log("email",emailUser)
    const { dni, address, bank } = req.files;
    if(!dni || !address || !bank){
        res.status(400).json({message:"falta cargar algun documento"})
    }
    console.log(req.files)
    const response = await saveUserDocuments({ email, dni, address, bank });

    console.log(response)
    res.status(200).json({message:"documentos cargados", response });
}

export const deleteUsers=async (req,res)=>{
    const usersDeleted=await usersService.deleteUsers()
    res.status(200).json({message:"users deleted",usersDeleted})
}
export const deleteUserById=async (req,res)=>{
    const {idUser} = req.params

    const userDeleted=await usersService.deleteUserById(idUser)
    res.status(200).json({message:"user deleted",userDeleted})
}