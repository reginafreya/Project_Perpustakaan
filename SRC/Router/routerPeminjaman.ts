import express from "express";
import {
    getAllPeminjaman,
    createPeminjaman,
    updateStatusPeminjaman,
    deletePeminjaman,
} from "../Controller/controllerPeminjaman";
import { verifyAddPeminjaman, verifyEditStatus } from "../Middlewares/peminjamanValidation";
import { verifyRole, verifyToken } from "../Middlewares/authorization";

const router = express.Router();

router.get("/", [verifyToken, verifyRole(["MANAGER", "ADMIN"])], getAllPeminjaman);
router.post("/", [verifyToken, verifyRole(["ADMIN"]), verifyAddPeminjaman], createPeminjaman);
router.put("/:id", [verifyToken, verifyRole(["ADMIN"]), verifyEditStatus], updateStatusPeminjaman);
router.delete("/:id", [verifyToken, verifyRole(["MANAGER"])], deletePeminjaman);

export default router;