import { Router } from "express";

import {  findUserById,documentMulter, findUserByEmail, createUser, changeRole,getUsers,deleteUsers,deleteUserById} from "../controllers/users.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { authorize } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/getUsers", authorize(["ADMIN"]),getUsers)

router.get(
  "/:idUser", authorize(["ADMIN"]), findUserById);

router.post("/premium/:idUser", authorize(["ADMIN"]),changeRole)

router.post("/:idUser/documents",upload.fields([
  { name: "dni", maxCount: 1 },
  { name: "address", maxCount: 1 },
  { name: "bank", maxCount: 1 },
]),documentMulter)

router.post("/", async (req, res) => {
  const user = req.body
  const createdUser = await createUser(user)
  res.json({ createdUser })
})
router.delete("/deleteUserById/:idUser", authorize(["ADMIN"]),deleteUserById)
router.delete("/deleteUsers", authorize(["ADMIN"]),deleteUsers)

export default router;