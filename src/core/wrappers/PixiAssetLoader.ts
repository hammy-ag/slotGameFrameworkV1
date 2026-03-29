import { Assets, Texture, Spritesheet } from 'pixi.js';

export class PixiAssetLoader {
    public static async loadTexture(url: string): Promise<Texture> {
        try {
            return await Assets.load(url);
        } catch (error) {
            console.error(`Failed to load texture: ${url}`, error);
            throw error;
        }
    }

    public static async loadSpritesheet(url: string, data: any): Promise<Spritesheet> {
        try {
            const texture = await Assets.load(url);
            const spritesheet = new Spritesheet(texture, data);
            await spritesheet.parse();
            return spritesheet;
        } catch (error) {
            console.error(`Failed to load spritesheet: ${url}`, error);
            throw error;
        }
    }

    public static async loadMultipleTextures(urls: string[]): Promise<Texture[]> {
        try {
            const textures = await Promise.all(urls.map(url => Assets.load(url)));
            return textures;
        } catch (error) {
            console.error('Failed to load multiple textures:', error);
            throw error;
        }
    }
}
