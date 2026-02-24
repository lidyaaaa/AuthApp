import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    const { id } = req.query;

    // ================= GET 1 PRODUCT =================
    if (req.method === "GET") {
      const product = await prisma.product.findUnique({
        where: { id: Number(id) },
      });

      if (!product) {
        return res.status(404).json({ message: "Produk tidak ditemukan" });
      }

      return res.json(product);
    }

    // ===== ADMIN ONLY BELOW =====
    if (!session || session.user.role !== "admin") {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    // ================= UPDATE PRODUCT =================
    if (req.method === "PUT") {
      const { name, price, image } = req.body;

      const existingProduct = await prisma.product.findUnique({
        where: { id: Number(id) },
      });

      if (!existingProduct) {
        return res.status(404).json({ message: "Produk tidak ditemukan" });
      }

      // AUTO DELETE IMAGE LAMA
      if (
        image &&
        existingProduct.image &&
        existingProduct.image !== image
      ) {
        const oldImagePath = path.join(
          process.cwd(),
          "public",
          existingProduct.image
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      const updatedProduct = await prisma.product.update({
        where: { id: Number(id) },
        data: {
          name,
          price: Number(price),
          image,
        },
      });

      return res.json(updatedProduct);
    }

    // ================= DELETE PRODUCT =================
    if (req.method === "DELETE") {
      const product = await prisma.product.findUnique({
        where: { id: Number(id) },
      });

      if (!product) {
        return res.status(404).json({ message: "Produk tidak ditemukan" });
      }

      if (product.image) {
        const imagePath = path.join(process.cwd(), "public", product.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await prisma.product.delete({
        where: { id: Number(id) },
      });

      return res.json({ message: "Produk dihapus" });
    }

    res.status(405).end();

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}