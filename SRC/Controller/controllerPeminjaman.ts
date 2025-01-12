import { request, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { error } from "console";

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getAllPeminjaman = async (
  request: Request,
  response: Response
) => {
  try {
    const { search } = request.query;
    const allPeminjaman = await prisma.transaksi.findMany({
      where: {
        OR: [{ nama_customer: { contains: search?.toString() || "" } }],
      },
      orderBy: { CreatedAt: "desc" },
      include: { detail_transaksi: true },
    });
    return response
      .json({
        status: true,
        data: allPeminjaman,
        message: `Borrow list has retrived`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `There is an error. ${error}`,
      })
      .status(400);
  }
};

export const createPeminjaman = async (
  request: Request,
  response: Response
) => {
  try {
    const { nama_customer, jenis_transaksi, statusBayar, detail_transaksi } =
      request.body;
    const user = request.body.user;
    const uuid = uuidv4();

    let total_harga = 0;
    for (let index = 0; index < detail_transaksi.length; index++) {
      const { buku_id } = detail_transaksi[index];
      const detailBuku = await prisma.buku.findFirst({
        where: {
          buku_Id: buku_id,
        },
      });

      if (!detailBuku)
        return response.status(200).json({
          status: false,
          message: `Buku with id ${buku_id} is not found`,
        });
      total_harga += detailBuku.harga_sewa * detail_transaksi[index].quantity;
    }

    const newPeminjaman = await prisma.transaksi.create({
      data: {
        uuid,
        nama_customer,
        jenis_transaksi,
        statusBayar,
        user_id: user.id,
      },
    });

    for (let index = 0; index < detail_transaksi.length; index++) {
      const uuid = uuidv4();
      const { buku_Id, quantity, note } = detail_transaksi[index];
      await prisma.detail_transaksi.create({
        data: {
          uuid,
          transaksi_Id: newPeminjaman.transaksi_Id,
          buku_Id: Number(buku_Id),
          kuantitas: Number(quantity),
        },
      });
    }

    return response
      .json({
        status: true,
        data: newPeminjaman,
        message: `There is an error. ${error}`,
      })
      .status(400);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `There is an error. ${error}`,
      })
      .status(400);
  }
};

export const updateStatusPeminjaman = async (
  request: Request,
  response: Response
) => {
  try {
    const { id } = request.params;

    const { statusBayar } = request.body;
    const user = request.body.user;

    const findPeminjaman = await prisma.transaksi.findFirst({
      where: { transaksi_Id: Number(id) },
    });

    if (!findPeminjaman)
      return response
        .status(200)
        .json({ status: false, message: `Borrowing is not found` });

    const updateStatusPeminjaman = await prisma.transaksi.update({
      data: {
        statusBayar: statusBayar || findPeminjaman.statusBayar,
        user_id: user.id ? user.id : findPeminjaman.user_id,
      },
      where: { transaksi_Id: Number(id) },
    });

    return response
      .json({
        status: true,
        data: updateStatusPeminjaman,
        message: `Borrowing has updated`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `There is an error. ${error}`,
      })
      .status(400);
  }
};

export const deletePeminjaman = async (
  request: Request,
  response: Response
) => {
  try {
    const { id } = request.params;
    const findPeminjaman = await prisma.transaksi.findFirst({
      where: { transaksi_Id: Number(id) },
    });
    if (!findPeminjaman)
      return response
        .status(200)
        .json({ status: false, message: `Borrowing is not found` });

    let deletePeminjamanList = await prisma.transaksi.delete({
      where: { transaksi_Id: Number(id) },
    });

    return response
      .json({
        status: true,
        data: deletePeminjaman,
        message: `Borrowing has deleted`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `There is an error. ${error}`,
      })
      .status(400);
  }
};
