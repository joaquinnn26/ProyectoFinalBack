import { uManager } from "../DAL/dao/mongo/users.dao.js";
import { cManager } from "../DAL/dao/mongo/carts.dao.js";
import RequestDto from "../DAL/dtos/request.dto.js";
import ResponseDto from "../DAL/dtos/response.dto.js";
import { hashData } from "../utils/index.js";
import { transporter} from "../utils/index.js";
import id from "faker/lib/locales/id_ID/index.js";

export default class UsersRepository {
    async getUsers(){
      try {
        const result=await uManager.getUser()
        const response=result.map(user=>new ResponseDto(user))
        return response
      } catch (error) {
        console.error("no fue posible obtener los usuarios registrados")
        throw error
      }
    }
    async findById(id) {
      try {
        const result = await uManager.findUserByID(id);

        if (!result) {
            console.log(`No se encontró ningún usuario con el ID: ${id}`);
            return null;
        }

        console.log(result);
        return result;
    } catch (error) {
        console.error(`Error al buscar usuario por ID ${id}: ${error.message}`);
        throw error; 
    }
    }

    async findByEmail(id) {
        const user = uManager.findUserByEmail(id);
        return user
    }

    async createOne(user) {
      const hashPassword = await hashData(user.password);
      const createdCart = await cManager.createCart()
      const userDto = new RequestDto(
        { ...user, 
          cart: createdCart._id,
          password: hashPassword });
      
      const createdUser = await uManager.createUser(userDto);
      return createdUser;
    }    
    
    async updateUser(email,obj){
      const update=await uManager.updateUser(email,obj)
      return update
    }
    async deleteUserById(idUser){
      const user=await uManager.findUserByID(idUser)
      
      if(user & user.role=="ADMIN"){
        await transporter.sendMail({
          from: "joaquinfefe@gmail.com",
          to:user.email,
          subject: "Eliminamos tu cuenta",
          html: `
          <p>¡Hola!</p>
          
          <p>Tu cuenta a sido eliminada</p>
          
        `,
        });
        const response=await uManager.deleteUserById(idUser)
        return response
      }
      
    }
    async deleteUsers(){
      const users=await uManager.getUser()
        const limiteTiempo=new Date (Date.now()-30*60*1000)
/*         const usuariosFiltrados=users.filter(user=>user.last_connection < limiteTiempo)

        if(usuariosFiltrados){

        } */
        if(users){
          for (const user of users) {
          if (user.last_connection < limiteTiempo) {
            const emailUser=user.email;

            await transporter.sendMail({
              from: "joaquinfefe@gmail.com",
              to:emailUser,
              subject: "Eliminamos tu cuenta",
              html: `
              <p>¡Hola!</p>
              
              <p>Tu cuenta a sido eliminada por falta de actividad</p>
              
            `,
            });
            
            const deleteUser=await uManager.deleteUserByEmail(emailUser)

          }
        }
        }
        
      }
  }