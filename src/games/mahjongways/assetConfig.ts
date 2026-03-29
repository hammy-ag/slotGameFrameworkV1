import type { AssetConfig } from "../../core/assets/AssetConfig";

/**
 * Game asset manifest.
 * Add your URLs like:
 *   { id: "bg", src: new URL("./assets/sprites/bg.png", import.meta.url).href, kind: "image" }
 */
export const assetConfig: AssetConfig = {
  // Each game declares exactly what it wants to load at startup.
  // Example: only games that need the control panel should include it.
  startupBundles: ["common.base", "mahjongways"],
  bundles: [
    {
      name: "common.base",
      assets: [
        // Example (when you add a file):
        // { id: "common.logo", src: new URL("../../assets/common/sprites/logo.png", import.meta.url).href, kind: "image" },
      ],
    },
    {
      name: "common.controlPanel",
      assets: [
        // Put shared UI/control-panel art here (only load in games that use it)
      ],
    },
    {
      name: "mahjongways",
      assets: [
        // Example:
        // { id: "mw.bg", src: new URL("./assets/sprites/bg.png", import.meta.url).href, kind: "image" },
        // Spine requires BOTH skeleton + atlas assets.
        { id: "mw.backLandscape.skeleton", src: new URL("./assets/spine/BackLandscape.json", import.meta.url).href, kind: "spine" },

        // Atlas needs an images mapping because Vite hashes emitted filenames.
        {
          id: "mw.backLandscape.atlas",
          src: new URL("./assets/spine/BackLandscape.atlas", import.meta.url).href,
          kind: "spine",
          data: {
            images: {
              "BackLandscape.png": new URL("./assets/spine/BackLandscape.png", import.meta.url).href,
              "BackLandscape_2.png": new URL("./assets/spine/BackLandscape_2.png", import.meta.url).href,
              "BackLandscape_3.png": new URL("./assets/spine/BackLandscape_3.png", import.meta.url).href,
              "BackLandscape_4.png": new URL("./assets/spine/BackLandscape_4.png", import.meta.url).href,
              "BackLandscape_5.png": new URL("./assets/spine/BackLandscape_5.png", import.meta.url).href,
              "BackLandscape_6.png": new URL("./assets/spine/BackLandscape_6.png", import.meta.url).href,
            },
          },
        },
      ],
    },
  ],
};

