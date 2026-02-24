import { prisma } from "@/lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  // 🔐 Admin only
  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const id = Number(req.query.id);

  // 🔍 GET detail
  if (req.method === "GET") {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    return res.json(product);
  }

  // ✏️ UPDATE (SEKARANG SUPPORT FOTO)
  if (req.method === "PUT") {
    const { name, price, image } = req.body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        price: Number(price),
        image, // ← INI YANG DITAMBAH
      },
    });

    return res.json(updated);
  }

  // ❌ DELETE
  if (req.method === "DELETE") {
    await prisma.product.delete({ where: { id } });
    return res.json({ message: "Product deleted" });
  }

  res.status(405).end();
}