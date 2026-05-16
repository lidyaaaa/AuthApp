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
    const id = Number(req.query.id);

    // ================= DELETE =================
    if (req.method === "DELETE") {
      const item = await prisma.cartItem.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!item) {
        return res.status(404).json({ message: "Item tidak ditemukan" });
      }

      await prisma.cartItem.delete({
        where: { id },
      });

      return res.json({ message: "Item dihapus" });
    }

     // ================= UPDATE QUANTITY =================
     if (req.method === "PUT") {
       const { quantity, note } = req.body;

       const item = await prisma.cartItem.findFirst({
         where: {
           id,
           userId,
         },
       });

       if (!item) {
         return res.status(404).json({ message: "Item tidak ditemukan" });
       }

       // Validasi stok jika quantity diubah
       if (quantity !== undefined) {
         const newQty = Number(quantity);
         const product = await prisma.product.findUnique({
           where: { id: item.productId },
         });
         if (!product) {
           return res.status(404).json({ message: "Produk tidak ditemukan" });
         }
         if (newQty > product.stock) {
           return res.status(400).json({
             message: `Stok tidak cukup. Tersisa: ${product.stock}`,
           });
         }
         if (newQty <= 0) {
           await prisma.cartItem.delete({ where: { id } });
           return res.json({ message: "Item dihapus" });
         }
       }

       const updateData = {};
       if (quantity !== undefined) updateData.quantity = Number(quantity);
       if (note !== undefined) updateData.note = note;

        const updated = await prisma.cartItem.update({
          where: { id },
          data: updateData,
        });

        // Return with product relation
        const updatedWithProduct = await prisma.cartItem.findUnique({
          where: { id: updated.id },
          include: { product: true },
        });

        return res.json(updatedWithProduct);
      }

     return res.status(405).json({ message: "Method tidak diizinkan" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}