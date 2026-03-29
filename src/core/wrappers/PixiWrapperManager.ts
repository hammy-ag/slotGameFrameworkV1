import { PixiApp } from './PixiApp';
import { PixiContainer } from './PixiContainer';
import { PixiGraphics } from './PixiGraphics';
import { PixiSprite } from './PixiSprite';
import { PixiText } from './PixiText';
import { PixiSpritesheet } from './PixiSpritesheet';
import { PixiAnimatedSprite } from './PixiAnimatedSprite';
import { PixiAssetLoader } from './PixiAssetLoader';
import { PixiSpine } from './PixiSpine';

export enum WrapperType {
    APP = 'app',
    CONTAINER = 'container',
    GRAPHICS = 'graphics',
    SPRITE = 'sprite',
    TEXT = 'text',
    SPRITESHEET = 'spritesheet',
    ANIMATED_SPRITE = 'animated_sprite',
    ASSET_LOADER = 'asset_loader',
    SPINE = 'spine'
}

type WrapperConfigMap = {
    [WrapperType.APP]: undefined;
    [WrapperType.CONTAINER]: undefined;
    [WrapperType.GRAPHICS]: undefined;
    [WrapperType.SPRITE]: ConstructorParameters<typeof PixiSprite>[0];
    [WrapperType.TEXT]: ConstructorParameters<typeof PixiText>[0];
    [WrapperType.SPRITESHEET]: undefined;
    [WrapperType.ANIMATED_SPRITE]: ConstructorParameters<typeof PixiAnimatedSprite>[0];
    [WrapperType.ASSET_LOADER]: undefined;
    [WrapperType.SPINE]: ConstructorParameters<typeof PixiSpine>[0];
};

type WrapperInstanceMap = {
    [WrapperType.APP]: PixiApp;
    [WrapperType.CONTAINER]: PixiContainer;
    [WrapperType.GRAPHICS]: PixiGraphics;
    [WrapperType.SPRITE]: PixiSprite;
    [WrapperType.TEXT]: PixiText;
    [WrapperType.SPRITESHEET]: PixiSpritesheet;
    [WrapperType.ANIMATED_SPRITE]: PixiAnimatedSprite;
    [WrapperType.ASSET_LOADER]: typeof PixiAssetLoader;
    [WrapperType.SPINE]: PixiSpine;
};

type Destroyable = {
    destroy?: (...args: any[]) => void;
};

export class PixiWrapperManager {
    private wrappers: Map<string, unknown> = new Map();

    /**
     * Create a new Pixi.js wrapper instance
     */
    public createWrapper<T extends WrapperType>(type: T, config?: WrapperConfigMap[T]): WrapperInstanceMap[T] {
        switch (type) {
            case WrapperType.APP:
                return new PixiApp() as WrapperInstanceMap[T];

            case WrapperType.CONTAINER:
                return new PixiContainer() as WrapperInstanceMap[T];

            case WrapperType.GRAPHICS:
                return new PixiGraphics() as WrapperInstanceMap[T];

            case WrapperType.SPRITE:
                return new PixiSprite(config as WrapperConfigMap[WrapperType.SPRITE]) as WrapperInstanceMap[T];

            case WrapperType.TEXT:
                return new PixiText(config as WrapperConfigMap[WrapperType.TEXT]) as WrapperInstanceMap[T];

            case WrapperType.SPRITESHEET:
                return new PixiSpritesheet() as WrapperInstanceMap[T];

            case WrapperType.ANIMATED_SPRITE:
                return new PixiAnimatedSprite(config as WrapperConfigMap[WrapperType.ANIMATED_SPRITE]) as WrapperInstanceMap[T];

            case WrapperType.ASSET_LOADER:
                return PixiAssetLoader as WrapperInstanceMap[T];

            case WrapperType.SPINE:
                return new PixiSpine(config as WrapperConfigMap[WrapperType.SPINE]) as WrapperInstanceMap[T];

            default:
                throw new Error(`Unknown wrapper type: ${type}`);
        }
    }

    /**
     * Escape hatch for dynamic cases (keeps old behavior available).
     * Prefer `createWrapper()` whenever possible.
     */
    public createWrapperUnsafe(type: WrapperType, config?: any): any {
        return this.createWrapper(type as any, config as any);
    }

