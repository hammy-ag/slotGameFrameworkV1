export type ServiceFactory<T> = (c: ServiceContainer) => T;

/**
 * Very small DI container so games can override core services cleanly.
 * - Core registers defaults
 * - Game module can replace/extend registrations per game
 */
export class ServiceContainer {
  private readonly factories = new Map<string, ServiceFactory<any>>();
  private readonly instances = new Map<string, any>();

  public register<T>(key: string, factory: ServiceFactory<T>, options?: { override?: boolean }): void {
    const override = options?.override ?? false;
    if (!override && this.factories.has(key)) {
      throw new Error(`Service already registered: ${key}`);
    }
    this.factories.set(key, factory);
    this.instances.delete(key);
  }

  public has(key: string): boolean {
    return this.factories.has(key) || this.instances.has(key);
  }

  public resolve<T>(key: string): T {
    if (this.instances.has(key)) return this.instances.get(key) as T;
    const factory = this.factories.get(key);
    if (!factory) throw new Error(`Service not registered: ${key}`);
    const instance = factory(this);
    this.instances.set(key, instance);
    return instance as T;
  }

  public setInstance<T>(key: string, instance: T, options?: { override?: boolean }): void {
    const override = options?.override ?? false;
    if (!override && (this.instances.has(key) || this.factories.has(key))) {
      throw new Error(`Service already registered: ${key}`);
    }
    this.factories.delete(key);
    this.instances.set(key, instance);
  }
}

