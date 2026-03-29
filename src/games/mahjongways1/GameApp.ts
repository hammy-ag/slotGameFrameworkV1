import { Application } from '../../core/Application';
import { WrapperType } from '../../core/wrappers/PixiWrapperManager';

/**
 * GameApp handles the game-specific logic for Mahjong Ways 1.
 */
export class GameApp {
    private readonly application: Application;

    constructor() {
        this.application = Application.getInstance();
    }

    public async init(): Promise<void> {
        console.log('MahjongWays1: Initializing GameApp...');
    }

    public start(): void {
        console.log('MahjongWays1: Starting Game...');
        
        const stage = this.application.app.stage;
        const text = this.application.wrapperManager.createWrapper(WrapperType.TEXT, {
            text: 'Mahjong Ways 1 - GameApp Restored',
            style: { fill: 0x00FF00, fontSize: 32 }
        });
        text.setPosition(640, 400);
        text.setAnchor(0.5, 0.5);
        stage.addChild(text.getElement());
    }
}
