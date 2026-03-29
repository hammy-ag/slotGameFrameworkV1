import { Assets } from "pixi.js";
import type { AssetBundleConfig, AssetConfig, AssetEntry } from "./AssetConfig";

export interface AssetLoadProgress {
  bundle: string;
  /** 0..1 within this bundle (best-effort) */
  ratio: number;
}

/**
 * Bundle-based asset loader on top of Pixi v8 `Assets`.
 * - Register bundles from config
 * - Load bundles by name
 * - Retrieve assets by id (via Pixi Assets cache)
 */
export class AssetLoader {
  private readonly registeredBundles = new Map<string, AssetBundleConfig>();

  public register(config: AssetConfig): void {
    for (const bundle of config.bundles) {
      this.registerBundle(bundle, { override: true });
    }
  }

  public registerBundle(bundle: AssetBundleConfig, options?: { override?: boolean }): void {
    const override = options?.override ?? false;
    if (!override && this.registeredBundles.has(bundle.name)) {
      throw new Error(`Bundle already registered: ${bundle.name}`);
    }

    this.registeredBundles.set(bundle.name, bundle);

    // Register each asset by alias so we can attach metadata when needed.
    // (Bundles are still tracked by us for loading/unloading.)
    for (const asset of bundle.assets) {
      Assets.add({
        alias: asset.id,
        src: asset.src,
        data: asset.data,
      } as any);
    }
  }

  public getBundle(name: string): AssetBundleConfig | undefined {
    return this.registeredBundles.get(name);
  }

  public listBundles(): string[] {
    return [...this.registeredBundles.keys()];
  }

  public async loadBundle(name: string, onProgress?: (p: AssetLoadProgress) => void): Promise<void> {
    if (!this.registeredBundles.has(name)) {
      throw new Error(`Bundle not registered: ${name}`);
    }

    const bundle = this.registeredBundles.get(name)!;
    const total = Math.max(1, bundle.assets.length);
    let loaded = 0;

    // Load sequentially to provide deterministic progress.
    // (You can upgrade to parallel later + weighted progress if needed.)
    for (const entry of bundle.assets) {
      await this.loadEntry(entry);
      loaded++;
      onProgress?.({ bundle: name, ratio: loaded / total });
    }
  }

  public async loadBundles(names: string[], onProgress?: (p: AssetLoadProgress) => void): Promise<void> {
    for (const name of names) {
      await this.loadBundle(name, onProgress);
    }
  }

  public get<T = any>(id: string): T {
    return Assets.get(id) as T;
  }

  public async unloadBundle(name: string): Promise<void> {
    // Pixi Assets provides unload by keys; we use our registry.
    const bundle = this.registeredBundles.get(name);
    if (!bundle) return;

    const ids = bundle.assets.map((a) => a.id);
    await Assets.unload(ids);
  }

  private async loadEntry(entry: AssetEntry): Promise<void> {
    // Load by alias/id so retrieval works via `Assets.get(id)` and
    // other systems (e.g. `Spine.from(id)`) can reference stable ids.
    await Assets.load(entry.id);
  }
}

