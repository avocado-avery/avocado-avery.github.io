import { defineConfig } from "vite";
import { copyFileSync, mkdirSync } from "fs";
import { resolve } from "path";

export default defineConfig({
  base: "/",
  build: { 
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        github: resolve(__dirname, "github/index.html"),
        linkedin: resolve(__dirname, "linkedin/index.html"),
        resume: resolve(__dirname, "resume/index.html"),
      },
    },
  },
  publicDir: "res",
});
