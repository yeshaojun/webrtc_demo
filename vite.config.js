import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: "0.0.0.0",
    proxy: {
      "/socket.io/": {
        target: "http://192.168.3.5:3000",
        changeOrigin: true,
        secure: false,
        // pathRewrite: {
        //   "/socket.io": "socket.io",
        // },
      },
    },
  },
});
