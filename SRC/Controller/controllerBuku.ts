import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"
import { BASE_URL } from "../global"
import fs from "fs"


const prisma = new PrismaClient({ errorFormat: "pretty"})

export const getAllBuku = async ( request: Request, response: Response ) => {
    try {
        const { search } = request.query

        const allBuku =  await prisma.buku.findMany({
            where: { judul: { contains: search?.toString() || ""}}
        })
        
        return response.json({
            status: true,
            data: allBuku,
            message: `List has retrived`
        }).status(200)
    } catch (error) {
        return response
           .json({
            status: false,
            message: `There is an error. ${error}`
           })
           .status
        }
}

export const createBuku = async (request: Request, response: Response) => {
    try{
        const {judul, pengarang, tahun_terbit, stok, harga_sewa, jenis} = request.body
        const uuid = uuidv4()

        const newBuku = await prisma.buku.create({
            data: { uuid, judul, pengarang, tahun_terbit, stok, harga_sewa: Number(harga_sewa), jenis }
        })

        return response.json({
            status: true,
            data: newBuku,
            messgae: `New book has created`
        }).status(200)
    }catch (error) {
        return response
        .json({
            status: false,
            messgae: `There is an error. ${error}`
        }).status(400)
    }
}

export const updateBuku = async (request: Request, response: Response) => {
    try {
        const { id } = request.params
        const { judul, pengarang, tahun_terbit, stok, harga_sewa, jenis } = request.body

        const findBuku = await prisma.buku.findFirst({where: {buku_Id: Number(id)}})
        if (!findBuku) {
            return response
            .status(200)
            .json({ status: false, message: `Book is not found`})
        }
        
        const updateBuku = await prisma.buku.update({
            data: {
                judul: judul || findBuku.judul,
                pengarang: pengarang || findBuku.pengarang,
                tahun_terbit: tahun_terbit || findBuku.tahun_terbit,
                stok: stok ? Number(stok) : findBuku.stok,
                harga_sewa: harga_sewa ? Number(harga_sewa) : findBuku.harga_sewa,
                jenis: jenis || findBuku.jenis
            },
            where: {buku_Id: Number(id)}
        })

        return response.json({
            status: true,
            data: updateBuku,
            message: `Book has updated`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error .${error}`
            })
            .status(400)
    }
}

export const changeBookPicture = async (request: Request, response: Response) => {
    try{
        const { id } = request.params

        const findBuku = await prisma.buku.findFirst({where: {buku_Id: Number(id)}})
        if (!findBuku) return response
             .status(200)
             .json({status: false, message: `Picture is not found`})

             let filename = findBuku.picture
             if (request.file) {
                filename = request.file.filename

                let path = `${BASE_URL}/../public/buku_picture/${findBuku.picture}`
                let exist = fs.existsSync(path)

                if (exist && findBuku.picture !== ``) fs.unlinkSync(path)
            }
            
            const updateBuku = await prisma.buku.update({
                data: { picture: filename},
                where: {buku_Id: Number(id)}
            })

            return response.json({
                status: true,
                data: updateBuku,
                message: `Book picture has changed`
            }).status(200)
    } catch ( error ) {
        return response.json({
            status: false,
            message: `There is an error. ${error}`
        }).status(400)
    }
}

export const deleteBuku = async(request: Request, response: Response) => {
    try {
        const { id } = request.params

        const findBuku = await prisma.buku.findFirst({ where: {buku_Id: Number(id)}})
        if (!findBuku) return response
        .status(200)
        .json({status: false, message: `Book is not found`})

        let path = `${BASE_URL}/../public/buku_picture/${findBuku.picture}`
        let exist = fs.existsSync(path)
        if (exist && findBuku.picture !== ``) fs.unlinkSync(path)

        const deleteBuku = await prisma.buku.delete({
            where: { buku_Id: Number(id)}
        })
        return response.json({
            status: true,
            data: deleteBuku,
            message: `Book has deleted`
        }).status(200)
    }catch (error) {
        return response.json({
            status: false,
            message: `There is an error`
        })
        .status(400)
        
    }
}
