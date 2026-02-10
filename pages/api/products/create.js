import { prisma } from "@/lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.method === "POST") {
    const { name, price } = req.body;

    if (!name || price == null) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const product = await prisma.product.create({
      data: { name, price: Number(price) },
    });

    return res.status(201).json(product);
  }

  res.status(405).end();
}
