import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { folderPath } = body;

    if (!folderPath) {
      return NextResponse.json({ error: "Missing folderPath parameter" }, { status: 400 });
    }

    const cleanPath = folderPath.trim();
    if (!fs.existsSync(cleanPath)) {
      return NextResponse.json({ error: `Directory does not exist on disk: ${cleanPath}` }, { status: 404 });
    }

    const htmlPath = path.join(cleanPath, "article.html");
    if (!fs.existsSync(htmlPath)) {
      return NextResponse.json({ error: "Could not find article.html inside the directory" }, { status: 404 });
    }

    let htmlContent = fs.readFileSync(htmlPath, "utf-8");

    // Define target public images directory in the Next.js project
    const targetImagesDir = path.join(process.cwd(), "public", "images");
    if (!fs.existsSync(targetImagesDir)) {
      fs.mkdirSync(targetImagesDir, { recursive: true });
    }

    // 1. Scan and copy images from 'images' subfolder to public/images/
    const imagesDirPath = path.join(cleanPath, "images");
    if (fs.existsSync(imagesDirPath)) {
      const imageFiles = fs.readdirSync(imagesDirPath);
      imageFiles.forEach((filename) => {
        const imgPath = path.join(imagesDirPath, filename);
        const ext = path.extname(filename).toLowerCase().replace(".", "");
        if (["png", "jpg", "jpeg", "webp", "gif"].includes(ext)) {
          // Copy image file to public/images/
          const destPath = path.join(targetImagesDir, filename);
          fs.copyFileSync(imgPath, destPath);

          // Update HTML path to point to /images/filename
          const escapedName = filename.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
          const regex = new RegExp(`src=["'](?:images\\/|\\.\\/images\\/)?${escapedName}["']`, "gi");
          htmlContent = htmlContent.replace(regex, `src="/images/${filename}"`);
        }
      });
    }

    // 2. Scan and copy images from root article folder to public/images/
    const rootFiles = fs.readdirSync(cleanPath);
    rootFiles.forEach((filename) => {
      const imgPath = path.join(cleanPath, filename);
      if (fs.statSync(imgPath).isFile()) {
        const ext = path.extname(filename).toLowerCase().replace(".", "");
        if (["png", "jpg", "jpeg", "webp", "gif"].includes(ext)) {
          const destPath = path.join(targetImagesDir, filename);
          fs.copyFileSync(imgPath, destPath);

          const escapedName = filename.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
          const regex = new RegExp(`src=["']${escapedName}["']`, "gi");
          htmlContent = htmlContent.replace(regex, `src="/images/${filename}"`);
        }
      }
    });

    return NextResponse.json({ html: htmlContent });
  } catch (err: any) {
    console.error("Local import API handler error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
