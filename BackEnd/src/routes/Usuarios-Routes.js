import { Router } from "express"

const router = Router()

import { createUser } from "../controllers/Usuarios-Controllers.js";

router.post("/", createUser)

export default router;