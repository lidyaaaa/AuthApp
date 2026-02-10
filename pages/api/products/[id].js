import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// ⚠️ kita butuh authOptions yang sama seperti di [...nextauth]
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) throw new Error("User tidak ditemukan");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Password salah");

        return { id: user.id, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  console.log("SESSION DI API:", session);

  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const productId = Number(req.query.id);
  if (isNaN(productId)) {
    return res.status(400).json({ message: "ID tidak valid" });
  }

  try {
    if (req.method === "GET") {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!product) return res.status(404).json({ message: "Product not found" });
      return res.json(product);
    }

    if (req.method === "PUT") {
      const { name, price } = req.body;

      const updated = await prisma.product.update({
        where: { id: productId },
        data: { name, price: Number(price) },
      });

      return res.json(updated);
    }

    if (req.method === "DELETE") {
      await prisma.product.delete({ where: { id: productId } });
      return res.json({ message: "Produk berhasil dihapus" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}
