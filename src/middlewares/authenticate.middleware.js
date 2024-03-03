import  jwt  from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Acceso no autorizado, token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, 'jwtSecret');
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};
