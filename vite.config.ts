import { defineConfig } from "vite";
import { resolve } from "path";
import { copyFileSync, mkdirSync, existsSync } from "fs";

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
  plugins: [
    {
      name: 'copy-resume',
      closeBundle() {
        const resumeDir = resolve(__dirname, 'dist/resume');
        if (!existsSync(resumeDir)) {
          mkdirSync(resumeDir, { recursive: true });
        }
        copyFileSync(
          resolve(__dirname, 'resume/resume.pdf'),
          resolve(__dirname, 'dist/resume/resume.pdf')
        );
      }
    }
  ]
});
