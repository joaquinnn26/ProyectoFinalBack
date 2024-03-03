export const generateUserErrorInfo=(user)=>{
    if (!user.name || !user.lastName || !user.password){
        return "no recibio toda la informacion que se esperaba"
    }
}

