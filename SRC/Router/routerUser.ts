import express from "express"
import { getAllUser, createUser, updateUser, deleteUser, changeUserPicture, authentication} from "../Controller/controllerUser"
import { verifyAddUser, verifyEditUser } from "../Middlewares/verifyUser"
import uploadFile from "../Middlewares/userUpload"
import { verifyAuthetication } from "../Middlewares/userValidation"
import validateEmail from "../Middlewares/validateEmail"

const router = express()
router.use(express.json())

router.get(`/`,getAllUser)
router.post(`/`,[verifyAddUser],createUser)
router.put(`/:id`,[verifyEditUser],updateUser)
router.put(`/picUser/:id`,[uploadFile.single("picture"), changeUserPicture])
router.delete(`/:id`, deleteUser)

router.post(`/create`, [validateEmail],createUser)
router.post(`/login`, [validateEmail,verifyAuthetication], authentication)

export default router