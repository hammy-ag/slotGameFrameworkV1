import type { LauncherConfig } from "./Launcher";
import type { Application } from "./Application";
import type { ServiceContainer } from "./ServiceContainer";
import type { FrameworkModule } from "./modules/FrameworkModule";

/**
 * Game-level extension points.
 * A game can:
 * - register/override services (assets, audio, math, telemetry, etc.)
 * - run logic before/after framework init
 * - customize launch config (e.g. resize strategy)
 */
export interface GameModule {
  /** Optional unique id (used for logs/telemetry) */
  id?: string;

  /** Optional framework modules to enable for this game */
  modules?: FrameworkModule[];

  /** Register or override services for this game */
  registerServices?(services: ServiceContainer): void;

  /** Adjust launch config before init (e.g. width/height, resizeMode) */
  configure?(config: LauncherConfig): LauncherConfig;

  /** Called before Pixi init */
  beforeInit?(ctx: { application: Application; services: ServiceContainer; config: LauncherConfig }): Promise<void> | void;

  /** Called after Pixi init + initial resize */
  afterInit?(ctx: { application: Application; services: ServiceContainer; config: LauncherConfig }): Promise<void> | void;
}

