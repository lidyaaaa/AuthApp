import { getSession } from "next-auth/react";
import { prisma } from "../../../lib/prisma";   

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const carts = await prisma.cartItem.findMany({
      include: {
        user: true,
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(carts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching cart data" });
  }
}