import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: "Harus login" });
    }

    const userId = session.user.id;

     // ================= ADD TO CART =================
     if (req.method === "POST") {
       const { productId, quantity = 1 } = req.body;

       if (!productId) {
         return res.status(400).json({ message: "Product ID wajib" });
       }

       // Validasi stok
       const product = await prisma.product.findUnique({
         where: { id: Number(productId) },
       });

       if (!product) {
         return res.status(404).json({ message: "Produk tidak ditemukan" });
       }

       const requestedQty = Number(quantity);
       if (requestedQty > product.stock) {
         return res.status(400).json({
           message: `Stok tidak cukup. Tersisa: ${product.stock}`,
         });
       }

       const existing = await prisma.cartItem.findFirst({
         where: {
           userId,
           productId: Number(productId),
         },
       });

        if (existing) {
          const newQty = existing.quantity + requestedQty;
          if (newQty > product.stock) {
            return res.status(400).json({
              message: `Stok tidak cukup. Total di keranjang akan ${newQty}, tersisa ${product.stock}`,
            });
          }

          const updated = await prisma.cartItem.update({
            where: { id: existing.id },
            data: { quantity: newQty },
          });

          // Return with product
          const updatedWithProduct = await prisma.cartItem.findUnique({
            where: { id: updated.id },
            include: { product: true },
          });
          return res.status(200).json(updatedWithProduct);
        }

        const item = await prisma.cartItem.create({
          data: {
            userId,
            productId: Number(productId),
            quantity: requestedQty,
          },
        });

        // Return with product
        const createdWithProduct = await prisma.cartItem.findUnique({
          where: { id: item.id },
          include: { product: true },
        });
        return res.status(201).json(createdWithProduct);
     }

    // ================= GET CART =================
    if (req.method === "GET") {
      const items = await prisma.cartItem.findMany({
        where: { userId },
        include: {
          product: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json(items);
    }

    return res.status(405).json({ message: "Method tidak diizinkan" });

  } catch (error) {
    console.log("CART ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
}