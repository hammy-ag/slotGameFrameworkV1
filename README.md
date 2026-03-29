# AI-Assisted Slot Game Framework

A modular, TypeScript-based framework for developing 2D canvas slot games.  
Built on top of PixiJS and optimized for Spine animations, this project uses a multi-app architecture allowing multiple distinct games to be developed and built from a single shared core repository.

This is a personal experimental project and is not derived from any proprietary or company codebase.

---

## Architecture Highlights

- **Core Library (`src/core/`)**  
  Contains shared wrappers (e.g., `PixiSpine.ts`), a centralized asset loader, and base application logic. Games import from this core rather than reinventing the wheel.

- **Multi-Game Structure (`src/games/`)**  
  Each game (e.g., `example-game`) operates as an independent entry point (`main.ts`), maintaining isolated logic while sharing the core engine.

- **Resource Management**  
  Implements structured cleanup via custom lifecycle methods (`destroy()`) to handle PixiJS and Spine assets, helping prevent memory leaks during game lifecycle events.

- **Responsive Canvas**  
  Configured with CSS resets and dynamic resizing logic to ensure games scale appropriately across different browser window sizes.

---

## AI-Assisted Development

AI was used as a development accelerator in this project:

- Assisting in initial architecture and project structuring  
- Accelerating asset loader design and modularization  
- Supporting debugging and iterative refinement  
- Helping explore scalable multi-game architecture patterns  

All AI-generated outputs were reviewed, modified, and adapted based on project requirements.

---

## Tech Stack

- **Rendering Engine**: PixiJS (v8)  
- **Animation**: Spine (via `@pixi/spine-pixi`)  
- **Language**: TypeScript (v5+)  
- **Bundler & Build Tool**: Vite (v7+)  
- **Environment**: Node.js  

---

## Project Structure

```text
/
├── scripts/                  # Custom CLI build and development scripts
├── src/
│   ├── core/                 # Shared logic, asset loaders, and wrappers
│   └── games/                # Individual game projects
│       └── example-game/     # Game-specific logic and entry point
├── gameassets/               # Centralized directory for visual and audio assets
└── package.json              # Shared dependencies & CLI commands

## CLI Commands & Build Instructions
The project utilizes custom CLI scripts built with `tsx` to handle development and production builds across multiple game directories.

### Install Dependencies

```bash
npm install
```

### Development
To run a specific game in development mode with Hot Module Replacement (HMR):

```bash
npm run dev <game_name>  # e.g., npm run dev mahjongways
```

### Production Builds
To generate a minified production bundle for a specific game:

```bash
npm run build <game_name>  # e.g., npm run build mahjongways
```

To build all games in the repository sequentially:

```bash
npm run build all
```
