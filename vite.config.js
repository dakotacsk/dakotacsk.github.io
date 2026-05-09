import { copyFileSync, cpSync, existsSync, mkdirSync } from "node:fs";
import { basename, resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const legacyDirs = [
  "alternative",
  "archive",
  "blogs",
  "img",
  "priv",
  "todo",
  "NB International Regular",
];

const legacyFiles = [
  "blog.html",
  "blog-post.html",
  "blog-engine.js",
  "script.js",
  "style.css",
  "blob-moving-bg.mp4",
  "blob-shape-moving-animated-gif-gif.gif",
  "CNAME",
  "Trial.ttf",
];

function copyLegacyStatic() {
  return {
    name: "copy-legacy-static",
    closeBundle() {
      const root = process.cwd();
      const outDir = resolve(root, "dist");
      mkdirSync(outDir, { recursive: true });

      legacyDirs.forEach((dir) => {
        const source = resolve(root, dir);
        if (!existsSync(source)) return;
        cpSync(source, resolve(outDir, dir), { recursive: true });
      });

      legacyFiles.forEach((file) => {
        const source = resolve(root, file);
        if (!existsSync(source)) return;
        copyFileSync(source, resolve(outDir, basename(file)));
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), copyLegacyStatic()],
});
