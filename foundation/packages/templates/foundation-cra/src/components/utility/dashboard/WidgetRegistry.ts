/**
 * Widget Registry
 *
 * The foundational widget system for Terakota Foundation.
 * This is intentionally framework-agnostic — it works for any grid system
 * (react-grid-layout, CSS grid, etc.) because it only manages registration
 * and rendering, not positioning.
 *
 * DashBuds and other apps add their own grid layer on top of this.
 *
 * Usage:
 *   1. Register a widget: registry.register({ id, name, component, ... })
 *   2. Render it:         <WidgetRenderer widgetId="my-widget" config={{...}} />
 *   3. List all:          registry.getAll()
 */

import { type ComponentType, type ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface WidgetDefinition<TConfig = Record<string, unknown>> {
    /** Unique identifier (slug) */
    id: string;
    /** Display name */
    name: string;
    /** Short description */
    description: string;
    /** Category for marketplace grouping */
    category: WidgetCategory;
    /** Thumbnail or preview icon */
    icon?: ReactNode;
    /** Author (for marketplace widgets) */
    author?: string;
    /** Default grid size hints */
    defaultSize?: { w: number; h: number };
    /** Min/max constraints */
    minSize?: { w: number; h: number };
    maxSize?: { w: number; h: number };
    /** The actual React component */
    component: ComponentType<WidgetProps<TConfig>>;
    /** Default config values */
    defaultConfig?: Partial<TConfig>;
    /** Whether this widget requires a data source */
    requiresDataSource?: boolean;
    /** Tags for search/filtering */
    tags?: string[];
    /** Is this a premium/marketplace widget? */
    premium?: boolean;
    /** Version */
    version?: string;
}

export type WidgetCategory =
    | 'charts'
    | 'data'
    | 'media'
    | 'utility'
    | 'social'
    | 'finance'
    | 'analytics'
    | 'custom';

export interface WidgetProps<TConfig = Record<string, unknown>> {
    /** Widget instance ID (unique per dashboard placement) */
    instanceId: string;
    /** Widget definition config */
    config: TConfig;
    /** Called when the widget wants to update its config */
    onConfigChange?: (newConfig: Partial<TConfig>) => void;
    /** Whether the widget is currently being edited */
    isEditing?: boolean;
    /** Current theme mode — widgets can adapt */
    themeMode?: 'light' | 'dark';
}

export interface WidgetDataSource {
    type: 'json' | 'csv' | 'url' | 'github' | 'ws';
    data?: unknown;
    url?: string;
    refreshInterval?: number;
    headers?: Record<string, string>;
}

// ─── Registry class ───────────────────────────────────────────────────────────
class WidgetRegistry {
    private widgets = new Map<string, WidgetDefinition>();

    register<T = Record<string, unknown>>(definition: WidgetDefinition<T>): void {
        if (this.widgets.has(definition.id)) {
            console.warn(`[WidgetRegistry] Widget "${definition.id}" is already registered. Overwriting.`);
        }
        this.widgets.set(definition.id, definition as WidgetDefinition);
    }

    unregister(id: string): void {
        this.widgets.delete(id);
    }

    get(id: string): WidgetDefinition | undefined {
        return this.widgets.get(id);
    }

    getAll(): WidgetDefinition[] {
        return Array.from(this.widgets.values());
    }

    getByCategory(category: WidgetCategory): WidgetDefinition[] {
        return this.getAll().filter(w => w.category === category);
    }

    search(query: string): WidgetDefinition[] {
        const q = query.toLowerCase();
        return this.getAll().filter(w =>
            w.name.toLowerCase().includes(q) ||
            w.description.toLowerCase().includes(q) ||
            w.tags?.some(t => t.toLowerCase().includes(q))
        );
    }

    has(id: string): boolean {
        return this.widgets.has(id);
    }

    get size(): number {
        return this.widgets.size;
    }
}

// ─── Singleton registry ───────────────────────────────────────────────────────
export const registry = new WidgetRegistry();

// ─── Built-in Foundation widgets ─────────────────────────────────────────────
// Import and register here. More widgets can be registered from any module.

import KpiCard from './widgets/KpiCard';
import TextWidget from './widgets/TextWidget';
import ClockWidget from './widgets/ClockWidget';

registry.register({
    id: 'kpi-card',
    name: 'KPI Card',
    description: 'Display a key metric with optional trend indicator',
    category: 'analytics',
    defaultSize: { w: 3, h: 2 },
    component: KpiCard,
    tags: ['metric', 'number', 'stat', 'kpi'],
    defaultConfig: { title: 'Metric', value: '0', unit: '', trend: 0 },
});

registry.register({
    id: 'text',
    name: 'Text / Markdown',
    description: 'Rich text or Markdown content block',
    category: 'utility',
    defaultSize: { w: 4, h: 3 },
    component: TextWidget,
    tags: ['text', 'markdown', 'notes', 'content'],
    defaultConfig: { content: '# Hello\n\nEdit this widget.' },
});

registry.register({
    id: 'clock',
    name: 'Clock',
    description: 'Live clock with timezone support',
    category: 'utility',
    defaultSize: { w: 2, h: 2 },
    component: ClockWidget,
    tags: ['clock', 'time', 'timezone'],
    defaultConfig: { timezone: 'local', format: '24h', showDate: true },
});

export default registry;
