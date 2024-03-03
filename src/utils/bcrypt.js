import bcrypt from "bcryptjs";

//hasheo de contraseña con bcrypt
export const hashData = async (data) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(data, salt);
    };
    
  export const compareData = async (data, hashedData) => {
    return bcrypt.compare(data, hashedData);
  };