export default function handler(req, res) {
  res.json({
    database: !!process.env.DATABASE_URL,
    secret: !!process.env.NEXTAUTH_SECRET,
    url: process.env.NEXTAUTH_URL,
  });
}
