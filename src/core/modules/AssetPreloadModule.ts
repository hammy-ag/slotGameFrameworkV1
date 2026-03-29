import type { FrameworkModule } from "./FrameworkModule";
import type { AssetLoader } from "../assets/AssetLoader";
import { ServiceKeys } from "../services/ServiceKeys";
import { PreloaderEvents } from "./PreloaderEvents";

/**
 * Loads specified asset bundles and emits progress events.
 * Pair it with `PreloaderModule` to show a loading screen.
 */
export class AssetPreloadModule implements FrameworkModule {
  public readonly id = "assets.preload";

  constructor(private readonly bundles: string[]) {}

  public async afterInit(ctx: any): Promise<void> {
    const { application, services } = ctx as {
      application: { events: { emit: (e: string, ...args: any[]) => void } };
      services: { resolve: <T>(k: string) => T };
    };

    const assets = services.resolve<AssetLoader>(ServiceKeys.assets);

    try {
      await assets.loadBundles(this.bundles, (p) => {
        application.events.emit(PreloaderEvents.progress, {
          bundle: p.bundle,
          ratio: p.ratio,
        });
      });
      application.events.emit(PreloaderEvents.done);
    } catch (err) {
      application.events.emit(PreloaderEvents.error, err);
      throw err;
    }
  }
}

