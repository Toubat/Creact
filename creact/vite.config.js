import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    minify: false,
  },
  esbuild: {
    jsxInject: `import Creact from './core/creact'`,
    jsxFragment: "Creact.Fragment",
    jsxFactory: "Creact.createElement",
  },
});
