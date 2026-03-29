import { Launcher } from '../../core/Launcher';
import type { GameModule } from '../../core/GameModule';

/**
 * Mahjong Ways 1 Game Entry
 */
async function initGame() {
    const launcher = new Launcher();

    const gameModule: GameModule = {
        id: 'mahjongways1',
        configure: (config) => ({
            ...config,
            resizeMode: 'cover'
        }),
    };
    
    await launcher.launch({
        width: 1280,
        height: 720,
        backgroundColor: 0x000000,
        antialias: true,
        parentElement: document.body
    }, gameModule);

    // Game Logic Starts Here
    console.log('Mahjong Ways 1: Game Entry Started.');

    // Initialize and Start GameApp
    const { GameApp } = await import('./GameApp');
    const gameApp = new GameApp();
    
    await gameApp.init();
    gameApp.start();
}

initGame().catch(console.error);
