import { Router } from "express"
import { create } from "../controllers/Postagens-Controllers.js";

const router = Router()

import { createUser, getAll , getUser, login} from "../controllers/Usuarios-Controllers.js";

router.post("/", createUser)
router.get("/", getAll)
router.get("/:papel", getUser)
router.post("/login", login)

export default router;