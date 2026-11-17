import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const entry = fileURLToPath(new URL("./src/index.js", import.meta.url));

export default defineConfig(({ command }) => {
  // `npm run dev` -> demo app
  if (command === "serve") {
    return { root: "demo", plugins: [react()], server: { open: false } };
  }

  // `npm run build` -> library bundle in /dist
  return {
    plugins: [react()],
    build: {
      outDir: "dist",
      emptyOutDir: true,
      cssCodeSplit: false,
      lib: {
        entry,
        formats: ["es", "cjs"],
        fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
        cssFileName: "style",
      },
      rollupOptions: {
        external: ["react", "react-dom", "react/jsx-runtime"],
      },
    },
  };
});
