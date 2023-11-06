/**
 * Configure and register global directives
 */
import type { App } from 'vue';
import { setupResizeDirective } from './resize';

export function setupGlobDirectives(app: App) {
  setupResizeDirective(app);
}
