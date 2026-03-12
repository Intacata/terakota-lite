import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ─── Layout variant type ─────────────────────────────────────────────────────
export type LayoutVariant =
    | 'sidebar-vertical'       // Left sidebar + TopBar (default, collapsible)
    | 'sidebar-vertical-right' // Left sidebar + TopBar + Right panel
    | 'sidebar-horizontal'     // Horizontal top navigation bar only
    | 'sidebar-horizontal-right' // Horizontal top nav + Right panel
    | 'sidebar-dual'           // Left sidebar + always-visible right panel
    | 'minimal'                // Header only, no sidebar
    | 'minimal-right'          // Header + Right panel only
    | 'tabbed';                // Tab-based top navigation

export interface MenuItem {
    id: string;
    title: string;
    path?: string;
    icon?: string;
    type?: 'group' | 'item' | 'divider';
    children?: MenuItem[];
    chip?: { label: string; color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' };
    disabled?: boolean;
    external?: boolean;
}

interface SidebarState {
    open: boolean;
    mobileOpen: boolean;
    miniMode: boolean;
    activeItem: string | null;
    openItems: string[];
    menuItems: MenuItem[];
    rightPanelOpen: boolean;
    rightPanelWidth: number;
    layoutVariant: LayoutVariant;
}

const initialState: SidebarState = {
    open: false,
    mobileOpen: false,
    miniMode: false,
    activeItem: null,
    openItems: [],
    menuItems: [],
    rightPanelOpen: false,
    rightPanelWidth: 280,
    layoutVariant: 'TERAKOTA_LAYOUT_VARIANT' as LayoutVariant,
};

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        toggleSidebar(state) { state.open = !state.open; },
        setSidebarOpen(state, action: PayloadAction<boolean>) { state.open = action.payload; },
        toggleMobileSidebar(state) { state.mobileOpen = !state.mobileOpen; },
        setMobileSidebarOpen(state, action: PayloadAction<boolean>) { state.mobileOpen = action.payload; },
        toggleMiniMode(state) { state.miniMode = !state.miniMode; },
        setMiniMode(state, action: PayloadAction<boolean>) { state.miniMode = action.payload; },
        setActiveItem(state, action: PayloadAction<string>) { state.activeItem = action.payload; },
        toggleOpenItem(state, action: PayloadAction<string>) {
            const idx = state.openItems.indexOf(action.payload);
            if (idx >= 0) state.openItems.splice(idx, 1);
            else state.openItems.push(action.payload);
        },
        initializeMenu(state, action: PayloadAction<MenuItem[]>) { state.menuItems = action.payload; },
        setMenuItems(state, action: PayloadAction<MenuItem[]>) { state.menuItems = action.payload; },
        toggleRightPanel(state) { state.rightPanelOpen = !state.rightPanelOpen; },
        setRightPanelOpen(state, action: PayloadAction<boolean>) { state.rightPanelOpen = action.payload; },
        setRightPanelWidth(state, action: PayloadAction<number>) { state.rightPanelWidth = action.payload; },
        setLayoutVariant(state, action: PayloadAction<LayoutVariant>) { state.layoutVariant = action.payload; },
    },
});

export const {
    toggleSidebar, setSidebarOpen,
    toggleMobileSidebar, setMobileSidebarOpen,
    toggleMiniMode, setMiniMode,
    setActiveItem, toggleOpenItem,
    initializeMenu, setMenuItems,
    toggleRightPanel, setRightPanelOpen, setRightPanelWidth,
    setLayoutVariant,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;
