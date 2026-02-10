import { prisma } from "../../../../lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  // GET semua produk
  if (req.method === "GET") {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.json(products);
  }

  // POST tambah produk
  if (req.method === "POST") {
    const { name, price } = req.body;

    const product = await prisma.product.create({
      data: { name, price: Number(price) },
    });

    return res.json(product);
  }

  res.status(405).end();
}
