import { usersService } from "../repositoryServices/index.js";
import {generateToken, transporter } from "../utils/index.js";
import { hashData ,compareData} from "../utils/index.js";
import { logger } from "../utils/index.js";
import ResponseDto from "../DAL/dtos/response.dto.js";

const serverURL = 'http://localhost:8080';

export const signup=async(req, res) => {
  res.json({message: 'Signed up'})    
}

export const current= async(req, res) => {
  const userDTO = new ResponseDto(req.user);
  res.status(200).json({message: 'User logged', user: userDTO})  
}

export const signout= async(req, res)=>{
  req.session.destroy(()=> {       
      res.redirect('/login')
  })
}

export const login =async (req, res) => {

  const {name, email, age, role, cart,_id} = req.user    
 
  const token = generateToken({ name, email, age, role, cart,_id})

  res.cookie('token', token, { maxAge:  24 * 60 * 60 * 1000, httpOnly: true })
  
  const lastConnection=await usersService.updateUser(email,{last_connection:new Date()})
  return res.redirect('/home')
}


export const recuperar = async (req, res) => {
    const { id }=req.params;
    const { password} = req.body;
 
      if (req.cookies.tokenEmail) { 
       
        try {
      const user = await usersService.findById(id);
      
      if (!user) {
        logger.error("user no encontrado")
        //return res.redirect("/login");
      }
        const isRepeatPassword=await compareData(user.password,password)
        if (isRepeatPassword) {
          return res.json({ message: "This password is not valid" });
        }
        const hashedPassword = await hashData(password);
        user.password = hashedPassword;
        await user.save();
  
      

    
      res.status(200).json({ message: "password changed" });
    } catch (error) {
      res.status(500).json({message:error.message });
    }
  }
  else{
    res.redirect("/restaurar")
  }
}

export const restaurar = async (req, res) => {
    const { email} = req.body;
    try {
      const user = await usersService.findByEmail(email);
      if (!user) {
        logger.error("user no encontrado")
        return res.redirect("/");
      }
  
     // const hashedPassword = await hashData(password);
      //user.password = hashedPassword;
      //await user.save();
      await transporter.sendMail({
        from: "joaquinfefe@gmail.com",
        to:email,
        subject: "Restore your password",
        html: `
        <p>¡Hola!</p>
        
        <p>Haz clic en el siguiente botón para recuperar su contraseña:</p>
        <a href="${serverURL}/recuperar/${user._id}" target="_blank" style="padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; display: inline-block;">Ir a la página</a>
      `,
      });
      
      const tokenEmail = generateToken({email})    
    res.cookie('tokenEmail', tokenEmail, { maxAge: 3600000, httpOnly: true })

      res.status(200).json({ message: "Email send" });
    } catch (error) {
      res.status(500).json({message:error.message });
    }
  }