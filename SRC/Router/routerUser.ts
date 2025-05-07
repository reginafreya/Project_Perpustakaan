import express from "express"
import { getAllUser, createUser, updateUser, deleteUser, changeUserPicture, authentication} from "../Controller/controllerUser"
import { verifyAddUser, verifyEditUser } from "../Middlewares/verifyUser"
import { verifyAuthetication } from "../Middlewares/userValidation"
import { verifyRole, verifyToken } from "../Middlewares/authorization"
import uploadFile from "../Middlewares/userUpload"

const app = express()
app.use(express.json())

app.get(`/`, [verifyToken, verifyRole(["MANAGER"])], getAllUser)
app.put('/:id', [verifyToken, verifyRole(["MANAGER"])], [uploadFile.single("profile_picture"), verifyEditUser], updateUser)
app.put(`/picUser/:id`, [verifyToken, verifyRole(["MANAGER"])], [uploadFile.single("profile_picture"), changeUserPicture])
app.delete(`/:id`, [verifyToken, verifyRole(["MANAGER"])], deleteUser)

app.post(`/login`, [verifyAuthetication], authentication)
app.post('/', [uploadFile.single("profile_picture"), verifyAddUser],createUser)

// app.post(`/create`,[validateEmail], createUser)

export default app