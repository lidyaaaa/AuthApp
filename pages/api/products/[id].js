import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const id = Number(req.query.id);

  if (req.method === "PUT") {
    const { name, price } = req.body;
    const product = await prisma.product.update({
      where: { id },
      data: { name, price: Number(price) },
    });
    return res.status(200).json(product);
  }

  if (req.method === "DELETE") {
    await prisma.product.delete({ where: { id } });
    return res.status(204).end();
  }

  res.status(405).end();
}
