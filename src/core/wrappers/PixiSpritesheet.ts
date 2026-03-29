import { Spritesheet, Texture, AnimatedSprite } from 'pixi.js';

export interface SpritesheetConfig {
    url: string;
    data: any; // Spritesheet JSON data
}

export class PixiSpritesheet {
    private spritesheet: Spritesheet | null = null;

    public async load(config: SpritesheetConfig): Promise<void> {
        try {
            this.spritesheet = new Spritesheet(Texture.from(config.url), config.data);
            await this.spritesheet.parse();
        } catch (error) {
            console.error('Failed to load spritesheet:', error);
            throw error;
        }
    }

    public getTexture(frameName: string): Texture | null {
        if (!this.spritesheet) return null;
        return this.spritesheet.textures[frameName] || null;
    }

    public getAnimations(animationName: string): Texture[] | null {
        if (!this.spritesheet) return null;
        return this.spritesheet.animations[animationName] || null;
    }

    public createAnimatedSprite(animationName: string): AnimatedSprite | null {
        const animations = this.getAnimations(animationName);
        if (!animations) return null;
        
        const animatedSprite = new AnimatedSprite(animations);
        return animatedSprite;
    }

    public destroy(): void {
        if (this.spritesheet) {
            this.spritesheet.destroy(true);
            this.spritesheet = null;
        }
    }
}
