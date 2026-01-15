import prisma from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user",
      },
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: "Email sudah terdaftar" });
  }
}
