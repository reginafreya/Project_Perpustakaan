import { JenisTransaksi, Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import Joi from 'joi'

const peminjamanListSchema = Joi.object({
    buku_Id: Joi.number().required(),
    quantity: Joi.number().required(),
    note: Joi.string().optional()
});

const addDataSchema = Joi.object({
    nama_customer: Joi.string().required(),
    JenisTransaksi: Joi.string().valid("TRANSFER","QRIS").uppercase().required(),
    statusBayar: Joi.string().valid("LUNAS","BELUM_BAYAR").uppercase().required(),
    list_Peminjaman: Joi.array().items(peminjamanListSchema).min(1).required(),
    user: Joi.optional(),
});

export const verifyAddPeminjaman = (req: Request, res: Response, next: NextFunction) => {
    const { error } = addDataSchema.validate(req.body, {abortEarly: false })

if (error) {
    return res.status(400).json({
        status: false,
        message: error.details.map(it => it.message).join(", ")
    })
}
next();
}

const editDataSchema = Joi.object({
    statusBayar: Joi.string().valid("LUNAS","BELUM_BAYAR").uppercase().required(),
    user: Joi.optional(),
});

export const verifyEditStatus = (req: Request, res: Response, next: NextFunction) => {
    const {error} = editDataSchema.validate(req.body, { abortEarly: false})

if (error) {
    return res.status(400).json({
        status: false,
        message: error.details.map(it => it.message).join(", ")
    })
}
next();
}