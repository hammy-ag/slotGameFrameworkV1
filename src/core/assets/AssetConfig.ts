export type AssetKind = "image" | "spritesheet" | "spine" | "sound" | "font" | "json" | "other";

/**
 * A single asset entry inside a bundle.
 * `src` should be a URL string, typically built with:
 *   new URL("./path/file.png", import.meta.url).href
 */
export interface AssetEntry {
  /** Unique id used to retrieve the asset later */
  id: string;
  /** URL (or path) to the asset */
  src: string;
  /**
   * Optional Pixi Assets metadata passed through to the loader.
   * Needed for cases like Spine atlases where you must provide a mapping
   * from atlas page names to the actual emitted URLs (Vite hashes filenames).
   */
  data?: any;
  /** Optional metadata for your framework/pipeline */
  kind?: AssetKind;
  /** Arbitrary tags for filtering (e.g. "ui", "reels", "feature:fs") */
  tags?: string[];
}

export interface AssetBundleConfig {
  /** Bundle name used with the loader */
  name: string;
  /** Assets in this bundle */
  assets: AssetEntry[];
}

/**
 * Scalable manifest shape:
 * - split by bundles (common, basegame, feature, locale, skin, etc.)
 * - each game provides a manifest, core loads bundles by name
 */
export interface AssetConfig {
  bundles: AssetBundleConfig[];
  /**
   * Optional recommended startup bundles for a game.
   * This prevents redundant loading: each game chooses what it needs
   * (e.g. control panel bundle only for games that use it).
   */
  startupBundles?: string[];
}

