import { NextFunction, Request, Response } from "express";
import Joi, { required } from 'joi'

const addDataSchema = Joi.object({
    nama_user: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().valid('ADMIN','MANAGER').required()
})

const editDataSchema = Joi.object({
    nama_user: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().valid('ADMIN','MANAGER').required()
})

export const verifyAddUser = (request: Request, response: Response, next: NextFunction) => {
    const { error } = addDataSchema.validate(request.body, {abortEarly: false})

    if (error) {
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join(', ')
        })
    }
    return next()
}

export const verifyEditUser = (request: Request, response: Response, next: NextFunction) => {
    const { error } = editDataSchema.validate(request.body, {abortEarly: false})

    if (error) {
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join(', ')
        })
    }
    return next()
}
