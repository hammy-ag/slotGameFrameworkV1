import { BaseWrapper } from "./BaseWrapper";
import { Spine } from "@pixi/spine-pixi";

export interface SpineConfig {
  /** Spine skeleton JSON (or .skel) asset id (Pixi Assets cache key) */
  skeletonId: string;
  /** Spine atlas (.atlas) asset id (Pixi Assets cache key) */
  atlasId: string;
  /** Optional spine parsing scale */
  scale?: number;
  /** Optional initial animation */
  animation?: string;
  /** Optional loop flag for initial animation */
  loop?: boolean;
  /** Optional initial skin */
  skin?: string;
}

/**
 * Spine wrapper for Pixi v8 using `@pixi/spine-pixi`.
 *
 * Note: you must load the spine skeleton JSON via `Assets` first and
 * register it with an id matching `skeletonId`.
 */
export class PixiSpine extends BaseWrapper<Spine> {
  constructor(config: SpineConfig) {
    // `Spine.from()` pulls both skeleton + atlas from Pixi Assets cache by id
    const spine = Spine.from({
      skeleton: config.skeletonId,
      atlas: config.atlasId,
      scale: config.scale ?? 1,
    });
    super(spine);

    if (config.skin) {
      this.setSkin(config.skin);
    }

    if (config.animation) {
      this.play(config.animation, config.loop ?? true);
    }
  }

  public getSpine(): Spine {
    return this.element;
  }

  public play(animation: string, loop: boolean = true, trackIndex: number = 0): void {
    this.element.state.setAnimation(trackIndex, animation, loop);
  }

  public addAnimation(animation: string, loop: boolean = true, delay: number = 0, trackIndex: number = 0): void {
    this.element.state.addAnimation(trackIndex, animation, loop, delay);
  }

  public clearTracks(): void {
    this.element.state.clearTracks();
  }

  public setSkin(skinName: string): void {
    this.element.skeleton.setSkinByName(skinName);
    this.element.skeleton.setSlotsToSetupPose();
  }

  public getSkinList(): string[] {
    return this.element.skeleton.data.skins.map((skin) => skin.name);
  }
}

