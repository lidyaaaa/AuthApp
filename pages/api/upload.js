import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const form = formidable({ multiples: false });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Upload gagal" });
      }

      let file = files.image;

      if (Array.isArray(file)) {
        file = file[0];
      }

      if (!file) {
        return res.status(400).json({ error: "File tidak ditemukan" });
      }

      const uploadDir = path.join(process.cwd(), "public/uploads");

      // 🔥 FIX: bikin folder kalau belum ada
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const data = fs.readFileSync(file.filepath);

      const fileName = Date.now() + "_" + file.originalFilename;
      const uploadPath = path.join(uploadDir, fileName);

      fs.writeFileSync(uploadPath, data);

      return res.status(200).json({
        path: "/uploads/" + fileName,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
}