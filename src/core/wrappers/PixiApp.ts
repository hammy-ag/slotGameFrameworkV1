import { Application, ApplicationOptions } from 'pixi.js';

export class PixiApp {
    private app: Application;

    constructor() {
        this.app = new Application();
    }

    public async init(config: ApplicationOptions): Promise<void> {
        await this.app.init({
            width: 800,
            height: 600,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
            ...config
        });
    }

    public getApplication(): Application {
        return this.app;
    }

    public getCanvas(): HTMLCanvasElement {
        return this.app.canvas;
    }

    public getStage() {
        return this.app.stage;
    }

    public getScreen(): { width: number; height: number } {
        return this.app.screen;
    }

    public resize(width: number, height: number): void {
        this.app.renderer.resize(width, height);
    }

    public destroy(): void {
        this.app.destroy(true, { children: true, texture: true });
    }
}
