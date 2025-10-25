import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig(async () => ({
  plugins: [preact(), tailwindcss(), nitro()],
  clearScreen: false,
  nitro: {
    preset: "node_server",
  },
}));
