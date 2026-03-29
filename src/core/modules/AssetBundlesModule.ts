import type { FrameworkModule } from "./FrameworkModule";
import type { AssetConfig } from "../assets/AssetConfig";
import type { AssetLoader } from "../assets/AssetLoader";
import { ServiceKeys } from "../services/ServiceKeys";

/**
 * Registers an asset manifest into the shared AssetLoader.
 * This is a framework module so games can opt-in without changing core.
 */
export class AssetBundlesModule implements FrameworkModule {
  public readonly id = "assets.bundles";

  constructor(private readonly config: AssetConfig) {}

  registerServices(services: any): void {
    const assets = services.resolve<AssetLoader>(ServiceKeys.assets);
    assets.register(this.config);
  }
}

