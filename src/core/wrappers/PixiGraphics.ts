import { Graphics } from 'pixi.js';
import { BaseWrapper } from './BaseWrapper';

export interface GraphicsStyle {
    fillColor?: number;
    lineColor?: number;
    lineWidth?: number;
    alpha?: number;
}

export class PixiGraphics extends BaseWrapper<Graphics> {
    constructor() {
        super(new Graphics());
    }

    public getGraphics(): Graphics {
        return this.element;
    }

    public clear(): void {
        this.element.clear();
    }

    public drawRect(x: number, y: number, width: number, height: number, style?: GraphicsStyle): void {
        this.element.clear();
        
        if (style?.fillColor !== undefined) {
            this.element.rect(x, y, width, height).fill({ color: style.fillColor, alpha: style.alpha ?? 1 });
        }
        
        if (style?.lineColor !== undefined) {
            this.element.stroke({ color: style.lineColor, width: style.lineWidth ?? 1 });
        }
    }

    public drawCircle(x: number, y: number, radius: number, style?: GraphicsStyle): void {
        this.element.clear();
        
        if (style?.fillColor !== undefined) {
            this.element.circle(x, y, radius).fill({ color: style.fillColor, alpha: style.alpha ?? 1 });
        }
        
        if (style?.lineColor !== undefined) {
            this.element.stroke({ color: style.lineColor, width: style.lineWidth ?? 1 });
        }
    }

    public drawRoundedRect(x: number, y: number, width: number, height: number, radius: number, style?: GraphicsStyle): void {
        this.element.clear();
        
        if (style?.fillColor !== undefined) {
            this.element.roundRect(x, y, width, height, radius).fill({ color: style.fillColor, alpha: style.alpha ?? 1 });
        }
        
        if (style?.lineColor !== undefined) {
            this.element.stroke({ color: style.lineColor, width: style.lineWidth ?? 1 });
        }
    }
}
