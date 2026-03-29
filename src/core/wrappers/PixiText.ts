import { Text, TextStyle } from 'pixi.js';
import type { TextStyleOptions } from 'pixi.js';
import { BaseWrapper } from './BaseWrapper';

export interface TextConfig {
    text: string;
    style?: Partial<TextStyleOptions>;
    anchor?: { x: number; y: number };
}

export class PixiText extends BaseWrapper<Text> {
    constructor(config: TextConfig) {
        super(new Text({
            text: config.text,
            style: config.style,
        }));

        if (config.anchor) {
            this.element.anchor.set(config.anchor.x, config.anchor.y);
        }
    }

    public getText(): Text {
        return this.element;
    }

    public setText(text: string): void {
        this.element.text = text;
    }

    public setStyle(style: Partial<TextStyleOptions>): void {
        this.element.style = new TextStyle(style);
    }

    public setAnchor(x: number, y: number): void {
        this.element.anchor.set(x, y);
    }
}
