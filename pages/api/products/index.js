import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // GET → semua user boleh lihat
  if (req.method === "GET") {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.json(products);
  }

  // POST → admin only
  if (req.method === "POST") {
    if (!session || session.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { name, price } = req.body;

    const product = await prisma.product.create({
      data: { name, price: Number(price) },
    });

    return res.json(product);
  }

  res.status(405).end();
}
