import { prisma } from "../../../../lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.method === "DELETE") {
    const { id } = req.query;

    await prisma.product.delete({
      where: { id: Number(id) },
    });

    return res.json({ message: "Deleted" });
  }

  res.status(405).end();
}
