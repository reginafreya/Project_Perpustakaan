import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const addDataSchema = Joi.object({
    nama_user: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("ADMIN", "MANAGER").required(),
});

const editDataSchema = Joi.object({
    nama_user: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("ADMIN", "MANAGER").required(),
});

export const verifyAddUser = (req: Request, res: Response, next: NextFunction) => {
    const { error } = addDataSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            status: false,
            message: error.details.map((it) => it.message).join(", "),
        });
    }
    return next();
};

export const verifyEditUser = (req: Request, res: Response, next: NextFunction) => {
    const { error } = editDataSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            status: false,
            message: error.details.map((it) => it.message).join(", "),
        });
    }
    return next();
};