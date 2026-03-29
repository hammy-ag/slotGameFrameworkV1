import { Container, Graphics, Sprite, Text, AnimatedSprite } from 'pixi.js';
import { BaseWrapper } from './BaseWrapper';

export class PixiContainer extends BaseWrapper<Container> {
    constructor() {
        super(new Container());
    }

    public getContainer(): Container {
        return this.element;
    }

    public addChild(child: Container | Graphics | Sprite | Text | AnimatedSprite): void {
        this.element.addChild(child);
    }

    public removeChild(child: Container | Graphics | Sprite | Text | AnimatedSprite): void {
        this.element.removeChild(child);
    }
}
