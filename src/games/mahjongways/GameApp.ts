import { Application } from '../../core/Application';
import { WrapperType } from '../../core/wrappers/PixiWrapperManager';

/**
 * GameApp handles the game-specific logic for Mahjong Ways.
 */
export class GameApp {
    private readonly application: Application;

    constructor() {
        this.application = Application.getInstance();
    }

    /**
     * Initialize game-specific systems, assets, etc.
     */
    public async init(): Promise<void> {
        console.log('MahjongWays: Initializing GameApp...');
    }

    /**
     * Start the game logic
     */
    public start(): void {
        console.log('MahjongWays: Starting Game...');
        
        const stage = this.application.app.stage;
        const screen = this.application.app.screen;

        // Try spine background first; fallback to solid color if assets are incomplete.
        try {
            const spineBg = this.application.wrapperManager.createWrapper(WrapperType.SPINE, {
                skeletonId: "mw.backLandscape.skeleton",
                atlasId: "mw.backLandscape.atlas",
                animation: "flowers",
                loop: true,
                skin: "day"
            });

            const spineObj = spineBg.getElement();
            spineObj.x = screen.width / 2;
            spineObj.y = screen.height / 2;

            // Skeleton export size from JSON header (width: 3118, height: 1442)
            const designW = 3118;
            const designH = 1442;
            const s = Math.max(screen.width / designW, screen.height / designH);
            spineObj.scale.set(s, s);

            stage.addChild(spineObj);
        } catch (e) {
            console.warn("Spine background failed to load. Missing atlas/png files?", e);
            const bg = this.application.wrapperManager.createWrapper(WrapperType.GRAPHICS);
            bg.drawRect(0, 0, screen.width, screen.height, { fillColor: 0x101018 });
            stage.addChild(bg.getGraphics());
        }

        const text = this.application.wrapperManager.createWrapper(WrapperType.TEXT, {
            text: `Mahjong Ways (assets ready)`,
            style: { fill: 0xFFFF00, fontSize: 32 }
        });
        text.setPosition(screen.width / 2, screen.height / 2);
        text.setAnchor(0.5, 0.5);
        stage.addChild(text.getElement());
    }
}
