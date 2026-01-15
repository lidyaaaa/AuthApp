import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/react";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  const session = await getSession({ req });

  // 🔐 WAJIB ADMIN
  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  // 🔍 GET — ambil semua user
  if (req.method === "GET") {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
    return res.json(users);
  }

  // ➕ POST — tambah user
  if (req.method === "POST") {
    const { email, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role,
      },
    });

    return res.json(user);
  }

  // ❌ DELETE — hapus user
  if (req.method === "DELETE") {
    const { id } = req.body;

    await prisma.user.delete({
      where: { id },
    });

    return res.json({ message: "User deleted" });
  }

  res.status(405).end();
}
