import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import federation from "@originjs/vite-plugin-federation";
import * as path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "app",
      remotes: {
        remoteApp1: "http://localhost:5001/assets/remoteEntry1.js",
        remoteApp2: "http://localhost:5002/assets/remoteEntry2.js",
      },
      shared: ["react", "react-dom"],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/components/Pages"),
      "@templates": path.resolve(__dirname, "./src/components/Templates"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@routes": path.resolve(__dirname, "./src/Routes"),
      "@styles": path.resolve(__dirname, "./src/Styles"),
    },
  },
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
