import { Application as PixiApplication } from 'pixi.js';
import { PixiApp } from './wrappers/PixiApp';
import { PixiWrapperManager, WrapperType } from './wrappers/PixiWrapperManager';
import { EventManager } from './EventManager';
import { ServiceContainer } from './ServiceContainer';
import { AssetLoader } from './assets/AssetLoader';
import { ServiceKeys } from './services/ServiceKeys';

/**
 * Centralized Hub for the Slot Framework.
 * Provides access to the Pixi Application, Event Manager, and other core services.
 */
export class Application {
    private static instance: Application;
    
    private readonly _pixiApp: PixiApp;
    public readonly wrapperManager: PixiWrapperManager;
    public readonly events: EventManager;
    public readonly services: ServiceContainer;

    private constructor() {
        this.services = new ServiceContainer();
        this.services.register(ServiceKeys.assets, () => new AssetLoader(), { override: true });
        this.wrapperManager = new PixiWrapperManager();
        this._pixiApp = this.wrapperManager.createWrapper(WrapperType.APP);
        this.events = EventManager.getInstance();
    }

    /**
     * Get the singleton instance of Application
     */
    public static getInstance(): Application {
        if (!Application.instance) {
            Application.instance = new Application();
        }
        return Application.instance;
    }

    /**
     * The raw Pixi Application
     */
    public get app(): PixiApplication {
        return this._pixiApp.getApplication();
    }

    /**
     * The Pixi canvas element
     */
    public get canvas(): HTMLCanvasElement {
        return this.app.canvas as HTMLCanvasElement;
    }

    /**
     * Initialize the framework systems
     */
    public async init(config: {
        width?: number;
        height?: number;
        backgroundColor?: number;
        antialias?: boolean;
        parentElement?: HTMLElement;
        [key: string]: any;
    }): Promise<void> {
        console.log('Application: Starting initialization...');
        
        await this._pixiApp.init({
            width: config.width || 1280,
            height: config.height || 720,
            backgroundColor: config.backgroundColor || 0x000000,
            antialias: config.antialias !== undefined ? config.antialias : true,
            ...config
        } as any);

        // Expose for PixiJS DevTools
        (globalThis as any).__PIXI_APP__ = this.app;

        if (config.parentElement) {
            config.parentElement.appendChild(this.canvas);
        }

        console.log('Application: Systems ready.');
    }
}
