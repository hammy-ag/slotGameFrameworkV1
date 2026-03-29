import { defineConfig } from "vite";
import path from "path";
import fs from "fs";

export default defineConfig(({ mode }) => {
  const game = process.env.GAME;

  if (!game) {
    console.error("Error: No game specified. Please set the GAME environment variable.");
    process.exit(1);
  }

  const gamePath = path.resolve(process.cwd(), `src/games/${game}`);
  
  if (!fs.existsSync(gamePath)) {
     console.error(`Error: Game directory not found at ${gamePath}`);
     process.exit(1);
  }

  return {
    root: process.cwd(),
    base: "./",
    resolve: {
      alias: {
        "@core": path.resolve(process.cwd(), "src/core"),
        "@": path.resolve(process.cwd(), "src"),
      },
    },
    define: {
      __GAME__: JSON.stringify(game),
    },
    plugins: [
      {
        name: "game-redirect",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === "/" || req.url === "/index.html") {
              const gamePath = `/src/games/${game}/`;
              console.log(`> Redirecting to game: ${gamePath}`);
              res.writeHead(302, { Location: gamePath });
              res.end();
              return;
            }
            next();
          });
        },
      },
    ],
    build: {
      outDir: path.resolve(process.cwd(), `dist/${game}`),
      emptyOutDir: true,
      rollupOptions: {
        input: path.resolve(gamePath, "index.html"),
      },
    },
    server: {
      port: 5173,
      open: true,
    },
  };
});
