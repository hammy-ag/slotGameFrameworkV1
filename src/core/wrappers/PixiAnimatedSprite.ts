import { AnimatedSprite, Texture } from 'pixi.js';
import { BaseWrapper } from './BaseWrapper';

export interface AnimatedSpriteConfig {
    textures: Texture[];
    animationSpeed?: number;
    loop?: boolean;
}

export class PixiAnimatedSprite extends BaseWrapper<AnimatedSprite> {
    constructor(config: AnimatedSpriteConfig) {
        super(new AnimatedSprite(config.textures));
        this.element.animationSpeed = config.animationSpeed ?? 0.1;
        this.element.loop = config.loop ?? true;
    }

    public getAnimatedSprite(): AnimatedSprite {
        return this.element;
    }

    public play(): void {
        this.element.play();
    }

    public stop(): void {
        this.element.stop();
    }

    public gotoAndPlay(frameNumber: number): void {
        this.element.gotoAndPlay(frameNumber);
    }

    public gotoAndStop(frameNumber: number): void {
        this.element.gotoAndStop(frameNumber);
    }

    public setAnimationSpeed(speed: number): void {
        this.element.animationSpeed = speed;
    }

    public setLoop(loop: boolean): void {
        this.element.loop = loop;
    }
}
