import { NextFunction, Request, Response } from "express";
import Joi from "joi";

// Schema validasi untuk login/register
const authSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': `"email" is required`,
    'any.required': `"email" is required`,
    'string.email': `"email" must be a valid email`,
  }),
  password: Joi.string().required().messages({
    'string.empty': `"password" is required`,
    'any.required': `"password" is required`,
  }),
});

// Middleware untuk validasi request body
export const verifyAuthetication = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const { error } = authSchema.validate(request.body, { abortEarly: false})

    if (error) {
        return response.status(400).json({
            status: false,
            message: error.details.map((it) => it.message).join()
        })
    }
    return next()
}