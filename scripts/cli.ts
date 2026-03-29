import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
const command = args[0];
const targets = args.slice(1);

const GAMES_DIR = path.resolve(process.cwd(), "src/games");

if (!command) {
  console.error("Usage: npm run <dev|build> -- <game|all>");
  process.exit(1);
}

function getAvailableGames() {
  if (!fs.existsSync(GAMES_DIR)) return [];
  return fs.readdirSync(GAMES_DIR).filter((file) => {
    return fs.statSync(path.join(GAMES_DIR, file)).isDirectory();
  });
}

function runVite(cmd: string, game: string) {
  const isDev = cmd === "dev";
  // For dev, we usually only run one game at a time interactively

  console.log(`\n> Running ${cmd} for game: ${game}...`);

  const child = spawn("npx", ["vite", ...(isDev ? [] : ["build"]), "--mode", "development"], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, GAME: game },
  });

  child.on("close", (code) => {
    if (code !== 0) {
      console.error(`Process exited with code ${code}`);
    }
  });
}

if (command === "dev") {
  if (targets.length === 0) {
    console.error("Please specify a game to run: npm run dev -- <game_name>");
    console.log("Available games:", getAvailableGames().join(", "));
    process.exit(1);
  }
  
  const game = targets[0];
  const validGames = getAvailableGames();
  
  if (!validGames.includes(game)) {
    console.error(`Game '${game}' not found in src/games.`);
    console.log("Available games:", validGames.join(", "));
    process.exit(1);
  }

  runVite("dev", game);

} else if (command === "build") {
  const target = targets[0] || "all"; // Default to all? Or complain? User said "npm run build all"

  if (target === "all") {
    const games = getAvailableGames();
    console.log(`Building all ${games.length} games...`);
    
    // Build sequentially to avoid console interleaving mess
    (async () => {
        for (const game of games) {
            await new Promise<void>((resolve, reject) => {
                console.log(`\nBuilding ${game}...`);
                const child = spawn("npx", ["vite", "build"], {
                    stdio: "inherit",
                    shell: true,
                    env: { ...process.env, GAME: game },
                });
                child.on('close', (code) => {
                    if (code === 0) resolve();
                    else reject(new Error(`Build failed for ${game}`));
                });
            });
        }
        console.log("All builds completed.");
    })().catch(err => {
        console.error(err);
        process.exit(1);
    });

  } else {
    // Build specific game(s)
    // User said "multiple like mahjongways mahjongways2"
    // So targets can be a list
    const gamesToBuild = targets.length > 0 ? targets : []; // If no target, maybe fail?

    if (gamesToBuild.length === 0) {
        console.error("Usage: npm run build -- <game1> [game2] ... OR npm run build -- all");
        process.exit(1);
    }
    
    // Check validity
    const available = getAvailableGames();
    const invalid = gamesToBuild.filter(g => !available.includes(g));
    if (invalid.length > 0) {
        console.error(`Invalid game(s): ${invalid.join(", ")}`);
        console.log("Available:", available.join(", "));
        process.exit(1);
    }

    // Build sequentially
     (async () => {
        for (const game of gamesToBuild) {
             await new Promise<void>((resolve, reject) => {
                console.log(`\nBuilding ${game}...`);
                const child = spawn("npx", ["vite", "build"], {
                    stdio: "inherit",
                    shell: true,
                    env: { ...process.env, GAME: game },
                });
                child.on('close', (code) => {
                    if (code === 0) resolve();
                    else reject(new Error(`Build failed for ${game}`));
                });
            });
        }
    })();
  }
}
