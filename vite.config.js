import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import path from "node:path";

export default ({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  // https://vitejs.dev/config/
  return defineConfig({
    plugins: [svgr(), react()],
    server: {
      proxy: {
        "/proxy": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy/, ""),
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@contexts": path.resolve(__dirname, "./src/contexts"),
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@axios": path.resolve(__dirname, "./src/axios"),
        "@utils": path.resolve(__dirname, "./src/utils"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@constants": path.resolve(__dirname, "./src/constants.js"),
        "@pages": path.resolve(__dirname, "./src/pages"),
      },
    },
  });
};
