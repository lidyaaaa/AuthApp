import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  const { id } = req.query;
  const productId = Number(id);

  try {
    const session = await getServerSession(req, res, authOptions);

    // ================= GET PRODUCT =================
    if (req.method === "GET") {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return res.status(404).json({ message: "Produk tidak ditemukan" });
      }

      return res.status(200).json(product);
    }

    // ===== ADMIN ONLY =====
    if (!session || session.user.role !== "admin") {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    // ================= UPDATE PRODUCT =================
    if (req.method === "PUT") {
      const { name, price, image } = req.body;

      const existingProduct = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!existingProduct) {
        return res.status(404).json({ message: "Produk tidak ditemukan" });
      }

      // hapus gambar lama jika diganti
      if (
        image &&
        existingProduct.image &&
        existingProduct.image !== image
      ) {
        const oldImagePath = path.join(
          process.cwd(),
          "public",
          existingProduct.image.replace(/^\/+/, "")
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: {
          name,
          price: Number(price),
          image,
        },
      });

      return res.status(200).json(updatedProduct);
    }

    // ================= DELETE PRODUCT =================
    if (req.method === "DELETE") {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return res.status(404).json({ message: "Produk tidak ditemukan" });
      }

      // 1️⃣ hapus semua cart item yang memakai produk ini
      await prisma.cartItem.deleteMany({
        where: {
          productId: productId,
        },
      });

      // 2️⃣ hapus gambar jika ada
      if (product.image) {
        const imagePath = path.join(
          process.cwd(),
          "public",
          product.image.replace(/^\/+/, "")
        );

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      // 3️⃣ hapus produk
      await prisma.product.delete({
        where: { id: productId },
      });

      return res.status(200).json({
        message: "Produk berhasil dihapus",
      });
    }

    return res.status(405).json({ message: "Method tidak diizinkan" });

  } catch (error) {
    console.error("ERROR API PRODUCT:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
