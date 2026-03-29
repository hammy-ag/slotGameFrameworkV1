import { Application } from './Application';
import type { GameModule } from './GameModule';
import type { FrameworkModule } from './modules/FrameworkModule';

/**
 * Configuration for the Launcher
 */
export interface LauncherConfig {
    width: number;
    height: number;
    backgroundColor?: number;
    antialias?: boolean;
    parentElement: HTMLElement;
    /**
     * How the game scales inside the browser window:
     * - "cover": renderer is resized to the full viewport (best for true fullscreen)
     * - "contain": keep aspect ratio and letterbox/pillarbox via CSS sizing
     * - "fixed": never resize (use your design resolution only)
     */
    resizeMode?: 'cover' | 'contain' | 'fixed';
}

/**
 * The Launcher handles the "bootstrap" of the game.
 * It sets up the Pixi Application, handles window resizing, and prepares the environment.
 * Games can extend this class to customize the launch sequence.
 */
export class Launcher {
    protected readonly application: Application;
    protected config!: LauncherConfig;
    protected gameModule?: GameModule;
    protected modules: FrameworkModule[] = [];

    constructor() {
        this.application = Application.getInstance();
    }

    /**
     * Start the launch sequence
     */
    public async launch(config: LauncherConfig, gameModule?: GameModule): Promise<void> {
        this.gameModule = gameModule;
        this.modules = gameModule?.modules ?? [];

        // Apply config transforms in a predictable order:
        // base config -> framework modules -> game module
        let nextConfig = config;
        for (const m of this.modules) {
            if (m.configure) nextConfig = m.configure(nextConfig);
        }
        this.config = gameModule?.configure ? gameModule.configure(nextConfig) : nextConfig;
        
        console.log('Launcher: Starting framework...');
        
        // Ensure body/parent styles are correct for full-screen display
        if (config.parentElement === document.body) {
            document.documentElement.style.margin = '0';
            document.documentElement.style.padding = '0';
            document.documentElement.style.width = '100%';
            document.documentElement.style.height = '100%';

            document.body.style.margin = '0';
            document.body.style.padding = '0';
            document.body.style.overflow = 'hidden';
            document.body.style.backgroundColor = 'black';
            document.body.style.width = '100%';
            document.body.style.height = '100%';
        }

        // Register services (framework modules first, then game overrides)
        for (const m of this.modules) {
            if (m.registerServices) m.registerServices(this.application.services);
        }
        if (this.gameModule?.registerServices) this.gameModule.registerServices(this.application.services);

        // beforeInit hooks (modules first, then game)
        for (const m of this.modules) {
            if (m.beforeInit) {
                await m.beforeInit({ application: this.application, services: this.application.services, config: this.config });
            }
        }
        if (this.gameModule?.beforeInit) {
            await this.gameModule.beforeInit({ application: this.application, services: this.application.services, config: this.config });
        }

        await this.application.init(config);

        // Setup resizing
        window.addEventListener('resize', () => this.onResize());
        this.onResize(); // Initial call

        // afterInit hooks (modules first, then game)
        for (const m of this.modules) {
            if (m.afterInit) {
                await m.afterInit({ application: this.application, services: this.application.services, config: this.config });
            }
        }
        if (this.gameModule?.afterInit) {
            await this.gameModule.afterInit({ application: this.application, services: this.application.services, config: this.config });
        }

        console.log('Launcher: Environment ready.');
    }

    /**
     * Default resizing logic. 
     * Makes the canvas cover the full viewport.
     */
    protected onResize(): void {
        const vpw = window.innerWidth;
        const vph = window.innerHeight;
        const mode = this.config.resizeMode ?? 'cover';

        const canvas = this.application.canvas;
        canvas.style.display = 'block';

        if (mode === 'fixed') {
            // Keep design resolution and let the page place it.
            console.log(`Launcher: Resize skipped (fixed mode) | Viewport: ${vpw}x${vph}`);
            return;
        }

        if (mode === 'contain') {
            const { width, height } = this.config;
            const windowRatio = vpw / vph;
            const gameRatio = width / height;

            let finalWidth: number;
            let finalHeight: number;

            if (windowRatio > gameRatio) {
                finalHeight = vph;
                finalWidth = vph * gameRatio;
            } else {
                finalWidth = vpw;
                finalHeight = vpw / gameRatio;
            }

            canvas.style.position = 'absolute';
            canvas.style.left = `${(vpw - finalWidth) / 2}px`;
            canvas.style.top = `${(vph - finalHeight) / 2}px`;
            canvas.style.width = `${finalWidth}px`;
            canvas.style.height = `${finalHeight}px`;

            // Keep renderer at design resolution for consistent layout.
            this.application.app.renderer.resize(width, height);

            console.log(`Launcher: Resized (contain) | Viewport: ${vpw}x${vph} | CSS: ${Math.round(finalWidth)}x${Math.round(finalHeight)} | Renderer: ${width}x${height}`);
            return;
        }

        // cover (default): real fullscreen
        canvas.style.position = 'fixed';
        canvas.style.left = '0';
        canvas.style.top = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';

        this.application.app.renderer.resize(vpw, vph);
        console.log(`Launcher: Resized (cover) | Viewport/Renderer: ${vpw}x${vph}`);
    }
}
