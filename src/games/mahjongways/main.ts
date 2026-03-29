import { Launcher } from '../../core/Launcher';
import type { GameModule } from '../../core/GameModule';
import { assetConfig } from "./assetConfig";
import { AssetBundlesModule } from "../../core/modules/AssetBundlesModule";
import { AssetPreloadModule } from "../../core/modules/AssetPreloadModule";
import { PreloaderModule } from "../../core/modules/PreloaderModule";

/**
 * Mahjong Ways Game Entry
 */
async function initGame() {
    const launcher = new Launcher();

    const gameModule: GameModule = {
        id: 'mahjongways',
        modules: [
            // Framework-wide opt-in modules (won’t affect other games)
            new AssetBundlesModule(assetConfig),
            new PreloaderModule({ title: "Loading Mahjong Ways" }),
            new AssetPreloadModule(assetConfig.startupBundles ?? ["mahjongways"]),
        ],
        configure: (config) => ({
            ...config,
            // Choose per-game scaling strategy without touching core.
            resizeMode: 'cover'
        }),
    };
    
    // Launch the framework with standard setup
    await launcher.launch({
        width: 1280,
        height: 720,
        backgroundColor: 0x000000,
        antialias: true,
        parentElement: document.body
    }, gameModule);

    // Game Logic Starts Here
    console.log('Mahjong Ways: Game Entry Started.');

    // Initialize and Start GameApp
    const { GameApp } = await import('./GameApp');
    const gameApp = new GameApp();
    
    await gameApp.init();
    gameApp.start();
}

initGame().catch(console.error);
