import { Container } from 'pixi.js';

/**
 * Base class for all Pixi.js wrappers.
 * Provides a common interface for shared properties like position, scale, and visibility.
 */
export abstract class BaseWrapper<T extends Container> {
    protected element: T;

    constructor(element: T) {
        this.element = element;
    }

    /**
     * Get the underlying Pixi element
     */
    public getElement(): T {
        return this.element;
    }

    /**
     * Set the position of the element
     */
    public setPosition(x: number, y: number): void {
        this.element.x = x;
        this.element.y = y;
    }

    /**
     * Set the scale of the element
     */
    public setScale(x: number, y?: number): void {
        this.element.scale.set(x, y ?? x);
    }

    /**
     * Set the rotation of the element
     */
    public setRotation(rotation: number): void {
        this.element.rotation = rotation;
    }

    /**
     * Set the visibility of the element
     */
    public setVisible(visible: boolean): void {
        this.element.visible = visible;
    }

    /**
     * Set the interactivity of the element
     */
    public setInteractive(interactive: boolean): void {
        this.element.eventMode = interactive ? 'static' : 'none';
        this.element.cursor = interactive ? 'pointer' : 'default';
    }

    /**
     * Clear and/or destroy the element
     */
    public destroy(options?: any): void {
        this.element.destroy(options);
    }
}
