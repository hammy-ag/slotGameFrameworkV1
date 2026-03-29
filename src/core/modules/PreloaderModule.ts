import { Container } from "pixi.js";
import type { FrameworkModule } from "./FrameworkModule";
import { PreloaderEvents } from "./PreloaderEvents";
import { WrapperType } from "../wrappers/PixiWrapperManager";

export interface PreloaderModuleOptions {
  title?: string;
}

/**
 * Simple Pixi-based preloader screen.
 * Listens to `PreloaderEvents` and removes itself when done.
 */
export class PreloaderModule implements FrameworkModule {
  public readonly id = "ui.preloader";
  private root?: Container;
  private unsubscribers: Array<() => void> = [];

  constructor(private readonly options?: PreloaderModuleOptions) {}

  public afterInit(ctx: any): void {
    const { application } = ctx as {
      application: {
        app: { stage: Container; screen: { width: number; height: number } };
        events: { on: (e: string, cb: (...a: any[]) => void) => void; off: (e: string, cb: (...a: any[]) => void) => void };
        wrapperManager: any;
      };
    };

    const stage = application.app.stage;
    const screen = application.app.screen;

    const root = new Container();
    root.sortableChildren = true;
    this.root = root;

    const bg = application.wrapperManager.createWrapper(WrapperType.GRAPHICS);
    bg.drawRect(0, 0, screen.width, screen.height, { fillColor: 0x070A12, alpha: 1 });
    const bgGfx = bg.getGraphics();
    (bgGfx as any).zIndex = 0;

    const title = application.wrapperManager.createWrapper(WrapperType.TEXT, {
      text: this.options?.title ?? "Loading...",
      style: { fill: 0xffffff, fontSize: 34, fontFamily: "Arial" },
    });
    title.setAnchor(0.5, 0.5);
    title.setPosition(screen.width / 2, screen.height / 2 - 30);
    const titleObj = title.getElement();
    (titleObj as any).zIndex = 1;

    const status = application.wrapperManager.createWrapper(WrapperType.TEXT, {
      text: "0%",
      style: { fill: 0xffffff, fontSize: 18, fontFamily: "Arial" },
    });
    status.setAnchor(0.5, 0.5);
    status.setPosition(screen.width / 2, screen.height / 2 + 20);
    const statusObj = status.getElement();
    (statusObj as any).zIndex = 1;

    root.addChild(bgGfx, titleObj, statusObj);
    stage.addChild(root);

    const onProgress = (p: { bundle: string; ratio: number }) => {
      const pct = Math.max(0, Math.min(100, Math.round(p.ratio * 100)));
      status.setText(`${pct}%  (${p.bundle})`);
    };

    const onDone = () => this.destroy(stage);
    const onError = () => {
      status.setText("Failed to load assets");
    };

    application.events.on(PreloaderEvents.progress, onProgress);
    application.events.on(PreloaderEvents.done, onDone);
    application.events.on(PreloaderEvents.error, onError);

    this.unsubscribers.push(
      () => application.events.off(PreloaderEvents.progress, onProgress),
      () => application.events.off(PreloaderEvents.done, onDone),
      () => application.events.off(PreloaderEvents.error, onError),
    );
  }

  private destroy(stage: Container): void {
    this.unsubscribers.forEach((u) => u());
    this.unsubscribers = [];

    if (this.root) {
      stage.removeChild(this.root);
      this.root.destroy({ children: true });
      this.root = undefined;
    }
  }
}

