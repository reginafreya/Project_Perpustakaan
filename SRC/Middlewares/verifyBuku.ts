import { NextFunction, Request, Response } from "express";
import Joi from 'joi'

const addDataSchema = Joi.object({
    judul: Joi.string().required(),
    pengarang: Joi.string().required(), 
    tahun_terbit: Joi.string().required(),
    tgl_terbit: Joi.string().required(),
    jenis: Joi.string().required(),
    stok: Joi.number().min(0).required(), 
    harga_beli: Joi.number().min(0).required(),
    harga_sewa: Joi.number().min(0).required()
})

const editDataSchema = Joi.object({
    judul: Joi.string().required(),
    pengarang: Joi.string().required(),
    tahun_terbit: Joi.string().required(),
    tgl_terbit: Joi.string().required(),
    jenis: Joi.string().required(),
    stok: Joi.number().min(0).required(),
    harga_beli: Joi.number().min(0).required(),
    harga_sewa: Joi.number().min(0).required(),
})

export const verifyAddBuku = (request: Request, response: Response, next: NextFunction) => {
    const { error } = addDataSchema.validate(request.body, {abortEarly: false})

    if (error) {
        return response.status(400).json({
            status: false,
            messgae: error.details.map(it => it.message).join(', ')
        })
    }
    return next()
}

export const verifyEditBuku = (request: Request, response: Response, next: NextFunction) => {
    const { error } = editDataSchema.validate(request.body, {abortEarly: false})

    if (error) {
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join(', ')
        })
    }
    return next()
}
