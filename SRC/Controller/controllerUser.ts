import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"
import { BASE_URL, SECRET } from "../global"
import fs from "fs"
import md5 from "md5"
import { sign } from "jsonwebtoken"
import { number } from "joi"

const prisma = new PrismaClient ({ errorFormat: "pretty"})

export const getAllUser = async ( request: Request, response: Response) => {
    try {
        const { search } = request.query

        const allUser = await prisma.user.findMany({
            where: {nama_user: {contains: search?.toString() || ""}}
        })

        return response.json({
            status: true,
            data: allUser,
            message: `List has retrived`
        }).status(200)
    } catch (error) {
        return response 
            .json({
                status: false,
                message: `There is an error. ${error}`
            }).status
    }
}

export const createUser = async (request: Request, response: Response) => {
    try{
        const {user_Id, nama_user, email, password, role} = request.body
        const uuid = uuidv4()

        const newUser = await prisma.user.create({
            data: {uuid, user_Id, nama_user, email, password: md5(password), role}
        })

        return response.json({
            status: true,
            data: newUser,
            messgae: `New user has created`
        }).status(200)
    }catch (error) {
        return response
        .json({
            status: false,
            messgae: `There is an error. ${error}`
        }).status(400)
    }
}

export const updateUser = async (request: Request, response: Response ) => {
    try {
        const { id } = request.params
        const {user_Id,nama_user, email, password, role} = request.body

        const findUser = await prisma.user.findFirst({where: {user_Id: Number(id)}})
        if (!findUser) {
            return response
            .status(200)
            .json({ status: false, message: `User is not found`})
        }

        const updateUser = await prisma.user.update({
            data: {
                user_Id: user_Id || findUser.user_Id,
                nama_user: nama_user || findUser.nama_user,
                email: email || findUser.email,
                password: password || findUser.password,
                role: role || findUser.role
            }, 
            where: {user_Id: Number(id)}
        }) 

        return response.json({
            status: true,
            data: updateUser,
            message: `User has updated`
        }).status(200)
    } catch (error) {
        return response.json({
            status: false,
            message: `There is an error .${error}`
        })
        .status(400)
    }
}

export const changeUserPicture = async (request: Request, response: Response) => {
    try {
        const { id } = request.params

        const findUser = await prisma.user.findFirst({where: {user_Id: Number(id)}})
        if (!findUser) return response
             .status(200)
             .json({status: false, message: ` Picture is not found`})

        let filename = findUser.picture
        if (request.file) {
            filename = request.file.filename

            let path = `${BASE_URL}/../public/user_picture/${findUser.picture}`
            let exist = fs.existsSync(path)

            if (exist && findUser.picture !== ``) fs.unlinkSync(path)
        }
        
        const updateUser = await prisma.user.update({
            data: { picture: filename},
            where: { user_Id: Number(id)}
        })

        return response.json({
            status: true,
            data: updateUser,
            message: `User picture has changed`
        }).status(200)

    } catch ( error ) {
        return response.json({
            status: false,
            message: ` There is an error. ${error}`
        }).status(400)
    }
}

export const deleteUser = async(request: Request, response: Response) => {
    try {
        const { id } = request.params

        const findUser = await prisma.user.findFirst({where: {user_Id: Number(id)}})
        if (!findUser) return response
             .status (200)
             .json({status: false, message: `User is not found`})

        let path = `${BASE_URL}/../public/user_picture/${findUser.picture}`
        let exist = fs.existsSync(path)
        if (exist && findUser.picture !== ``) fs.unlinkSync(path)

        const deleteUser = await prisma.user.delete({
            where: { user_Id: Number(id)}
        })
        return response.json({
            status: true,
            data: deleteUser,
            message: `User has deleted`
        }).status(200)
    } catch (error) {
        return response.json({
            status: false,
            message: ` There is an error`
        })
        .status(400)
    }
}

export const authentication = async(request:Request, response: Response) => {
    try{
        const {email, password } = request.body

        const findUser = await prisma.user.findFirst({
            where: {email, password: md5(password)},
        })     
        
        if ( !findUser )return response
           .status(200)
           .json({
            status: false,
            logged: false,
            message: `Email or password is invalid`
        })

        let data = {
            id: findUser.user_Id,
            name: findUser.nama_user,
            email: findUser.email,
            role: findUser.role
        }

        let payload = JSON.stringify(data)

        let token = sign(payload, SECRET || "token") //sign mengenerate token

        return response
        .status(200)
        .json({ status: true, logged: true, message: `Login Succes`, token })
 } catch (error) {
    return response
        .json({
            status: false,
            message: `There is an error. ${error}`
        })
        .status(400)
 }

}