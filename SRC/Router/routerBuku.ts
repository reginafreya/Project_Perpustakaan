import express from "express"
import { getAllBuku, createBuku, updateBuku, changeBookPicture, deleteBuku,} from "../Controller/controllerBuku"
import { verifyAddBuku, verifyEditBuku } from "../Middlewares/verifyBuku"
import uploadFile from "../Middlewares/bukuUpload"


const router = express()
router.use(express.json())

router.get('/', getAllBuku)
router.post('/', [verifyAddBuku], createBuku)
router.put('/:id',[verifyEditBuku], updateBuku)
router.put('/pic/:id', [uploadFile.single("picture"), changeBookPicture])
router.delete(`/:id`, deleteBuku)


export default router