// pages/api/checkout.js

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: "Harus login" });
    }

    const userId = session.user.id;

    if (req.method === "POST") {
      const {
        address,
        note: orderNote,
        paymentMethod,
        paymentDetail,
        items,
      } = req.body;

      if (!address) {
        return res.status(400).json({ message: "Alamat wajib diisi" });
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Pilih minimal 1 barang" });
      }

      // Ambil cart items yang dipilih
      const cartItems = await prisma.cartItem.findMany({
        where: {
          userId,
          id: { in: items.map((i) => Number(i.id)) },
        },
        include: { product: true },
      });

      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart kosong" });
      }

      // Validasi stok on checkout
      for (let item of cartItems) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (!product) {
          return res.status(400).json({
            message: `Produk ${item.product.name} tidak ditemukan`,
          });
        }
        if (item.quantity > product.stock) {
          return res.status(400).json({
            message: `Stok ${item.product.name} tidak cukup (tersisa ${product.stock})`,
          });
        }
      }

      // Hitung total
      const total = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      // Transaksi
      await prisma.$transaction(async (tx) => {
        for (let item of cartItems) {
          const updatedProduct = await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });

          // ⚠️ Jika stock habis setelah checkout, notifikasi user lain
          if (updatedProduct.stock <= 0) {
            // Cari semua user yang punya item ini di cart
            const affectedCartItems = await tx.cartItem.findMany({
              where: {
                productId: item.productId,
                userId: { not: userId }, // kecuali user yang checkout
              },
              select: { userId: true },
              distinct: ["userId"],
            });

            const uniqueUserIds = [
              ...new Set(affectedCartItems.map((ci) => ci.userId)),
            ];

            for (const uid of uniqueUserIds) {
              await tx.notification.create({
                data: {
                  userId: uid,
                  title: `Stok Habis: ${item.product?.name}`,
                  message: `Maaf, produk "${item.product?.name}" sudah habis stok karena dipesan user lain. Item di keranjangmu mungkin tertunda.`,
                  type: "stock_out",
                  isRead: false,
                },
              });
            }
          }
        }

        await tx.order.create({
          data: {
            userId,
            total,
            status: "pending",
            note: orderNote || null,
            paymentMethod,
            paymentDetail: paymentDetail || null,
            orderItems: {
              create: cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price,
                note: item.note || null,
              })),
            },
          },
        });

        await tx.cartItem.deleteMany({
          where: {
            userId,
            id: { in: items.map((i) => Number(i.id)) },
          },
        });
      });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ message: "Method tidak diizinkan" });
  } catch (error) {
    console.log("CHECKOUT ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
}