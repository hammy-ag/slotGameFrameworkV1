import { Sprite, Texture } from 'pixi.js';
import { BaseWrapper } from './BaseWrapper';

export interface SpriteConfig {
    texture?: Texture;
    width?: number;
    height?: number;
    anchor?: { x: number; y: number };
}

export class PixiSprite extends BaseWrapper<Sprite> {
    constructor(config?: SpriteConfig) {
        super(new Sprite(config?.texture));
        
        if (config?.width) this.element.width = config.width;
        if (config?.height) this.element.height = config.height;
        if (config?.anchor) this.element.anchor.set(config.anchor.x, config.anchor.y);
    }

    public getSprite(): Sprite {
        return this.element;
    }

    public setTexture(texture: Texture): void {
        this.element.texture = texture;
    }

    public setSize(width: number, height: number): void {
        this.element.width = width;
        this.element.height = height;
    }

    public setAnchor(x: number, y: number): void {
        this.element.anchor.set(x, y);
    }
}
