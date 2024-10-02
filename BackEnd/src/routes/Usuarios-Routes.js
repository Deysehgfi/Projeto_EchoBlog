import { Router } from "express"


const router = Router()

import { createUser, getAll , getUser, login, updateUsuario} from "../controllers/Usuarios-Controllers.js";

router.post("/", createUser)
router.get("/", getAll)
router.get("/:papel", getUser)
router.post("/login", login)
router.put("/:id", updateUsuario)

export default router;