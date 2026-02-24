import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    // ===== GET =====
    if (req.method === "GET") {
      const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(products);
    }

    // ===== POST =====
    if (req.method === "POST") {
      console.log("BODY MASUK:", req.body);

      if (!session) {
        return res.status(401).json({ message: "Belum login" });
      }

      if (session.user.role !== "admin") {
        return res.status(403).json({ message: "Bukan admin" });
      }

      const name = req.body?.name;
      const price = req.body?.price;
      const image = req.body?.image || null;

      if (!name || !price) {
        return res.status(400).json({
          message: "Name atau price kosong",
        });
      }

      const product = await prisma.product.create({
        data: {
          name: String(name),
          price: Number(price),
          image: image,
        },
      });

      return res.status(201).json(product);
    }

    return res.status(405).json({ message: "Method tidak diizinkan" });

  } catch (error) {
    console.error("❌ ERROR DETAIL:", error);

    return res.status(500).json({
      message: "Server error",
      error: String(error),
    });
  }
}