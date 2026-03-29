import type { Application } from "../Application";
import type { LauncherConfig } from "../Launcher";
import type { ServiceContainer } from "../ServiceContainer";

/**
 * Optional framework modules (assets, ui, audio, telemetry, etc).
 * Games opt-in by listing modules in their `GameModule.modules`.
 *
 * This is the main mechanism to avoid redundant work and avoid
 * affecting other games: no module, no behavior.
 */
export interface FrameworkModule {
  id: string;

  /** Register default services or override existing ones */
  registerServices?(services: ServiceContainer): void;

  /** Adjust launch config (e.g. resizeMode, background) */
  configure?(config: LauncherConfig): LauncherConfig;

  /** Called before Pixi init */
  beforeInit?(ctx: { application: Application; services: ServiceContainer; config: LauncherConfig }): Promise<void> | void;

  /** Called after Pixi init + initial resize */
  afterInit?(ctx: { application: Application; services: ServiceContainer; config: LauncherConfig }): Promise<void> | void;
}

