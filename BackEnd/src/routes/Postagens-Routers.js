import { Router } from "express"

const router = Router()

import { create, getAll, getPostagens ,updatePostagem, deletePostagem} from "../controllers/Postagens-Controllers.js";
import  imageUpload  from "../helpers/image-upload.js"


router.get("/", getAll)
router.get("/:id", getPostagens)
router.put("/:id", updatePostagem)
router.delete("/:id",deletePostagem )
router.post("/", imageUpload.single("imagem"), create)


export default router;