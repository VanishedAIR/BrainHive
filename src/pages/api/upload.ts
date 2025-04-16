import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import path from "path";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, 
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({
    uploadDir: path.join(process.cwd(), "public/uploads"), 
    keepExtensions: true, 
    filename: (name, ext, part) => `${Date.now()}-${part.originalFilename}`, 
  });

  const uploadDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Error parsing the file:", err);
      return res.status(500).json({ error: "Failed to upload file" });
    }

    const fileArray = files.image; 
    if (!fileArray || !Array.isArray(fileArray) || fileArray.length === 0) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = fileArray[0]; 
    const fileUrl = `/uploads/${path.basename(file.filepath)}`;
    res.status(200).json({ url: fileUrl });
  });
}