    /**
     * Create and store a wrapper with a specific ID
     */
    public createAndStoreWrapper<T extends WrapperType>(id: string, type: T, config?: WrapperConfigMap[T]): WrapperInstanceMap[T] {
        const wrapper = this.createWrapper(type, config);
        this.wrappers.set(id, wrapper);
        return wrapper;
    }

    /**
     * Get a stored wrapper by ID
     */
    public getWrapper<T = unknown>(id: string): T | undefined {
        return this.wrappers.get(id) as T | undefined;
    }

    /**
     * Remove a wrapper by ID
     */
    public removeWrapper(id: string): boolean {
        const wrapper = this.wrappers.get(id) as Destroyable | undefined;
        if (wrapper?.destroy) {
            wrapper.destroy();
        }
        return this.wrappers.delete(id);
    }

    /**
     * Create graphics with specific shapes
     */
    public createGraphicsShape(shape: 'rect' | 'circle' | 'roundedRect', config: any): PixiGraphics {
        const graphics = new PixiGraphics();
        
        switch (shape) {
            case 'rect':
                graphics.drawRect(
                    config.x || 0,
                    config.y || 0,
                    config.width || 100,
                    config.height || 100,
                    config.style
                );
                break;

            case 'circle':
                graphics.drawCircle(
                    config.x || 0,
                    config.y || 0,
                    config.radius || 50,
                    config.style
                );
                break;

            case 'roundedRect':
                graphics.drawRoundedRect(
                    config.x || 0,
                    config.y || 0,
                    config.width || 100,
                    config.height || 100,
                    config.radius || 10,
                    config.style
                );
                break;
        }

        return graphics;
    }

    /**
     * Create a button with graphics and text
     */
    public createButton(config: {
        text: string;
        width: number;
        height: number;
        backgroundColor?: number;
        textColor?: number;
        fontSize?: number;
    }): { container: PixiContainer; graphics: PixiGraphics; text: PixiText } {
        const container = new PixiContainer();
        const graphics = new PixiGraphics();
        const text = new PixiText({
            text: config.text,
            style: {
                fontFamily: 'Arial',
                fontSize: config.fontSize || 16,
                fill: config.textColor || 0xFFFFFF
            },
            anchor: { x: 0.5, y: 0.5 }
        });

        // Create button background
        graphics.drawRoundedRect(0, 0, config.width, config.height, 10, {
            fillColor: config.backgroundColor || 0x4CAF50,
            lineColor: 0x2E7D32,
            lineWidth: 2
        });

        // Position text in center
        text.setPosition(config.width / 2, config.height / 2);

        // Add to container
        container.addChild(graphics.getGraphics());
        container.addChild(text.getText());

        return { container, graphics, text };
    }

    /**
     * Create a symbol for slot machine
     */
    public createSymbol(config: {
        type: string;
        size: number;
        color: number;
        borderColor?: number;
    }): PixiGraphics {
        const graphics = new PixiGraphics();
        
        graphics.drawRoundedRect(0, 0, config.size, config.size, 8, {
            fillColor: config.color,
            lineColor: config.borderColor || 0x2C3E50,
            lineWidth: 2
        });

        return graphics;
    }

    /**
     * Load assets using the asset loader
     */
    public async loadAssets(assets: Array<{ id: string; url: string; type: 'texture' | 'spritesheet' }>): Promise<Map<string, any>> {
        const loadedAssets = new Map<string, any>();

        for (const asset of assets) {
            try {
                switch (asset.type) {
                    case 'texture':
                        const texture = await PixiAssetLoader.loadTexture(asset.url);
                        loadedAssets.set(asset.id, texture);
                        break;

                    case 'spritesheet':
                        // For spritesheets, you'd need the JSON data
                        console.warn('Spritesheet loading requires JSON data');
                        break;
                }
            } catch (error) {
                console.error(`Failed to load asset ${asset.id}:`, error);
            }
        }

        return loadedAssets;
    }

    /**
     * Clean up all wrappers
     */
    public destroyAll(): void {
        this.wrappers.forEach((wrapper) => {
            const d = wrapper as Destroyable | undefined;
            if (d?.destroy) {
                d.destroy();
            }
        });
        this.wrappers.clear();
    }

    /**
     * Get all wrapper IDs
     */
    public getWrapperIds(): string[] {
        return Array.from(this.wrappers.keys());
    }

    /**
     * Get wrapper count
     */
    public getWrapperCount(): number {
        return this.wrappers.size;
    }
}
